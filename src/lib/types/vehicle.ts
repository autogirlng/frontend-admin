// lib/types/vehicle.ts
export interface Photo {
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  isPrimary: boolean;
}

export interface Document {
  documentType:
    | "PROOF_OF_OWNERSHIP"
    | "VEHICLE_REGISTRATION"
    | "INSURANCE_CERTIFICATE"
    | "INSPECTION_REPORT"
    | "MAINTENANCE_HISTORY"
    | "AUTHORIZATION_LETTER";
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
}

export interface Pricing {
  bookingTypeId: string;
  price: number;
  platformFeeType: string;
}

export interface Discount {
  discountDurationId: string;
  percentage: number;
}

export interface VehicleFormData {
  // Step 1
  name: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  vehicleTypeId: string;
  vehicleMakeId: string;
  vehicleModelId: string;
  yearOfRelease: number;
  hasInsurance: boolean;
  hasTracker: boolean;

  // Step 2
  licensePlateNumber: string;
  stateOfRegistration: string;
  vehicleColorId: string;
  numberOfSeats: number;
  description: string;
  featureIds: string[];

  // Step 3
  photos: Photo[];

  // Step 4
  documents: Document[];

  // Step 5
  maxTripDurationUnit: "DAYS" | "HOURS";
  maxTripDurationValue: number;
  advanceNoticeUnit: "DAYS" | "HOURS";
  advanceNoticeValue: number;
  willProvideDriver: boolean;
  willProvideFuel: boolean;
  supportedBookingTypeIds: string[];
  outOfBoundsAreaIds: string[];
  pricing: Pricing[];
  discounts: Discount[];
  extraHourlyRate: number;
  outskirtFee: number;
  extremeFee: number;
}
