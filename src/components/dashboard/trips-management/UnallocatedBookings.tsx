"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Toaster } from "react-hot-toast";
import { AlertCircle, Car, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useGetUnallocatedBookings,
  UnallocatedBooking,
} from "@/lib/hooks/trips-management/useUnallocatedBookings";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import CustomLoader from "@/components/generic/CustomLoader";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";

import { AllocateVehicleModal } from "../finance/AllocateVehicleModal";
import CustomBack from "@/components/generic/CustomBack";

export default function UnallocatedBookings() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );

  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetUnallocatedBookings(currentPage, 10);

  const bookings = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  const getActions = (booking: UnallocatedBooking): ActionMenuItem[] => [
    {
      label: "Allocate Vehicle",
      icon: Car,
      onClick: () => setSelectedBookingId(booking.bookingId),
    },
  ];

  const columns: ColumnDefinition<UnallocatedBooking>[] = [
    {
      header: "Client name",
      accessorKey: "guestFullName",
      cell: (item) => {
        const name =
          item.guestFullName ||
          item.user?.firstName + " " + item.user?.lastName ||
          "Unknown User";
        const email = item.guestEmail || item.user?.email || "No Email";
        return (
          <div>
            <div className="font-medium text-gray-900">{name}</div>
            <div className="text-gray-500 text-xs">
              {item.primaryPhoneNumber}
            </div>
            <div className="text-gray-500 text-xs">{email}</div>
          </div>
        );
      },
    },
    {
      header: "Booking Reference",
      accessorKey: "bookingRef",
      cell: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.bookingRef}</div>
          <div className="text-gray-500 text-xs">{item.invoiceNumber}</div>
        </div>
      ),
    },
    {
      header: "Pick-up Info",
      accessorKey: "segments",
      cell: (item) => {
        const firstSegment = item.segments?.[0];
        if (!firstSegment)
          return <span className="text-gray-400">No segments</span>;

        const dateStr = `${firstSegment.startDate}T${firstSegment.startTime}`;
        let formattedDate = `${firstSegment.startDate} ${firstSegment.startTime}`;
        try {
          formattedDate = format(new Date(dateStr), "MMM d, yyyy h:mm a");
        } catch (e) {}

        return (
          <div className="flex flex-col gap-1 max-w-[200px]">
            <span className="text-xs font-medium text-gray-900">
              {formattedDate}
            </span>
            <div
              className="text-xs text-gray-700 line-clamp-2"
              title={
                firstSegment.pickupLocationString || firstSegment.pickupLocation
              }
            >
              <span className="font-semibold text-gray-500">From: </span>
              {firstSegment.pickupLocationString ||
                firstSegment.pickupLocation ||
                "Unknown"}
            </div>
            <div
              className="text-xs text-gray-700 line-clamp-2"
              title={
                firstSegment.dropoffLocationString ||
                firstSegment.dropoffLocation
              }
            >
              <span className="font-semibold text-gray-500">To: </span>
              {firstSegment.dropoffLocationString ||
                firstSegment.dropoffLocation ||
                "Unknown"}
            </div>
          </div>
        );
      },
    },
    {
      header: "Price",
      accessorKey: "totalPrice",
      cell: (item) => (
        <span className="font-medium text-gray-900">
          ₦{item.totalPrice.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          {item.status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "bookingId",
      cell: (item) => <ActionMenu actions={getActions(item)} />,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <main className="py-0 max-w-8xl mx-auto">
        <div className="mb-6">
          <CustomBack />
          <h1 className="text-3xl font-bold text-gray-900">
            Unallocated Hourly Bookings
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            These bookings require immediate vehicle allocation to proceed.
          </p>
        </div>

        {isLoading && !paginatedData && <CustomLoader />}

        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">
              Failed to load unallocated bookings.
            </span>
          </div>
        )}

        {!isLoading && !isError && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center p-16 text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
            <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900">
              All Caught Up!
            </h3>
            <p className="mt-1">
              There are no unallocated hourly bookings at this time.
            </p>
          </div>
        )}

        {!isError && bookings.length > 0 && (
          <div
            className={isPlaceholderData ? "opacity-50 transition-opacity" : ""}
          >
            <CustomTable
              data={bookings}
              columns={columns}
              getUniqueRowId={(item) => item.bookingId}
            />
          </div>
        )}

        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isPlaceholderData}
          />
        )}
      </main>

      {selectedBookingId && (
        <AllocateVehicleModal
          bookingId={selectedBookingId}
          onClose={() => {
            setSelectedBookingId(null);
          }}
        />
      )}
    </>
  );
}
