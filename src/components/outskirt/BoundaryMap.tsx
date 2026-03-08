"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polygon,
  Popup,
  Tooltip,
  useMap,
  ZoomControl,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export type ExistingPolygon = {
  id: string;
  name: string;
  sublabel?: string;
  color: string;
  rings: [number, number][][];
};

type BoundaryMapProps = {
  boundaryRings?: [number, number][][];
  boundaryLabel?: string;
  boundaryColor?: string;
  currentShapeRings?: [number, number][][];
  currentShapeLabel?: string;
  existingPolygons?: ExistingPolygon[];
  onShapeCreated?: (coords: [number, number][]) => void;
  flyToLocation?: { lat: number; lng: number } | null;
  defaultCenter?: [number, number];
  defaultZoom?: number;
  drawingColor?: string;
  readOnly?: boolean;
};

function MapController({
  flyToCoords,
  fitRings,
}: {
  flyToCoords?: { lat: number; lng: number } | null;
  fitRings?: [number, number][][];
}) {
  const map = useMap();
  const fittedRef = useRef(false);

  useEffect(() => {
    if (flyToCoords) {
      map.flyTo([flyToCoords.lat, flyToCoords.lng], 14, { duration: 1.5 });
    }
  }, [flyToCoords, map]);

  useEffect(() => {
    if (fittedRef.current || !fitRings || fitRings.length === 0) return;
    const allPoints = fitRings.flat();
    if (allPoints.length < 2) return;
    const bounds = L.latLngBounds(
      allPoints.map(([lat, lng]) => L.latLng(lat, lng)),
    );
    map.fitBounds(bounds, {
      padding: [60, 60],
      maxZoom: 12,
      animate: true,
      duration: 1.2,
    });
    fittedRef.current = true;
  }, [fitRings, map]);

  return null;
}

export default function BoundaryMap({
  boundaryRings = [],
  boundaryLabel,
  boundaryColor = "#2563eb",
  currentShapeRings = [],
  currentShapeLabel,
  existingPolygons = [],
  onShapeCreated,
  flyToLocation,
  defaultCenter = [9.082, 8.6753],
  defaultZoom = 6,
  drawingColor = "#16a34a",
  readOnly = false,
}: BoundaryMapProps) {
  const handleCreated = (e: any) => {
    if (e.layerType !== "polygon") return;
    const latlngs: [number, number][] = e.layer
      .getLatLngs()[0]
      .map((ll: L.LatLng) => [ll.lat, ll.lng] as [number, number]);
    onShapeCreated?.(latlngs);
  };

  const fitRings =
    currentShapeRings.length > 0
      ? currentShapeRings
      : boundaryRings.length > 0
        ? boundaryRings
        : undefined;

  return (
    <>
      <style jsx global>{`
        .leaflet-top.leaflet-left {
          margin-top: 72px;
        }
        .leaflet-top.leaflet-right {
          margin-top: 72px;
        }

        /* Parent guide boundary: marching dashes */
        .boundary-guide-path {
          stroke-dasharray: 10 6;
          animation: dash-march 24s linear infinite;
        }
        @keyframes dash-march {
          to {
            stroke-dashoffset: -260;
          }
        }

        /* Current saved shape: soft glow pulse */
        .current-shape-path {
          animation: shape-glow 2.5s ease-in-out infinite;
        }
        @keyframes shape-glow {
          0%,
          100% {
            opacity: 1;
            stroke-width: 3px;
          }
          50% {
            opacity: 0.6;
            stroke-width: 4px;
          }
        }
      `}</style>

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <MapController flyToCoords={flyToLocation} fitRings={fitRings} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <ZoomControl position="topright" />

        {boundaryRings.map((ring, i) => (
          <Polygon
            key={`guide-${i}`}
            positions={ring}
            pathOptions={{
              color: boundaryColor,
              weight: 2.5,
              fillOpacity: 0.05,
              fillColor: boundaryColor,
              className: "boundary-guide-path",
            }}
          >
            {boundaryLabel && (
              <Tooltip
                sticky
                direction="center"
                className="!text-xs !font-semibold !bg-white !border-slate-200 !text-slate-600 !shadow-md"
              >
                📍 {boundaryLabel} boundary
              </Tooltip>
            )}
          </Polygon>
        ))}

        {currentShapeRings.map((ring, i) => (
          <Polygon
            key={`current-${i}`}
            positions={ring}
            pathOptions={{
              color: drawingColor,
              weight: 3,
              fillOpacity: 0.15,
              fillColor: drawingColor,
              className: "current-shape-path",
            }}
          >
            <Tooltip
              permanent
              direction="center"
              className="!text-[11px] !font-semibold !bg-white/90 !border !border-slate-200 !shadow-lg !text-slate-700 !px-2.5 !py-1 !rounded-full"
            >
              {currentShapeLabel
                ? `✏️ ${currentShapeLabel} — current boundary`
                : "✏️ Current saved boundary"}
            </Tooltip>
            <Popup>
              <div className="text-center text-xs max-w-[160px]">
                <p className="font-semibold text-slate-700 mb-1">
                  {currentShapeLabel
                    ? `${currentShapeLabel} — saved boundary`
                    : "Saved boundary"}
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Draw a new polygon on the map to replace this boundary, or
                  save the form as-is to keep it.
                </p>
              </div>
            </Popup>
          </Polygon>
        ))}

        {existingPolygons.map((poly) =>
          poly.rings.map((ring, ri) => (
            <Polygon
              key={`sibling-${poly.id}-${ri}`}
              positions={ring}
              pathOptions={{
                color: poly.color,
                fillOpacity: 0.22,
                weight: 1.5,
              }}
            >
              <Popup>
                <div className="text-center min-w-[100px]">
                  <strong className="block text-sm">{poly.name}</strong>
                  {poly.sublabel && (
                    <span
                      className="text-[10px] mt-1 inline-block px-2 py-0.5 rounded-full"
                      style={{
                        background: `${poly.color}22`,
                        color: poly.color,
                      }}
                    >
                      {poly.sublabel}
                    </span>
                  )}
                </div>
              </Popup>
            </Polygon>
          )),
        )}

        {!readOnly && (
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
                    color: "#fbbf24",
                    message: "<strong>Can't draw that shape!</strong>",
                  },
                  shapeOptions: {
                    color: drawingColor,
                    weight: 2.5,
                    fillOpacity: 0.25,
                  },
                },
              }}
              edit={{ edit: false, remove: false }}
            />
          </FeatureGroup>
        )}
      </MapContainer>
    </>
  );
}
