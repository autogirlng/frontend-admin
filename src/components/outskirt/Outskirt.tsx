// components/admin/AdminGeofenceMap.tsx
"use client";

import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polygon,
  Popup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css"; // Import draw styles
import { GeofenceArea } from "@/lib/hooks/outskirt/useGeofenceManager";

// --- Props Type ---
type AdminGeofenceMapProps = {
  areas: GeofenceArea[];
  onShapeCreated: (coords: [number, number][]) => void;
};

// --- Leaflet Icon Fix (essential for next build) ---
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function AdminGeofenceMap({
  areas,
  onShapeCreated,
}: AdminGeofenceMapProps) {
  const position: [number, number] = [6.5244, 3.3792]; // Lagos
  const areaColors = {
    OUTSKIRT: "orange",
    EXTREME: "red",
  };

  const handleCreated = (e: any) => {
    // e is type L.DrawEvents.Created
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const latlngs = layer
        .getLatLngs()[0]
        .map((latlng: L.LatLng) => [latlng.lat, latlng.lng]);
      onShapeCreated(latlngs);
    }
  };

  return (
    <MapContainer
      center={position}
      zoom={11}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
            polygon: true, // Only allow polygon drawing
          }}
          edit={{
            edit: false,
            remove: false,
          }}
        />
      </FeatureGroup>

      {/* Display existing areas */}
      {areas.map((area) => (
        <Polygon
          key={area.id}
          pathOptions={{ color: areaColors[area.areaType] || "blue" }}
          positions={area.coordinates.map((c) => [c.latitude, c.longitude])}
        >
          <Popup>
            {area.name} ({area.areaType})
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
}
