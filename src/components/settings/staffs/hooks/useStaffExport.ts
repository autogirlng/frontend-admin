import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { apiClient } from "@/lib/apiClient";
import { PaginatedResponse, AdminUser } from "../types";

interface UseStaffExportProps {
  searchTerm: string;
}

export type ExportFormat = "xlsx" | "csv";

export function useStaffExport({ searchTerm }: UseStaffExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportStaff = async (exportFormat: ExportFormat = "xlsx") => {
    setIsExporting(true);
    const label = exportFormat === "csv" ? "CSV" : "Excel";
    toast.loading(`Preparing ${label} export...`, { id: "export-staff" });

    try {
      const params = new URLSearchParams();
      params.append("page", "0");
      params.append("size", "1");

      if (searchTerm.trim() !== "") {
        params.append("searchTerm", searchTerm.trim());
      }

      // Step 1: Fetch total count
      const countRes = await apiClient.get<PaginatedResponse<AdminUser>>(
        `/admin/users/admins?${params.toString()}`
      );
      const total = countRes.totalItems || 0;

      if (total === 0) {
        toast.error("No staff found to export", { id: "export-staff" });
        setIsExporting(false);
        return;
      }

      // Step 2: Fetch all records using exact total
      params.set("size", String(total));
      const endpoint = `/admin/users/admins?${params.toString()}`;

      const res = await apiClient.get<PaginatedResponse<AdminUser>>(endpoint);
      const staff = res.content || [];

      // Generate Filename
      const dateStr = format(new Date(), "dd-MMM-yyyy");
      const ext = exportFormat === "csv" ? "csv" : "xlsx";
      const filename = `Staff_List_${dateStr}.${ext}`;

      // Map Data for Export
      const exportData = staff.map((s) => ({
        "First Name": s.firstName,
        "Last Name": s.lastName,
        Email: s.email,
        "Phone Number": s.phoneNumber,
        Department: s.departmentName || "N/A",
        Status: s.active ? "Active" : "Inactive",
      }));

      // Create Worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set Column Widths for better readability
      ws["!cols"] = [
        { wch: 20 }, // First Name
        { wch: 20 }, // Last Name
        { wch: 30 }, // Email
        { wch: 18 }, // Phone Number
        { wch: 20 }, // Department
        { wch: 10 }, // Status
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Staff");

      if (exportFormat === "csv") {
        const csvOutput = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        XLSX.writeFile(wb, filename);
      }

      toast.success("Export Complete!", { id: "export-staff" });
    } catch (error) {
      console.error(error);
      toast.error("Export failed. Please try again.", { id: "export-staff" });
    } finally {
      setIsExporting(false);
    }
  };

  return { handleExportStaff, isExporting };
}
