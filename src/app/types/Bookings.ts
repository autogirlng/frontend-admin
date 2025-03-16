export type BookingStatus = "Pending" | "Accepted" | "Cancelled";
export type BookingType = "Instant" | "Pickup & Drop Off " | "Long Term";

export interface Booking {
  guestName: string;
  bookingId: string;
  bookingType: BookingType;
  duration: number; // Duration in days/hours
  vehicle: string; // Vehicle ID or name
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  price: number;
}
