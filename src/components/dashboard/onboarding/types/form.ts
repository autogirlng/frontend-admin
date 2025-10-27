// types/form.ts

export type Step1Data = {
  vehicleListingName: string;
  locationCityId: string;
  address: string;
  vehicleTypeId: string;
  vehicleMakeId: string;
  vehicleModelId: string;
  yearOfRelease: string;
  hasInsurance: string;
  hasTracker: string;
};

export type Step2Data = {
  licensePlateNumber: string;
  stateOfRegistration: string;
  vehicleColorId: string;
  numberOfSeats: number | "";
  description: string;
  featureIds: string[];
};

export type DocumentUpload = {
  documentType: string;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  fileName: string; // <-- Add this to store the file name for the UI
};

// 4. Define Step3Data
export type Step3Data = {
  documents: DocumentUpload[];
};

export type PhotoUpload = {
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  isPrimary: boolean;
  fileName: string; // Good to keep for alt text or titles
};

// 5. Define Step4Data
export type Step4Data = {
  photos: PhotoUpload[];
};

export type Pricing = {
  bookingTypeId: string;
  price: number | "";
  // platformFeeType is omitted for user-facing simplicity
};

export type Discount = {
  discountDurationId: string;
  percentage: number | "";
};

// 6. Define Step5Data
export type Step5Data = {
  maxTripDurationUnit: string;
  maxTripDurationValue: number | "";
  advanceNoticeUnit: string;
  advanceNoticeValue: number | "";
  willProvideDriver: string; // Using string for "yes"/"no" Select
  willProvideFuel: string; // Using string for "yes"/"no" Select
  supportedBookingTypeIds: string[];
  outOfBoundsAreaIds: string[];
  outskirtFee: number | "";
  extremeFee: number | "";
  pricing: Pricing[];
  discounts: Discount[];
  extraHourlyRate: number | "";
};

export type MultiStepFormData = Step1Data &
  Step2Data &
  Step3Data &
  Step4Data &
  Step5Data;

export type FormErrors = Partial<Record<keyof MultiStepFormData, string>> & {
  // Add a specific error key for the whole document step
  documents?: string;
  photos?: string;
  pricing?: string;
  discounts?: string;

  // Add this index signature to allow for dynamic keys
  // This tells TypeScript: "Any other key that is a string
  // will also have a value that is a string."
  [key: string]: string | undefined;
};
