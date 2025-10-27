// From GET /discount-durations
export interface DiscountDuration {
  id: string;
  name: string;
  minDays: number;
  maxDays: number;
}

// From POST /discount-durations payload
export interface DiscountDurationPayload {
  name: string;
  minDays: number;
  maxDays: number;
}
