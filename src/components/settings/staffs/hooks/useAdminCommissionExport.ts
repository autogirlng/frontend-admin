import { useState } from "react";
import { format, isValid } from "date-fns";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { apiClient } from "@/lib/apiClient";
import {
  PaginatedResponse,
  OfflineBooking,
} from "@/components/settings/staffs/types";

interface UseAdminCommissionExportProps {
  adminId: string;
  adminName?: string;
}

export function useAdminCommissionExport({
  adminId,
  adminName,
}: UseAdminCommissionExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCommissions = async () => {
    setIsExporting(true);
    toast.loading("Preparing commission export...", {
      id: "export-commissions",
    });

    try {
      const params = new URLSearchParams();
      params.append("page", "0");
      params.append("size", "10000");

      const endpoint = `/admin/bookings/offline/created-by/${adminId}?${params.toString()}`;
      const res =
        await apiClient.get<PaginatedResponse<OfflineBooking>>(endpoint);
      const bookings = res.content || [];

      if (bookings.length === 0) {
        toast.error("No commissions found to export", {
          id: "export-commissions",
        });
        setIsExporting(false);
        return;
      }

      const dateStr = format(new Date(), "dd-MMM-yyyy");
      const safeName = adminName?.replace(/\s+/g, "_") || "Admin";
      const filename = `Admin_Commissions_${safeName}_${dateStr}.xlsx`;

      const exportData = bookings.map((b) => ({
        "Booking Ref": b.invoiceNumber || "-",
        "Customer": b.customerName || "-",
        "Vehicle": b.vehicleName || "-",
        "Vehicle ID": b.vehicleIdentifier || "-",
        "Host": b.hostName || "-",
        "Trip Start":
          b.firstSegmentStarts && isValid(new Date(b.firstSegmentStarts))
            ? format(new Date(b.firstSegmentStarts), "dd MMM yyyy, HH:mm")
            : "-",
        "Status": b.bookingStatus?.replace(/_/g, " ") || "-",
        "Payment Method": b.paymentMethod || "-",
        "Total Value": b.totalPrice?.toLocaleString() ?? "0.00",
        "Created At":
          b.createdAt && isValid(new Date(b.createdAt))
            ? format(new Date(b.createdAt), "dd MMM yyyy, HH:mm")
            : "-",
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      ws["!cols"] = [
        { wch: 18 }, // Booking Ref
        { wch: 22 }, // Customer
        { wch: 22 }, // Vehicle
        { wch: 16 }, // Vehicle ID
        { wch: 22 }, // Host
        { wch: 22 }, // Trip Start
        { wch: 16 }, // Status
        { wch: 16 }, // Payment Method
        { wch: 14 }, // Total Value
        { wch: 22 }, // Created At
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Commissions");
      XLSX.writeFile(wb, filename);

      toast.success("Export Complete!", { id: "export-commissions" });
    } catch (error) {
      console.error(error);
      toast.error("Export failed. Please try again.", {
        id: "export-commissions",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return { handleExportCommissions, isExporting };
}
