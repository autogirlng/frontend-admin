"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polygon,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { GeofenceArea } from "@/lib/hooks/outskirt/useGeofenceManager";

type AdminGeofenceMapProps = {
  areas: GeofenceArea[];
  onShapeCreated: (coords: [number, number][]) => void;
  flyToLocation?: { lat: number; lng: number } | null;
};

const MapController = ({
  coords,
}: {
  coords?: { lat: number; lng: number } | null;
}) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 16, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
};

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
  flyToLocation,
}: AdminGeofenceMapProps) {
  const position: [number, number] = [6.5244, 3.3792];

  const areaColors = {
    OUTSKIRT: "orange",
    EXTREME: "red",
  };

  const handleCreated = (e: any) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const latlngs = layer
        .getLatLngs()[0]
        .map((latlng: L.LatLng) => [latlng.lat, latlng.lng]);
      onShapeCreated(latlngs);
    }
  };

  return (
    <>
      <style jsx global>{`
        /* Push Drawing Tools (Left) down to clear Back Button */
        .leaflet-top.leaflet-left {
          margin-top: 80px;
        }

        /* Push Zoom Controls (Right) down to clear Manage Button */
        .leaflet-top.leaflet-right {
          margin-top: 80px;
        }
      `}</style>

      <MapContainer
        center={position}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <MapController coords={flyToLocation} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <ZoomControl position="topright" />

        <FeatureGroup>
          <EditControl
            position="topleft"
            onCreated={handleCreated}
            draw={{
              rectangle: false,
              circle: false,
              circlemarker: false,
              marker: false,
              polyline: false,
              polygon: {
                allowIntersection: false,
                drawError: {
                  color: "#e1e100",
                  message: "<strong>Oh snap!<strong> you can't draw that!",
                },
                shapeOptions: {
                  color: "#2563eb",
                },
              },
            }}
            edit={{ edit: false, remove: false }}
          />
        </FeatureGroup>

        {areas.map((area) => (
          <Polygon
            key={area.id}
            pathOptions={{
              color:
                areaColors[area.areaType as keyof typeof areaColors] || "blue",
              fillOpacity: 0.4,
            }}
            positions={area.coordinates.map((c) => [c.latitude, c.longitude])}
          >
            <Popup>
              <div className="text-center">
                <strong className="block text-sm mb-1">{area.name}</strong>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full border">
                  {area.areaType}
                </span>
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
    </>
  );
}
