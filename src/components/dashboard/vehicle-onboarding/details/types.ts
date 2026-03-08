export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface VehiclePhoto {
  id?: string;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  isPrimary: boolean;
}

export interface VehicleDocument {
  id?: string;
  documentType: string;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
}

export interface VehicleFeature {
  id: string;
  name: string;
}

export interface BookingTypeSummary {
  id: string;
  name: string;
  durationInMinutes: number;
  description: string;
  defaultActive: boolean;
}

export interface VehiclePricing {
  id?: string;
  bookingTypeId: string;
  bookingTypeName?: string;
  price: number;
  platformFeeType: string;
}

export interface VehicleDiscount {
  id?: string;
  discountDurationId: string;
  discountDurationName?: string;
  percentage: number;
}

export interface VehicleOwner {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface VehicleMake {
  id: string;
  name: string;
  code: string;
}

export interface VehicleModel {
  id: string;
  name: string;
  code: string;
}

export interface VehicleColor {
  id: string;
  name: string;
  hexCode: string;
}

export interface AssignedDriver {
  id: string;
  driverIdentifier: string;
  fullName: string;
  phoneNumber: string;
  ownerType: string;
  ownerName: string;
  profilePictureUrl: string;
  active: boolean;
}

export interface SupportedState {
  id?: string;
  stateId: string;
  stateName: string;
  countryName?: string;
  surchargeFee: number;
}

export interface OutOfBoundsArea {
  id: string;
  name: string;
}

export interface VehicleDetail {
  id: string;
  vehicleIdentifier: string;
  ownerId: string;
  name: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  vehicleTypeId: string;
  vehicleTypeName: string;
  vehicleMakeId: string;
  vehicleModelId: string;
  yearOfRelease: number;
  hasInsurance: boolean;
  hasTracker: boolean;
  status: string;
  licensePlateNumber: string;
  stateOfRegistration: string;
  vehicleColorId: string;
  numberOfSeats: number;
  description: string;
  maxTripDurationUnit: string;
  maxTripDurationValue: number;
  advanceNoticeUnit: string;
  advanceNoticeValue: number;
  willProvideDriver: boolean;
  willProvideFuel: boolean;
  extraHourlyRate: number;
  outskirtFee: number;
  extremeFee: number;
  isVehicleUpgraded: boolean;

  photos: VehiclePhoto[];
  documents: VehicleDocument[];
  features: VehicleFeature[];
  supportedBookingTypes: BookingTypeSummary[];
  pricing: VehiclePricing[];
  discounts: VehicleDiscount[];

  owner?: VehicleOwner;
  vehicleMake?: VehicleMake;
  vehicleModel?: VehicleModel;
  vehicleColor?: VehicleColor;
  assignedDriver?: AssignedDriver;
  supportedStates: SupportedState[];
  outOfBoundsAreas: OutOfBoundsArea[];
}

export interface VehicleBookingSegment {
  segmentId: string;
  bookingId: string;
  vehicleUuid: string;
  vehicleId: string;
  vehicleName: string;
  createdAt: string;
  customerName: string;
  bookingType: string;
  city: string;
  duration: string;
  bookingStatus: string;
  price: number;
}
