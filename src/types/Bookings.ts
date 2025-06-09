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
<<<<<<< HEAD
=======
export interface HostBookingTable {
  id: string;
  pickupAddress: string;
  pickupTime: string;
  numberOfTrips: string;
  dropOffAddress: string;
  dropOffTime: string;
  RideStatus: string;
}
>>>>>>> 12b0cb6e5203a188a79510e41dd4dadf1a523a65

export interface IBooking {
  id: string;
  customerName: string;
  city: string;
  bookingType: "Single Day" | "Multi Day";
  pickupLocation: string;
  vehicle: string;
  bookingStatus:
<<<<<<< HEAD
  | "Paid"
  | "Unpaid"
  | "Pending"
  | "Completed"
  | "Rejected"
  | "Cancelled";
  
  tripStatus:
  | "Unconfirmed"
  | "Confirmed"
  | "Ongoing"
  | "Extra Time"
  | "Cancelled"
  | "Completed";
}
=======
    | "Paid"
    | "Unpaid"
    | "Pending"
    | "Completed"
    | "Rejected"
    | "Cancelled";

  tripStatus:
    | "Unconfirmed"
    | "Confirmed"
    | "Ongoing"
    | "Extra Time"
    | "Cancelled"
    | "Completed";
}
>>>>>>> 12b0cb6e5203a188a79510e41dd4dadf1a523a65
