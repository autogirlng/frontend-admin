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
  isVehicleUpgraded: string;
  upgradedYear: string;
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
  fileName: string;
};

export type Step3Data = {
  documents: DocumentUpload[];
};

export type PhotoUpload = {
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  isPrimary: boolean;
  fileName: string;
};

export type Step4Data = {
  photos: PhotoUpload[];
};

export type Pricing = {
  bookingTypeId: string;
  price: number | "";
};

export type Discount = {
  discountDurationId: string;
  percentage: number | "";
};

export type Step5Data = {
  maxTripDurationUnit: string;
  maxTripDurationValue: number | "";
  advanceNoticeUnit: string;
  advanceNoticeValue: number | "";
  willProvideDriver: string;
  willProvideFuel: string;
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
  documents?: string;
  photos?: string;
  pricing?: string;
  discounts?: string;

  [key: string]: string | undefined;
};
