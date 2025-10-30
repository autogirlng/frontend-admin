// From GET /platform-fees
export interface PlatformFee {
  feeType: string;
  feePercentage: number;
}

// From POST /platform-fees payload
export interface PlatformFeePayload {
  feeType: string;
  feePercentage: number;
}

// From PUT /platform-fees/{feeType} payload
export interface PlatformFeeUpdatePayload {
  feePercentage: number;
}
