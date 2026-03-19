import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { apiClient } from "@/lib/apiClient";
import { OrganizationTransaction, PaginatedData } from "@/components/dashboard/organizations/types";

interface UseOrganizationTransactionsExportProps {
  organizationId: string;
  orgName: string;
}

export function useOrganizationTransactionsExport({
  organizationId,
  orgName,
}: UseOrganizationTransactionsExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!organizationId) return;

    setIsExporting(true);
    toast.loading("Preparing export…", { id: "export-org-txns" });

    try {
      const countRes = await apiClient.get<PaginatedData<OrganizationTransaction>>(
        `/admin/organizations/${organizationId}/transactions?page=0&size=1`
      );
      const total = countRes.totalItems || 0;

      if (total === 0) {
        toast.error("No transactions found to export.", { id: "export-org-txns" });
        setIsExporting(false);
        return;
      }

      const res = await apiClient.get<PaginatedData<OrganizationTransaction>>(
        `/admin/organizations/${organizationId}/transactions?page=0&size=${total}`
      );
      const transactions = res.content || [];

      const exportData = transactions.map((t) => ({
        Amount: t.amount,
        "Balance Before": t.balanceBefore,
        "Balance After": t.balanceAfter,
        Type: t.transactionType,
        Reference: t.reference,
        Description: t.description,
        "Staff Name": t.staffName,
        Date: t.createdAt
          ? format(new Date(t.createdAt), "MMM dd, yyyy")
          : "—",
      }));

      const dateStr = format(new Date(), "dd-MMM-yyyy");
      const safeName = orgName.replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `${safeName}_Transactions_${dateStr}.xlsx`;

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      ws["!cols"] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 10 },
        { wch: 25 },
        { wch: 35 },
        { wch: 20 },
        { wch: 16 },
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Transactions");
      XLSX.writeFile(wb, filename);

      toast.success("Export complete!", { id: "export-org-txns" });
    } catch (error) {
      console.error(error);
      toast.error("Export failed. Please try again.", { id: "export-org-txns" });
    } finally {
      setIsExporting(false);
    }
  };

  return { handleExport, isExporting };
}
