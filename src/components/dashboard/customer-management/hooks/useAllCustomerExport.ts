import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { apiClient } from "@/lib/apiClient";
import {
  BookingCustomer,
  BookingCustomerPaginatedResponse,
} from "../types";

export function useAllCustomerExport() {
  const [isExportingAll, setIsExportingAll] = useState(false);

  const handleExportAllCustomers = async () => {
    setIsExportingAll(true);
    toast.loading("Preparing all customers export...", {
      id: "export-all-customers",
    });

    try {
      const params = new URLSearchParams();
      params.append("page", "0");
      params.append("size", "1");

      // Step 1: Fetch total count
      const countRes =
        await apiClient.get<BookingCustomerPaginatedResponse>(
          `/admin/bookings/booking/customer?${params.toString()}`
        );
      const total = countRes.totalElements || 0;

      if (total === 0) {
        toast.error("No customers found to export", {
          id: "export-all-customers",
        });
        setIsExportingAll(false);
        return;
      }

      // Step 2: Fetch all records using exact total
      params.set("size", String(total));
      const endpoint = `/admin/bookings/booking/customer?${params.toString()}`;

      const res =
        await apiClient.get<BookingCustomerPaginatedResponse>(endpoint);
      const customers: BookingCustomer[] = res.content || [];

      // Generate Filename
      const dateStr = format(new Date(), "dd-MMM-yyyy");
      const filename = `All_Customers_${dateStr}.xlsx`;

      // Map Data for Excel — name, email, phone number
      const exportData = customers.map((c) => ({
        "Customer Name": c.customerName,
        Email: c.email,
        "Phone Number": c.phoneNumber,
      }));

      // Create Worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set Column Widths for better readability
      ws["!cols"] = [
        { wch: 25 }, // Name
        { wch: 30 }, // Email
        { wch: 15 }, // Phone
      ];

      XLSX.utils.book_append_sheet(wb, ws, "All Customers");
      XLSX.writeFile(wb, filename);

      toast.success("Export Complete!", { id: "export-all-customers" });
    } catch (error) {
      console.error(error);
      toast.error("Export failed. Please try again.", {
        id: "export-all-customers",
      });
    } finally {
      setIsExportingAll(false);
    }
  };

  return { handleExportAllCustomers, isExportingAll };
}
