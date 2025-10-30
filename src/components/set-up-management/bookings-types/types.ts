// Based on your GET /booking-types response
export interface BookingType {
  id: string;
  name: string;
  durationInMinutes: number;
  description: string;
  defaultActive: boolean;
}

// Based on your POST /booking-types payload
export interface BookingTypePayload {
  name: string;
  durationInMinutes: number;
  description: string;
  defaultActive: boolean;
}
