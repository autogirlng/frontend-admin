// --- Vehicle Make ---
export interface VehicleMake {
  id: string;
  name: string;
  code: string;
}

export interface VehicleMakePayload {
  name: string;
  code: string;
}

// --- Vehicle Model ---
export interface VehicleModel {
  id: string;
  name: string;
  code: string;
  makeName: string;
  makeId: string;
}

export interface VehicleModelPayload {
  name: string;
  code: string;
  vehicleMakeId: string;
}

// --- CSV Upload Response ---
// This type can be used for both Make and Model upload responses
export interface CsvUploadResponse {
  totalRecords: number;
  successfulImports: number;
  duplicateSkips: number;
  invalidMakeSkips?: number; // Optional, only for models
  errors: string[];
}
