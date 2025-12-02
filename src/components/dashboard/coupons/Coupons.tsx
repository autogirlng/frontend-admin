// app/dashboard/coupons/page.tsx
"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  useGetCoupons,
  useToggleCouponStatus,
  useDeleteCoupon,
} from "./useCoupons";
import { Coupon } from "./types";
import { CreateCouponModal } from "./CreateCouponModal";
import { CouponDetailModal } from "./CouponDetailModal";

// Components
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import Button from "@/components/generic/ui/Button";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";

// Icons
import {
  Ticket,
  Plus,
  Eye,
  Trash2,
  Power,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import clsx from "clsx";

// Helper for currency
const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);

export default function CouponsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [modal, setModal] = useState<
    "create" | "view" | "delete" | "toggle" | null
  >(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // --- API Hooks ---
  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetCoupons(currentPage);
  const deleteMutation = useDeleteCoupon();
  const toggleMutation = useToggleCouponStatus();

  const coupons = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  // --- Handlers ---
  const openModal = (type: typeof modal, coupon: Coupon | null = null) => {
    setSelectedCoupon(coupon);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedCoupon(null);
  };

  const handleDelete = () => {
    if (!selectedCoupon) return;
    deleteMutation.mutate(selectedCoupon.id, { onSuccess: closeModal });
  };

  const handleToggle = () => {
    if (!selectedCoupon) return;
    toggleMutation.mutate(selectedCoupon.id, { onSuccess: closeModal });
  };

  // --- Columns ---
  const getActions = (coupon: Coupon): ActionMenuItem[] => [
    {
      label: "View Details",
      icon: Eye,
      onClick: () => openModal("view", coupon),
    },
    {
      label: coupon.active ? "Deactivate" : "Activate",
      icon: Power,
      onClick: () => openModal("toggle", coupon),
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: () => openModal("delete", coupon),
      danger: true,
    },
  ];

  const columns: ColumnDefinition<Coupon>[] = [
    {
      header: "Code",
      accessorKey: "code",
      cell: (item) => (
        <span className="font-mono font-bold text-[#0096FF]">{item.code}</span>
      ),
    },
    {
      header: "Discount",
      accessorKey: "discountAmount",
      cell: (item) => (
        <span className="font-semibold">
          {formatPrice(item.discountAmount)}
        </span>
      ),
    },
    {
      header: "Usage",
      accessorKey: "usageCount",
      cell: (item) => (
        <span className="text-gray-600 text-sm">
          {item.usageCount} / {item.usageLimit ?? "∞"}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "active",
      cell: (item) => (
        <span
          className={clsx(
            "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full",
            item.active
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600"
          )}
        >
          {item.active ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <XCircle className="w-3 h-3" />
          )}
          {item.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Expiry",
      accessorKey: "expiryDate",
      cell: (item) =>
        item.expiryDate ? (
          <span className="text-sm">
            {format(new Date(item.expiryDate), "MMM d, yyyy")}
          </span>
        ) : (
          <span className="text-xs text-gray-400">No Expiry</span>
        ),
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
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage discount codes and promotions.
            </p>
          </div>
          <Button
            variant="primary"
            className="w-auto"
            onClick={() => openModal("create")}
          >
            <Plus className="h-5 w-5 mr-2" /> Create Coupon
          </Button>
        </div>

        {/* Content */}
        {isLoading && !paginatedData && <CustomLoader />}

        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">Failed to load coupons.</span>
          </div>
        )}

        {!isLoading && !isError && coupons.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 text-gray-500 border-2 border-dashed rounded-xl">
            <Ticket className="h-16 w-16 text-gray-300 mb-4" />
            <p className="font-semibold text-lg">No Coupons Found</p>
            <p className="text-sm">Create a new coupon to get started.</p>
          </div>
        )}

        {!isError && (coupons.length > 0 || isLoading) && (
          <div
            className={clsx(
              "transition-opacity",
              isPlaceholderData && "opacity-50"
            )}
          >
            <CustomTable
              data={coupons}
              columns={columns}
              getUniqueRowId={(item) => item.id}
            />
          </div>
        )}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isPlaceholderData}
        />
      </main>

      {/* Modals */}
      {modal === "create" && <CreateCouponModal onClose={closeModal} />}
      {modal === "view" && selectedCoupon && (
        <CouponDetailModal couponId={selectedCoupon.id} onClose={closeModal} />
      )}

      {/* Delete Modal */}
      {modal === "delete" && selectedCoupon && (
        <ActionModal
          title="Delete Coupon"
          message={
            <>
              Are you sure you want to delete{" "}
              <strong>{selectedCoupon.code}</strong>? This cannot be undone.
            </>
          }
          actionLabel="Delete"
          onClose={closeModal}
          onConfirm={handleDelete}
          isLoading={deleteMutation.isPending}
          variant="danger"
        />
      )}

      {/* Toggle Status Modal */}
      {modal === "toggle" && selectedCoupon && (
        <ActionModal
          title={
            selectedCoupon.active ? "Deactivate Coupon" : "Activate Coupon"
          }
          message={
            <>
              Are you sure you want to{" "}
              {selectedCoupon.active ? "deactivate" : "activate"}{" "}
              <strong>{selectedCoupon.code}</strong>?
            </>
          }
          actionLabel={selectedCoupon.active ? "Deactivate" : "Activate"}
          onClose={closeModal}
          onConfirm={handleToggle}
          isLoading={toggleMutation.isPending}
          variant={selectedCoupon.active ? "danger" : "primary"}
        />
      )}
    </>
  );
}
