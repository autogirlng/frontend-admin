"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  useGetOrganizationTransactions, 
  useGetOrganizationDetails 
} from "@/lib/hooks/organizations/useOrganizations";
import { OrganizationTransaction } from "./types";
import TextInput from "@/components/generic/ui/TextInput";
import { Search, Download, AlertCircle } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import Button from "@/components/generic/ui/Button";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";

const PAGE_SIZE = 10;

const formatPrice = (price: number = 0) => `₦${price.toLocaleString()}`;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

interface OrganizationTransactionsProps {
  organizationId: string;
}

export default function OrganizationTransactions({
  organizationId,
}: OrganizationTransactionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // --- API Hooks ---
  const { data: orgDetails } = useGetOrganizationDetails(organizationId);
  const { 
    data: transactionData, 
    isLoading, 
    isError 
  } = useGetOrganizationTransactions(organizationId, currentPage, PAGE_SIZE);

  // FIXED: Removed .data layer because the hook returns PaginatedData/OrganizationDetail directly
  const orgName = orgDetails?.name || "Organization";
  const transactions = transactionData?.content || [];
  const totalPages = transactionData?.totalPages || 0;

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  // FIXED: Explicitly typed 't' as OrganizationTransaction
  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) return transactions;
    const term = searchTerm.toLowerCase();
    return transactions.filter((t: OrganizationTransaction) =>
      t.reference.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term) ||
      t.staffName.toLowerCase().includes(term) ||
      t.transactionType.toLowerCase().includes(term)
    );
  }, [searchTerm, transactions]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const handleExport = async () => {
    setIsExporting(true);
    toast.loading("Preparing export...", { id: "export-org-txns" });
    try {
      const { default: XLSX } = await import("xlsx");
      
      // FIXED: Explicitly typed 't' here as well
      const exportData = filteredTransactions.map((t: OrganizationTransaction) => ({
        Amount: t.amount,
        "Balance Before": t.balanceBefore,
        "Balance After": t.balanceAfter,
        Type: t.transactionType,
        Reference: t.reference,
        Description: t.description,
        "Staff Name": t.staffName,
        Date: formatDate(t.createdAt),
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      ws["!cols"] = [
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 10 },
        { wch: 25 }, { wch: 35 }, { wch: 20 }, { wch: 20 }
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Transactions");
      const dateStr = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
      XLSX.writeFile(wb, `${orgName.replace(/\s+/g, '_')}_Transactions_${dateStr}.xlsx`);
      
      toast.success("Export Complete!", { id: "export-org-txns" });
    } catch (error) {
      toast.error("Export failed.", { id: "export-org-txns" });
    } finally {
      setIsExporting(false);
    }
  };

  const columns: ColumnDefinition<OrganizationTransaction>[] = [
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (item) => (
        <span className="font-medium text-gray-900">
          {formatPrice(item.amount)}
        </span>
      ),
    },
    {
      header: "Balance Before",
      accessorKey: "balanceBefore",
      cell: (item) => <span className="text-gray-600">{formatPrice(item.balanceBefore)}</span>,
    },
    {
      header: "Balance After",
      accessorKey: "balanceAfter",
      cell: (item) => <span className="text-gray-900 font-medium">{formatPrice(item.balanceAfter)}</span>,
    },
    {
      header: "Type",
      accessorKey: "transactionType",
      cell: (item) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            item.transactionType === "CREDIT"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.transactionType}
        </span>
      ),
    },
    {
      header: "Reference",
      accessorKey: "reference",
      cell: (item) => (
        <span className="text-gray-500 text-xs font-mono truncate max-w-40 block">
          {item.reference}
        </span>
      ),
    },
    { header: "Description", accessorKey: "description" },
    { header: "Staff", accessorKey: "staffName" },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (item) => <span className="whitespace-nowrap">{formatDate(item.createdAt)}</span>,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        <div ref={topRef} />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {orgName} — Transactions
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              View all transactions for this organization.
            </p>
          </div>
          <Button
            onClick={handleExport}
            variant="primary"
            size="smd"
            disabled={isExporting || filteredTransactions.length === 0}
            className="w-full sm:w-auto min-w-35 whitespace-nowrap"
          >
            {isExporting ? (
              <span>Exporting...</span>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Export Transactions
              </>
            )}
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            label="Search Transactions"
            id="search-org-txns"
            hideLabel
            type="text"
            placeholder="Search within this page..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            style={{ paddingLeft: 35 }}
          />
        </div>

        {/* Status States & Table */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <CustomLoader size="sm" showText={false} />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-2 p-10 text-red-500 bg-red-50 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <p className="font-medium">Failed to load transactions. Please try again.</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-gray-500">
            <AlertCircle className="h-8 w-8" />
            <p>No transactions found.</p>
          </div>
        ) : (
          <>
            <CustomTable
              data={filteredTransactions}
              columns={columns}
              getUniqueRowId={(item) => item.transactionId}
            />
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>
    </>
  );
}