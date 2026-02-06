// app/dashboard/finance/consolidated/page.tsx
"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  FileText,
  Plus,
  CheckCircle,
  Download,
  View,
  AlertCircle,
  Layers,
  Pencil,
} from "lucide-react";
import { Toaster } from "react-hot-toast";

// Hooks
import {
  useGetConsolidatedInvoices,
  useConfirmConsolidatedInvoice,
  useDownloadConsolidatedPdf,
  useDownloadConsolidatedReceipt,
  usePreviewConsolidatedInvoiceBlob,
  usePreviewConsolidatedReceiptBlob,
  // useEditConsolidatedInvoice
} from "./useConsolidatedInvoices";
import { ConsolidatedInvoice } from "./consolidated-types";

// Components
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import CustomLoader from "@/components/generic/CustomLoader";
import Button from "@/components/generic/ui/Button";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import { CreateConsolidatedModal } from "./CreateConsolidatedModal";
import { DocumentPreviewModal } from "../finance/PreviewModal";
import { EditConsolidatedModal } from "./EditConsolidatedInvoice";
import { ConfirmConsolidatedModal } from "./ConfirmConsolidatedModal";
import { se } from "date-fns/locale";

// Helper to format currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(price);
};

export default function ConsolidatedInvoices() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEditConsolidatedModalOpen, setIsEditConsolidatedModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<ConsolidatedInvoice | null>(null);

  // Preview state
  const [previewConfig, setPreviewConfig] = useState<{
    type: "invoice" | "receipt";
    invoice: ConsolidatedInvoice;
  } | null>(null);

  // --- API Hooks ---
  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetConsolidatedInvoices(currentPage);


  // const editMutation = useEditConsolidatedInvoice();
  const confirmMutation = useConfirmConsolidatedInvoice();
  const downloadPdfMutation = useDownloadConsolidatedPdf();
  const downloadReceiptMutation = useDownloadConsolidatedReceipt();
  const previewInvoiceBlob = usePreviewConsolidatedInvoiceBlob();
  const previewReceiptBlob = usePreviewConsolidatedReceiptBlob();

  const invoices = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  // --- Handlers ---
  const handleConfirm = () => {
    if (!selectedInvoice) return;
    // confirmMutation.mutate(selectedInvoice.id, {
    //   onSuccess: () => {
    //     setIsConfirmModalOpen(false);
    //     setSelectedInvoice(null);
    //   },
    // });
  };

  // --- Column Definition ---
  const getActions = (invoice: ConsolidatedInvoice): ActionMenuItem[] => {
    const actions: ActionMenuItem[] = [];

    actions.push({
      label: "View Invoice",
      icon: View,
      onClick: () => setPreviewConfig({ type: "invoice", invoice }),
    });

    // 1. Download PDF (Always available)
    actions.push({
      label: "Download Invoice",
      icon: FileText,
      onClick: () =>
        downloadPdfMutation.mutate({
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
        }),
    });

    // 2. Confirm (Only for Drafts)
    if (invoice.status === "DRAFT") {
      actions.push({
        label: "Confirm Payment",
        icon: CheckCircle,
        onClick: () => {
          setSelectedInvoice(invoice);
          setIsConfirmModalOpen(true);
        },
      });
    }

    // 3. Download Receipt (Only for Paid/Confirmed)
    if (invoice.status === "PAID" || invoice.status === "CONFIRMED") {
      actions.push(
        {
          label: "View Receipt",
          icon: View,
          onClick: () => setPreviewConfig({ type: "receipt", invoice }),
        },
        {
          label: "Download Receipt",
          icon: Download,
          onClick: () =>
            downloadReceiptMutation.mutate({
              id: invoice.id,
              invoiceNumber: invoice.invoiceNumber,
            }),
        });
    }

    // 4. Edit Invoice (Only for Drafts)
    if (invoice.status === "DRAFT" || invoice.status === "CONFIRMED") {
      actions.push({
        label: "Edit Invoice",
        icon: Pencil,
        onClick: () => {
          setIsEditConsolidatedModalOpen(true);
          setSelectedInvoice(invoice);
        },
      });
    }

    return actions;
  };

  const columns: ColumnDefinition<ConsolidatedInvoice>[] = [
    {
      header: "Invoice #",
      accessorKey: "invoiceNumber",
      cell: (item) => (
        <span className="font-mono font-medium">{item.invoiceNumber}</span>
      ),
    },
    {
      header: "Customer",
      accessorKey: "customerName",
    },
    {
      header: "Bookings",
      accessorKey: "bookingCount",
      cell: (item) => (
        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
          {item.bookingCount} Items
        </span>
      ),
    },
    {
      header: "Total Amount",
      accessorKey: "totalAmount",
      cell: (item) => (
        <span className="font-bold">{formatPrice(item.totalAmount)}</span>
      ),
    },
    {
      header: "Date",
      accessorKey: "generatedAt",
      cell: (item) => format(new Date(item.generatedAt), "MMM d, yyyy"),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => {
        const isPaid = item.status === "PAID" || item.status === "CONFIRMED";
        return (
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${isPaid
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
              }`}
          >
            {item.status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item) => <ActionMenu actions={getActions(item)} />,
    },
  ];


  return (
    <>
      <Toaster position="top-right" />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div className="my-1">
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage all bookings on the platform.
            </p>
          </div>
          <div className="my-1">
            <Button
              variant="primary"
              className="w-auto"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New
            </Button>
          </div>
        </div>

        {/* --- Content --- */}
        {isLoading && !paginatedData && <CustomLoader />}

        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">Failed to load invoices.</span>
          </div>
        )}

        {!isLoading && !isError && invoices.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
            <Layers className="h-16 w-16 text-gray-300 mb-4" />
            <p className="font-semibold text-lg">
              No consolidated invoices found.
            </p>
            <p className="text-sm">Create one to group bookings together.</p>
          </div>
        )}

        {!isError && (invoices.length > 0 || isLoading) && (
          <div
            className={`transition-opacity ${isPlaceholderData ? "opacity-50" : ""
              }`}
          >
            <CustomTable
              data={invoices}
              columns={columns}
              getUniqueRowId={(item) => item.id}
            />
          </div>
        )}

        {/* --- Pagination --- */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isPlaceholderData}
        />
      </main>

      {/* --- Modals --- */}
      {isCreateModalOpen && (
        <CreateConsolidatedModal onClose={() => setIsCreateModalOpen(false)} />
      )}

      {isEditConsolidatedModalOpen && (
        <EditConsolidatedModal onClose={() => setIsEditConsolidatedModalOpen(false)} consolidatedInvoiceId={selectedInvoice?.id} customerName={selectedInvoice?.customerName} />
      )}

      {isConfirmModalOpen && selectedInvoice && (
        <ConfirmConsolidatedModal
          onClose={() => setIsConfirmModalOpen(false)}
          isOpen={isConfirmModalOpen}
          invoice={selectedInvoice}
          onSuccess={() => setIsConfirmModalOpen(false)}
        />
      )}

      {/* Document Preview Modal - Reused from your app */}
      {previewConfig && (
        <DocumentPreviewModal
          title={
            previewConfig.type === "invoice"
              ? "Consolidated Invoice Preview"
              : "Consolidated Receipt Preview"
          }
          onClose={() => setPreviewConfig(null)}
          fetchDocument={async () => {
            const id = previewConfig.invoice.id;
            if (previewConfig.type === "invoice") {
              return await previewInvoiceBlob.mutateAsync({ id });
            } else {
              return await previewReceiptBlob.mutateAsync({ id });
            }
          }}
        />
      )}


    </>
  );
}
