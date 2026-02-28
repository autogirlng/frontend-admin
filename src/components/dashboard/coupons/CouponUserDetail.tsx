"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import clsx from "clsx";
import { AlertCircle, Ticket } from "lucide-react";

import { useGetCouponDetails, useGetBookingsByCoupon } from "./useCoupons";
import { BookingContent, PaginatedResponse } from "./types";

import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import CustomLoader from "@/components/generic/CustomLoader";

interface CouponUserDetailProps {
  couponId: string;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);

const statusColor = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "completed" || s === "confirmed") return "bg-green-100 text-green-700";
  if (s === "pending" || s === "ongoing") return "bg-yellow-100 text-yellow-700";
  if (s === "cancelled" || s === "rejected") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};

const columns: ColumnDefinition<BookingContent>[] = [
  {
    accessorKey: "bookingRef",
    header: "Booking Ref",
  },
  {
    accessorKey: "invoiceNumber",
    header: "Invoice Number",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (item) => (
      <span
        className={clsx(
          "inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize",
          statusColor(item.status)
        )}
      >
        {item.status}
      </span>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: (item) => formatCurrency(item.totalPrice),
  },
  {
    accessorKey: "bookedAt",
    header: "Booked At",
    cell: (item) => {
      try {
        return format(new Date(item.bookedAt), "MMM dd, yyyy");
      } catch {
        return item.bookedAt ?? "—";
      }
    },
  },
  {
    accessorKey: "user",
    header: "User",
    cell: (item) =>
      item.user
        ? `${item.user.firstName} ${item.user.lastName}`
        : "N/A",
  },
];

export default function CouponUserDetail({ couponId }: CouponUserDetailProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: coupon,
    isLoading: isCouponLoading,
    isError: isCouponError,
  } = useGetCouponDetails(couponId);

  const couponCode = coupon?.code ?? null;

  const { data, isLoading, isError, isPlaceholderData } =
    useGetBookingsByCoupon(couponCode, currentPage);

  // apiClient.handleResponse already unwraps the outer envelope (returns data.data),
  // so `data` here is PaginatedResponse<BookingContent> directly.
  const paginatedData = data as unknown as PaginatedResponse<BookingContent> | undefined;
  const bookings = paginatedData?.content ?? [];
  const totalPages = paginatedData?.totalPages ?? 0;

  if (isCouponLoading || isLoading) {
    return <CustomLoader />;
  }

  if (isCouponError) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-600">
        <AlertCircle className="h-5 w-5" />
        <p>Failed to load coupon details. Please try again.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-600">
        <AlertCircle className="h-5 w-5" />
        <p>Failed to load bookings for this coupon. Please try again.</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <Ticket className="mb-3 h-10 w-10 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
        <p className="mt-1 text-sm text-gray-500">
          There are no bookings associated with coupon <strong>{couponCode ?? couponId}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Ticket className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">
          Bookings for coupon: <span className="text-[#F4A100]">{couponCode ?? couponId}</span>
        </h2>
      </div>

      <div className={clsx(isPlaceholderData && "opacity-50")}>
        <CustomTable
          data={bookings}
          columns={columns}
          getUniqueRowId={(item) => item.bookingId}
        />
      </div>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isPlaceholderData}
        />
      )}
    </div>
  );
}
