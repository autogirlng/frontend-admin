import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { apiClient } from "@/lib/apiClient";
import { PaginatedResponse } from "@/components/dashboard/finance/types"; // Adjust path if this type is shared
import { Customer } from "../types"; // Adjust path to your customer types

interface UseCustomerExportProps {
  searchTerm: string;
}

export function useCustomerExport({ searchTerm }: UseCustomerExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCustomers = async () => {
    setIsExporting(true);
    toast.loading("Preparing customer export...", { id: "export-customers" });

    try {
      const params = new URLSearchParams();
      params.append("page", "0");
      params.append("size", "1");

      if (searchTerm.trim() !== "") {
        params.append("searchTerm", searchTerm.trim());
      }

      // Step 1: Fetch total count
      const countRes = await apiClient.get<PaginatedResponse<Customer>>(
        `/admin/users/customers?${params.toString()}`
      );
      const total = countRes.totalItems || 0;

      if (total === 0) {
        toast.error("No customers found to export", { id: "export-customers" });
        setIsExporting(false);
        return;
      }

      // Step 2: Fetch all records using exact total
      params.set("size", String(total));
      const endpoint = `/admin/users/customers?${params.toString()}`;
      
      const res = await apiClient.get<PaginatedResponse<Customer>>(endpoint);
      const customers = res.content || [];

      // Generate Filename
      const dateStr = format(new Date(), "dd-MMM-yyyy");
      const filename = `Customers_List_${dateStr}.xlsx`;

      // Map Data for Excel
      const exportData = customers.map((c) => ({
        "Full Name": c.fullName,
        "Email": c.email,
        "Phone Number": c.phoneNumber,
        "Total Bookings": c.totalBookings,
        "Status": c.active ? "Active" : "Inactive",
      }));

      // Create Worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set Column Widths for better readability
      ws["!cols"] = [
        { wch: 25 }, // Name
        { wch: 30 }, // Email
        { wch: 15 }, // Phone
        { wch: 15 }, // Bookings
        { wch: 10 }, // Status
        { wch: 15 }, // Date
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Customers");
      XLSX.writeFile(wb, filename);

      toast.success("Export Complete!", { id: "export-customers" });
    } catch (error) {
      console.error(error);
      toast.error("Export failed. Please try again.", { id: "export-customers" });
    } finally {
      setIsExporting(false);
    }
  };

  return { handleExportCustomers, isExporting };
}