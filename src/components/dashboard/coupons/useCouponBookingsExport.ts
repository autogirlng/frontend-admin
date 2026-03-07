import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { apiClient } from "@/lib/apiClient";
import { BookingContent, PaginatedResponse } from "./types";

interface UseCouponBookingsExportProps {
  couponCode: string | null;
  startDate?: string;
  endDate?: string;
}

export function useCouponBookingsExport({
  couponCode,
  startDate,
  endDate,
}: UseCouponBookingsExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (fileType: "xlsx" | "csv" = "xlsx") => {
    if (!couponCode) return;

    setIsExporting(true);
    toast.loading("Preparing invoice export…", { id: "export-bookings" });

    try {
      const params = new URLSearchParams();
      params.append("page", "0");
      params.append("size", "1");
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      // Step 1: Fetch total count
      const countRes = await apiClient.get<PaginatedResponse<BookingContent>>(
        `/admin/bookings/booking/${couponCode}/coupon?${params.toString()}`
      );
      const total = countRes.totalItems || 0;

      if (total === 0) {
        toast.error("No bookings found to export.", { id: "export-bookings" });
        setIsExporting(false);
        return;
      }

      // Step 2: Fetch all records
      params.set("size", String(total));
      const res = await apiClient.get<PaginatedResponse<BookingContent>>(
        `/admin/bookings/booking/${couponCode}/coupon?${params.toString()}`
      );
      const bookings = res.content || [];

      // Step 3: Map to flat export rows
      const exportData = bookings.map((b) => ({
        "Booking Ref": b.bookingRef,
        "Invoice Number": b.invoiceNumber,
        Status: b.status,
        "Total Price": b.totalPrice,
        "Booked At": b.bookedAt
          ? format(new Date(b.bookedAt), "MMM dd, yyyy")
          : "—",
        "User Name": b.user
          ? `${b.user.firstName} ${b.user.lastName}`
          : b.guestFullName?.trim() || "N/A",
        "User Email": b.user?.email || b.guestEmail || "N/A",
        "Pickup Location": b.segments?.[0]?.pickupLocationString || "—",
        "Dropoff Location": b.segments?.[0]?.dropoffLocationString || "—",
      }));

      // Step 4: Generate file
      const dateStr = format(new Date(), "dd-MMM-yyyy");
      const safeCode = couponCode.replace(/[^a-zA-Z0-9]/g, "_");
      const ext = fileType === "csv" ? "csv" : "xlsx";
      const filename = `Coupon_${safeCode}_Bookings_${dateStr}.${ext}`;

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      ws["!cols"] = [
        { wch: 18 }, // Booking Ref
        { wch: 18 }, // Invoice Number
        { wch: 12 }, // Status
        { wch: 14 }, // Total Price
        { wch: 16 }, // Booked At
        { wch: 22 }, // User Name
        { wch: 28 }, // User Email
        { wch: 30 }, // Pickup
        { wch: 30 }, // Dropoff
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Bookings");
      XLSX.writeFile(wb, filename, {
        bookType: fileType === "csv" ? "csv" : "xlsx",
      });

      toast.success("Export complete!", { id: "export-bookings" });
    } catch (error) {
      console.error(error);
      toast.error("Export failed. Please try again.", {
        id: "export-bookings",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return { handleExport, isExporting };
}
