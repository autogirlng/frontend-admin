export type DisputeStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED";

export type DeductionType =
  | "LATE_CANCELLATION"
  | "POLICY_VIOLATION"
  | "DAMAGE_CLAIM"
  | "CHARGEBACK"
  | "TAX_ADJUSTMENT"
  | "OTHER";

export interface Dispute {
  id: string;
  deductionId: string;
  hostId?: string;
  hostContext: string;
  status: DisputeStatus;
  csTicketReference?: string;
  resolutionNotes?: string;
}

export interface CreateDisputePayload {
  hostContext: string;
}

export interface DisputeFilterParams {
  status?: DisputeStatus;
  page?: number;
  size?: number;
}

export interface DeductionPayload {
  hostId: string;
  bookingId: string;
  type: DeductionType;
  notes?: string;
  amount: number;
}

export interface PatchDisputePayload {
  status: DisputeStatus;
  resolutionNotes: string;
}
