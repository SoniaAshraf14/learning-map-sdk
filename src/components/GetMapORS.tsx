
import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Polyline, Marker } from "@react-google-maps/api";

interface LatLng {
  lat: number;
  lng: number;
}

interface RouteData {
  type: string;
  coords: LatLng[];
  color: string;
  dashed?: boolean;
}

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center: LatLng = { lat: 49.41461, lng: 8.681495 };

// === Fetch Route Function ===
async function fetchRoute(profile: string, start: string, end: string): Promise<LatLng[]> {
  const apiKey = import.meta.env.VITE_API_ORS_KEY;
  const url = `https://api.openrouteservice.org/v2/directions/${profile}?api_key=${apiKey}&start=${start}&end=${end}&geometry_format=geojson`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.features || data.features.length === 0) {
    console.error(`No features found for ${profile}`, data);
    return [];
  }

  // Convert [lng, lat] → { lat, lng }
  return data.features[0].geometry.coordinates.map(([lng, lat]: [number, number]) => ({
    lat,
    lng,
  }));
}

const GetMapORS: React.FC = () => {
  const [routes, setRoutes] = useState<RouteData[]>([]);

  useEffect(() => {
    async function loadRoutes() {
      try {
        // Slightly offset start/end for each route so they appear distinct
        const startDriving = "8.681495,49.41461";
        const endDriving = "8.687872,49.420318";

        const startCycling = "8.681895,49.41491"; // ~40m east
        const endCycling = "8.688372,49.420518";  // ~40m east

        const startWalking = "8.681195,49.41421"; // ~40m west
        const endWalking = "8.687372,49.420118";  // ~40m west

        const [driving, cycling, walking] = await Promise.all([
          fetchRoute("driving-car", startDriving, endDriving),
          fetchRoute("cycling-regular", startCycling, endCycling),
          fetchRoute("foot-walking", startWalking, endWalking),
        ]);

        setRoutes([
          { type: "Driving", coords: driving, color: "#1E90FF" },
          { type: "Cycling", coords: cycling, color: "#32CD32" },
          { type: "Walking", coords: walking, color: "#FF4500", dashed: true },
        ]);
      } catch (err) {
        console.error("Error loading routes:", err);
      }
    }
    loadRoutes();
  }, []);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
      <div style={{ position: "relative" }}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
          {/* Start Marker */}
          <Marker position={center} label="A" />
          {/* End Marker */}
          <Marker position={{ lat: 49.420318, lng: 8.687872 }} label="B" />

          {/* Routes */}
          {routes.map((route, i) => (
            <Polyline
              key={i}
              path={route.coords}
              options={{
                strokeColor: route.color,
                strokeOpacity: route.dashed ? 0 : 1,
                strokeWeight: 5,
                icons: [
                  {
                    icon: {
                      path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                      scale: 2,
                      strokeColor: route.color,
                    },
                    offset: "100%",
                    repeat: "100px",
                  },
                  ...(route.dashed
                    ? [
                        {
                          icon: {
                            path: "M 0,-1 0,1",
                            strokeOpacity: 1,
                            scale: 4,
                            strokeColor: route.color,
                          },
                          offset: "0",
                          repeat: "20px",
                        },
                      ]
                    : []),
                ],
              }}
            />
          ))}
        </GoogleMap>

        {/* === Legend === */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            background: "white",
            padding: "10px 15px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", fontSize: "15px" }}>🗺️ Route Legend</h3>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <div style={{ width: 20, height: 4, background: "#1E90FF", marginRight: 8 }}></div>
            Driving (Blue)
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <div style={{ width: 20, height: 4, background: "#32CD32", marginRight: 8 }}></div>
            Cycling (Green)
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 20,
                height: 4,
                background:
                  "repeating-linear-gradient(90deg, #FF4500, #FF4500 4px, transparent 4px, transparent 8px)",
                marginRight: 8,
              }}
            ></div>
            Walking (Orange Dashed)
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default GetMapORS;
