// types.ts

// --- Vehicle Interfaces ---
export interface Vehicle {
  id: string;
  vehicleIdentifier: string;
  name: string;
  licensePlateNumber: string;
  ownerName: string;
  status: string;
  operationalStatus: string;
}

export interface VehicleResponse {
  status: string;
  message: string;
  data: {
    content: Vehicle[];
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// --- Booking Type Interfaces ---
export interface BookingType {
  id: string;
  name: string;
  durationInMinutes: number;
  description: string;
  defaultActive: boolean;
}

export interface BookingTypeResponse {
  status: string;
  message: string;
  data: BookingType[];
}

// --- Past Booking Payload Interfaces ---
export interface PastBookingSegmentPayload {
  bookingTypeId: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm:ss
  pickupLocation: string;
  dropoffLocation: string;
}

export interface CreatePastBookingPayload {
  vehicleId: string;
  userId: string | null;
  guestFullName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  bookedAt: string; // ISO String YYYY-MM-DDTHH:mm:ss
  totalPrice: number;
  paymentMethod: "OFFLINE";
  segments: PastBookingSegmentPayload[];
}
