export type ComplaintType = "COMPLAINT" | "SUGGESTION";
export type ComplaintStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";

export interface ComplaintUser {
  id: string;
  name: string;
  email: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  type: ComplaintType;
  status: ComplaintStatus;
  complaintUser?: ComplaintUser; // Included in detail view
}

export interface CreateComplaintPayload {
  title: string;
  description: string;
  type: ComplaintType;
}

export interface UpdateComplaintPayload {
  status: ComplaintStatus;
  resolutionNote?: string;
}

export interface ComplaintsFilterParams {
  page: number;
  size?: number;
}
