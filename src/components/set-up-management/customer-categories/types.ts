import { VehicleType } from "@/components/set-up-management/vehicle-types/types";

// From GET /public/customer-categories
export interface CustomerCategory {
  id: string;
  vehicleType: VehicleType;
  image: string;
}

// From POST /admin/customer-categories & PUT /admin/customer-categories/{id} payload
export interface CustomerCategoryPayload {
  vehicleTypeId: string;
  image: string;
}
