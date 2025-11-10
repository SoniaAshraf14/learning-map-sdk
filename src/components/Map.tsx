import { GoogleMap, LoadScript, Polyline, Marker, InfoWindow } from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = { width: "800px", height: "600px" };
const center = { lat: 24.8607, lng: 67.0011 };

const zigzagPath = [
  { lat: 24.8607, lng: 67.0011 },
  { lat: 24.8620, lng: 67.0020 },
  { lat: 24.8610, lng: 67.0030 },
  { lat: 24.8630, lng: 67.0040 },
  { lat: 24.8600, lng: 67.0050 }
];


export default function Map() {
  const [hoverPos, setHoverPos] = useState<{ lat: number, lng: number } | null>(null);
  const [arrowSymbol, setArrowSymbol] = useState<google.maps.Symbol | null>(null);
  const [circleSymbol, setCircleSymbol] = useState<google.maps.Symbol | null>(null);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      onLoad={() => {
        setArrowSymbol({
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 3,
          strokeColor: "#0000FF"
        });
        setCircleSymbol({
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 5,
          fillColor: "#0000FF",
          fillOpacity: 1,
          strokeColor: "#0000FF",
          strokeWeight: 1
        });
      }}
    >
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
        {zigzagPath.map((point, index) => {
          if (index < zigzagPath.length - 1) {
            const segment = [zigzagPath[index], zigzagPath[index + 1]];
            const firstSegment = index === 0;
            const isLastSegment = index === zigzagPath.length - 1;
            let iconsArray: google.maps.IconSequence[] = [];
            if (firstSegment) {
              iconsArray = circleSymbol ? [{ icon: circleSymbol, offset: "1%" }] : [];
            } else if (!isLastSegment) {
              iconsArray = arrowSymbol ? [{ icon: arrowSymbol, offset: "5%" }] : [];
            }
            return (
              <>
                <Polyline
                  key={index}
                  onMouseOver={() => setHoverPos(zigzagPath[index])}
                  onMouseOut={() => setHoverPos(null)}
                  path={segment}
                  options={{
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    icons: iconsArray
                  }}
                />
                {hoverPos && (
                  <InfoWindow position={hoverPos}>
                    <div>
                      <div><b>Latitude:</b> {hoverPos.lat}</div>
                      <div><b>Longitude:</b> {hoverPos.lng}</div>
                    </div>
                  </InfoWindow>
                )}
              </>
            );
          }
          return null;
        })}
        <Marker position={zigzagPath[zigzagPath.length - 1]} label="End" onMouseOver={() => setHoverPos(zigzagPath[zigzagPath.length - 1])}
          onMouseOut={() => setHoverPos(null)} />
      </GoogleMap>
    </LoadScript>
  );
}
