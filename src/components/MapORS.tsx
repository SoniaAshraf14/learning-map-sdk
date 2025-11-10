import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Polyline, Marker } from "@react-google-maps/api";
import polyline from "@mapbox/polyline";

interface LatLng {
  lat: number;
  lng: number;
}

const containerStyle = { width: "800px", height: "600px" };
const center: LatLng = { lat: 24.8607, lng: 67.0011 };

const MapORS: React.FC = () => {
  const [path, setPath] = useState<LatLng[]>([]);

  useEffect(() => {
    const getRoute = async () => {
      try {
        const response = await fetch(
          "https://api.openrouteservice.org/v2/directions/driving-car",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${import.meta.env.VITE_API_ORS_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              coordinates: [
                [67.0011, 24.8607],
                [67.0050, 24.8600]
              ]
            })
          }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
       const geoPolyline = data.routes[0].geometry; // get encoded polyline
const coords: LatLng[] = polyline.decode(geoPolyline).map(
  (point: number[]) => ({ lat: point[0], lng: point[1] })
);

        setPath(coords);

      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    getRoute();
  }, []);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
        {path.length > 0 && (
          <Polyline path={path} options={{ strokeColor: "#c5611eff", strokeWeight: 3 }} />
        )}
        {path.length > 0 && (
          <>
            <Marker position={path[0]} label="Start" />
            <Marker position={path[path.length - 1]} label="End" />
          </>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapORS;
