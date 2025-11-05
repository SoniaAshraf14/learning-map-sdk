import { GoogleMap, LoadScript, Polyline, Marker } from "@react-google-maps/api";

type LatLng = {
  lat: number;
  lng: number;
};

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "500px",
};

const origin: LatLng = { lat: 37.7749, lng: -122.4194 }; // San Francisco
const destination: LatLng = { lat: 34.0522, lng: -118.2437 }; // Los Angeles

const pathCoordinates: LatLng[] = [origin, destination];

export default function Map() {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}>
      <GoogleMap mapContainerStyle={containerStyle} center={origin} zoom={6}>
        <Marker position={origin} />
        <Marker position={destination} />
        <Polyline
          path={pathCoordinates}
          options={{
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 4,
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
}
