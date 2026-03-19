import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { apiClient } from "@/lib/apiClient";
import { Booking, PaginatedData } from "@/components/dashboard/organizations/types";

interface UseOrganizationBookingsExportProps {
  organizationId: string;
  orgName: string;
}

export function useOrganizationBookingsExport({
  organizationId,
  orgName,
}: UseOrganizationBookingsExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!organizationId) return;

    setIsExporting(true);
    toast.loading("Preparing export…", { id: "export-org-bookings" });

    try {
      const countRes = await apiClient.get<PaginatedData<Booking>>(
        `/admin/organizations/${organizationId}/bookings?page=0&size=1`
      );
      const total = countRes.totalItems || 0;

      if (total === 0) {
        toast.error("No bookings found to export.", { id: "export-org-bookings" });
        setIsExporting(false);
        return;
      }

      const res = await apiClient.get<PaginatedData<Booking>>(
        `/admin/organizations/${organizationId}/bookings?page=0&size=${total}`
      );
      const bookings = res.content || [];

      const exportData = bookings.map((b) => ({
        "Invoice #": b.invoiceNumber,
        "Booking Ref": b.bookingRef,
        User: `${b.user.firstName} ${b.user.lastName}`,
        Status: b.status,
        "Total Price": b.totalPrice,
        "Booked At": b.bookedAt
          ? format(new Date(b.bookedAt), "MMM dd, yyyy")
          : "—",
        Pickup: b.segments?.[0]?.pickupLocationString || "N/A",
        Dropoff: b.segments?.[0]?.dropoffLocationString || "N/A",
      }));

      const dateStr = format(new Date(), "dd-MMM-yyyy");
      const safeName = orgName.replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `${safeName}_Bookings_${dateStr}.xlsx`;

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      ws["!cols"] = [
        { wch: 15 },
        { wch: 18 },
        { wch: 22 },
        { wch: 12 },
        { wch: 15 },
        { wch: 16 },
        { wch: 25 },
        { wch: 25 },
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Bookings");
      XLSX.writeFile(wb, filename);

      toast.success("Export complete!", { id: "export-org-bookings" });
    } catch (error) {
      console.error(error);
      toast.error("Export failed. Please try again.", { id: "export-org-bookings" });
    } finally {
      setIsExporting(false);
    }
  };

  return { handleExport, isExporting };
}
