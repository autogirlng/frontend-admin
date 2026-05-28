import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import { PaginatedResponse } from "@/components/dashboard/host-management/types";
import {
  Complaint,
  ComplaintsFilterParams,
  UpdateComplaintPayload,
} from "@/lib/types/complaints";

export const COMPLAINTS_QUERY_KEY = "admin-complaints";
export const COMPLAINT_DETAIL_KEY = "admin-complaint-detail";

// ============== GET /v1/complaints ==============
export function useGetComplaints(filters: ComplaintsFilterParams) {
  const { page, size = 20 } = filters;

  return useQuery<PaginatedResponse<Complaint>>({
    queryKey: [COMPLAINTS_QUERY_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", String(size));

      const endpoint = `/v1/complaints?${params.toString()}`;
      return apiClient.get<PaginatedResponse<Complaint>>(endpoint);
    },
    placeholderData: (previousData) => previousData,
  });
}

// ============== GET /v1/complaints/{id} ==============
export function useGetComplaintDetails(complaintId: string | null) {
  return useQuery<Complaint, Error>({
    queryKey: [COMPLAINT_DETAIL_KEY, complaintId],
    queryFn: () => apiClient.get<Complaint>(`/v1/complaints/${complaintId}`),
    enabled: !!complaintId,
  });
}

// ============== PATCH /v1/complaints/{id}/status ==============
export function useUpdateComplaintStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    Complaint,
    Error,
    { id: string; payload: UpdateComplaintPayload }
  >({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateComplaintPayload;
    }) => {
      return apiClient.patch<Complaint>(`/v1/complaints/${id}/status`, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [COMPLAINT_DETAIL_KEY, variables.id],
      });
      queryClient.invalidateQueries({ queryKey: [COMPLAINTS_QUERY_KEY] });
      toast.success("Complaint status updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update complaint status.");
    },
  });
}
