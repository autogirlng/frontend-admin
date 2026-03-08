export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type AreaType = "OUTSKIRT" | "EXTREME" | "NO_GO_AREA";

export type Country = {
  id: string;
  name: string;
  shortname: string;
  country_code: string;
  continent: string;
  currencyName: string;
  currencySymbol: string;
  polygon: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CountryPayload = {
  name: string;
  shortname: string;
  country_code: string;
  continent: string;
  currencyName: string;
  currencySymbol: string;
  isActive: boolean;

  coordinates: Coordinate[][];
};

export type GeoState = {
  id: string;
  name: string;
  stateCode: string;
  country: Country;
  polygon: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StatePayload = {
  name: string;
  countryId: string;
  stateCode: string;
  isActive: boolean;
  coordinates: Coordinate[][];
};

export type GeofenceArea = {
  id: string;
  name: string;
  areaType: AreaType;
  stateId: string;
  stateName: string;
  coordinates: Coordinate[];
};

export type GeofencePayload = {
  name: string;
  areaType: AreaType;
  stateId: string;
  coordinates: Coordinate[];
};

export function parseWktToLatLngRings(wkt: string): [number, number][][] {
  if (!wkt) return [];
  try {
    const stripped = wkt
      .replace(/^MULTIPOLYGON\s*\(\s*/, "")
      .replace(/\)\s*$/, "");
    const polygonMatches = stripped.match(/\(\s*\(([^)]+)\)/g) ?? [];
    return polygonMatches.map((polyStr) => {
      const inner = polyStr
        .replace(/^\s*\(\s*\(/, "")
        .replace(/\)\s*$/, "")
        .trim();
      return inner.split(",").map((pair) => {
        const [lng, lat] = pair.trim().split(/\s+/).map(Number);
        return [lat, lng] as [number, number];
      });
    });
  } catch {
    return [];
  }
}

export function latLngsToCoordinates(
  latlngs: [number, number][],
): Coordinate[] {
  return latlngs.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
}
