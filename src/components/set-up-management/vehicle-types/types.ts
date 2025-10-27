// From GET /public/vehicle-types
export interface VehicleType {
  id: string;
  name: string;
  description: string;
}

// From POST /public/vehicle-types payload
export interface VehicleTypePayload {
  name: string;
  description: string;
}
