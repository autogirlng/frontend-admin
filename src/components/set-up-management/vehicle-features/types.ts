// From GET /public/vehicle-features
export interface VehicleFeature {
  id: string;
  name: string;
  description: string; // Assuming description is returned, based on POST/PUT
}

// From POST /public/vehicle-features payload
export interface VehicleFeaturePayload {
  name: string;
  description: string;
}
