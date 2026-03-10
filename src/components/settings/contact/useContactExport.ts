import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { apiClient } from "@/lib/apiClient";
import { ContactFormEntry, PaginatedContactResponse } from "./types";

export type ExportFormat = "xlsx" | "csv";

interface UseContactExportProps {
  search?: string;
}

export function useContactExport({ search }: UseContactExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (exportFormat: ExportFormat = "xlsx") => {
    setIsExporting(true);
    const label = exportFormat === "csv" ? "CSV" : "Excel";
    toast.loading(`Preparing ${label} export...`, { id: "export-contacts" });

    try {
      const params = new URLSearchParams();
      params.append("page", "0");
      params.append("size", "1");
      if (search?.trim()) params.append("search", search.trim());

      const countRes = await apiClient.get<PaginatedContactResponse>(
        `/contact-form?${params.toString()}`,
      );
      const total = countRes.totalElements || 0;

      if (total === 0) {
        toast.error("No submissions found to export.", {
          id: "export-contacts",
        });
        setIsExporting(false);
        return;
      }

      params.set("size", String(total));
      const res = await apiClient.get<PaginatedContactResponse>(
        `/contact-form?${params.toString()}`,
      );
      const entries = res.content || [];

      const exportData = entries.map((e: ContactFormEntry) => ({
        "First Name": e.firstName,
        "Last Name": e.lastName,
        Email: e.email,
        Phone: e.phoneNumber,
        Location: e.location || "N/A",
        Message: e.message,
        Status: e.isRead ? "Read" : "Unread",
        "Submitted At": e.createdAt
          ? format(new Date(e.createdAt), "MMM dd, yyyy")
          : "—",
      }));

      const dateStr = format(new Date(), "dd-MMM-yyyy");
      const ext = exportFormat === "csv" ? "csv" : "xlsx";
      const filename = `Contact_Submissions_${dateStr}.${ext}`;

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      ws["!cols"] = [
        { wch: 18 },
        { wch: 18 },
        { wch: 28 },
        { wch: 18 },
        { wch: 22 },
        { wch: 40 },
        { wch: 10 },
        { wch: 16 },
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Contacts");

      if (exportFormat === "csv") {
        const csvOutput = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csvOutput], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        XLSX.writeFile(wb, filename);
      }

      toast.success("Export complete!", { id: "export-contacts" });
    } catch (error) {
      console.error(error);
      toast.error("Export failed. Please try again.", {
        id: "export-contacts",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return { handleExport, isExporting };
}
