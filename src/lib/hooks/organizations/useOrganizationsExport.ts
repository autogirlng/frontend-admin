import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { apiClient } from "@/lib/apiClient";
import { Organization, PaginatedData } from "@/components/dashboard/organizations/types";

export function useOrganizationsExport() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    toast.loading("Preparing export…", { id: "export-orgs" });

    try {
      const countRes = await apiClient.get<PaginatedData<Organization>>(
        `/admin/organizations?page=0&size=1`
      );
      const total = countRes.totalItems || 0;

      if (total === 0) {
        toast.error("No organizations found to export.", { id: "export-orgs" });
        setIsExporting(false);
        return;
      }

      const res = await apiClient.get<PaginatedData<Organization>>(
        `/admin/organizations?page=0&size=${total}`
      );
      const organizations = res.content || [];

      const exportData = organizations.map((org) => ({
        Name: org.name,
        "RC Number": org.rcNumber,
        Industry: org.industry,
        "KYC Status": org.kycStatus.replace(/_/g, " "),
        "Creator Email": org.creatorEmail,
        "Created At": org.createdAt
          ? format(new Date(org.createdAt), "MMM dd, yyyy")
          : "—",
        Status: org.active ? "Active" : "Inactive",
      }));

      const dateStr = format(new Date(), "dd-MMM-yyyy");
      const filename = `Organizations_${dateStr}.xlsx`;

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      ws["!cols"] = [
        { wch: 25 },
        { wch: 15 },
        { wch: 25 },
        { wch: 15 },
        { wch: 30 },
        { wch: 16 },
        { wch: 10 },
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Organizations");
      XLSX.writeFile(wb, filename);

      toast.success("Export complete!", { id: "export-orgs" });
    } catch (error) {
      console.error(error);
      toast.error("Export failed. Please try again.", { id: "export-orgs" });
    } finally {
      setIsExporting(false);
    }
  };

  return { handleExport, isExporting };
}
