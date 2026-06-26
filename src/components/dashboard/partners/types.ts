export type PartnerType =
  | "HOTEL"
  | "RESTAURANT"
  | "CORPORATE"
  | "REAL_ESTATE"
  | "HEALTHCARE"
  | "LOGISTICS"
  | "EVENT_VENUE"
  | "TRANSPORT"
  | "OTHER"
  | string;

export interface OperatingState {
  id: string;
  name: string;
}

export interface Partner {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  description: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  contactPersonName: string;
  website: string;
  partnerType: PartnerType;
  latitude: number;
  longitude: number;
  operatingStates: OperatingState[];
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface VehicleListItem {
  id: string;
  vehicleIdentifier: string;
  name: string;
  licensePlateNumber?: string;
  ownerName: string;
  status: string;
  operationalStatus: string;
}

export interface PriorityVehiclePhoto {
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  isPrimary: boolean;
}

export interface PriorityVehiclePricing {
  bookingTypeId: string;
  bookingTypeName: string;
  price: number;
  platformFeeType: string;
}

export interface PartnerPriorityVehicle {
  id: string;
  slug: string;
  vehicleIdentifier: string;
  name: string;
  photos: PriorityVehiclePhoto[];
  city: string;
  allPricingOptions: PriorityVehiclePricing[];
  extraHourlyRate: number;
  vehicleTypeId: string;
  vehicleTypeName: string;
  willProvideDriver: boolean;
  willProvideFuel: boolean;
  numberOfSeats: number;
  hostName: string;
  hostPhoneNumber: string;
  featured: boolean;
}

export interface CreatePartnerPayload {
  name: string;
  imageUrl: string;
  description: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  contactPersonName: string;
  website: string;
  partnerType: PartnerType;
  latitude: number | null;
  longitude: number | null;
}

export interface UpdatePartnerPayload extends CreatePartnerPayload {
  id: string;
  isActive: boolean;
}

export interface MapVehiclesPayload {
  vehicles: { vehicleId: string; priority: number }[];
}

export interface MapStatesPayload {
  stateIds: string[];
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
}
