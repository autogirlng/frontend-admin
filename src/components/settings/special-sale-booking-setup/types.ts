export type RideType = "BASIC" | "EXECUTIVE";

export interface PricingItem {
  bookingTypeId: string;
  bookingTypeName?: string;
  price: number;
}

export interface ServicePricing {
  id: string;
  name: string;
  vehicleTypeId: string;
  vehicleTypeName?: string;
  rideType: RideType;
  outskirtFee: number;
  extremeFee: number;
  pricingItems: PricingItem[];
}

export interface ServicePricingPayload {
  name: string;
  vehicleTypeId: string;
  rideType: RideType;
  outskirtFee: number;
  extremeFee: number;
  pricingItems: PricingItem[];
}

export interface ServicePricingYear {
  id: string;
  name: string;
  servicePricingId: string;
  servicePricingName?: string;
  minYear: number;
  maxYear: number;
  imageUrl?: string;
}

export interface ServicePricingYearPayload {
  name: string;
  servicePricingId: string;
  minYear: number;
  maxYear: number;
  imageUrl?: string;
}
