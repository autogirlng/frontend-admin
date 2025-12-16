import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { apiClient } from "@/lib/apiClient";
import { PaginatedResponse } from "@/components/dashboard/finance/types";
import { Payment } from "../../types";
import { DateRange } from "react-day-picker";

interface UsePaymentExportProps {
  filters: {
    paymentStatus: string | null;
    paymentProvider: string | null;
    dateRange: DateRange | null;
  };
  searchTerm: string;
}

export function usePaymentExport({
  filters,
  searchTerm,
}: UsePaymentExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPayments = async () => {
    setIsExporting(true);
    toast.loading("Preparing export...", { id: "export" });

    try {
      const params = new URLSearchParams();
      params.append("page", "0");
      params.append("size", "10000");

      if (filters.paymentStatus)
        params.append("paymentStatus", filters.paymentStatus);
      if (filters.paymentProvider)
        params.append("paymentProvider", filters.paymentProvider);

      if (filters.dateRange?.from) {
        params.append(
          "startDate",
          format(filters.dateRange.from, "yyyy-MM-dd")
        );
      }
      if (filters.dateRange?.to) {
        params.append("endDate", format(filters.dateRange.to, "yyyy-MM-dd"));
      }
      if (searchTerm.trim() !== "") {
        params.append("searchTerm", searchTerm.trim());
      }

      const endpoint = `/admin/payments?${params.toString()}`;
      const res = await apiClient.get<PaginatedResponse<Payment>>(endpoint);
      const allPayments = res.content || [];

      const activeStatus =
        filters.paymentStatus && filters.paymentStatus !== "ALL"
          ? filters.paymentStatus
          : null;
      const filteredPayments = activeStatus
        ? allPayments.filter((p) => p.paymentStatus === activeStatus)
        : allPayments;

      if (filteredPayments.length === 0) {
        toast.error("No payments match the current filters", { id: "export" });
        setIsExporting(false);
        return;
      }

      let period = "All_Time";
      if (filters.dateRange?.from && filters.dateRange?.to) {
        const from = format(filters.dateRange.from, "dd-MMM-yyyy");
        const to = format(filters.dateRange.to, "dd-MMM-yyyy");
        period = `${from}_to_${to}`;
      }
      const statusForName = activeStatus ?? "All_Statuses";
      const filename = `Payments_${statusForName}_${period}.xlsx`;

      const exportData = filteredPayments.map((p) => ({
        "Customer Name": p.userName || "Guest",
        "Booking Ref": p.bookingRef || "-",
        Amount: `₦${p.totalPayable.toLocaleString()}`,
        "Invoice Number": p.invoiceNumber || "-",
        "Payment Date": format(new Date(p.createdAt), "dd MMM yyyy, HH:mm"),
        Vehicle: p.vehicleName,
        Provider: p.paymentProvider,
        Status: p.paymentStatus,
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      ws["!cols"] = [
        { wch: 22 },
        { wch: 18 },
        { wch: 15 },
        { wch: 20 },
        { wch: 24 },
        { wch: 22 },
        { wch: 14 },
        { wch: 12 },
      ];
      XLSX.utils.book_append_sheet(wb, ws, "Payments");
      XLSX.writeFile(wb, filename);

      toast.success("Export Complete!", { id: "export" });
    } catch (error) {
      toast.error("Export failed", { id: "export" });
    } finally {
      setIsExporting(false);
    }
  };

  return { handleExportPayments, isExporting };
}
