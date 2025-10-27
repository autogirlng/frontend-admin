// From GET /public/vehicle-colors
export interface VehicleColor {
  id: string;
  name: string;
  hexCode: string;
}

// From POST /public/vehicle-colors payload
export interface VehicleColorPayload {
  name: string;
  hexCode: string;
}
