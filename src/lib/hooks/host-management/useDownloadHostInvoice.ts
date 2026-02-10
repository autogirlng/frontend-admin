import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import toast from "react-hot-toast";

export function useDownloadHostInvoice() {
  return useMutation<
    void,
    Error,
    {
      hostId: string;
      startDate: string;
      endDate: string;
    }
  >({
    mutationFn: async ({ hostId, startDate, endDate }) => {
      const safeName = hostId
        ? hostId
            .trim()
            .replace(/[^a-zA-Z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 30) + "_"
        : "";

      const defaultFilename = `host_invoice_${safeName}.pdf`;

      await apiClient.getAndDownloadFile(
        `/admin/invoices/download/receipt/${hostId}?startDate=${startDate}&endDate=${endDate}`,
        defaultFilename,
      );
    },
    onSuccess: () => {
      toast.success("Host invoice downloaded");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to download invoice.");
    },
  });
}
