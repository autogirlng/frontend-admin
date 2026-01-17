"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, isValid } from "date-fns";
import { ArrowLeft, FileText, Calendar, User } from "lucide-react";
import {
  useGetAdminOfflineBookings,
  useGetAdminDetails,
} from "@/lib/hooks/settings/useAdmins";
import { OfflineBooking } from "@/components/settings/staffs/types";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import CustomLoader from "@/components/generic/CustomLoader";
import Button from "@/components/generic/ui/Button";

const StatusBadge = ({ status }: { status: string }) => {
  let colorClass = "bg-gray-100 text-gray-800";

  if (
    status === "CONFIRMED" ||
    status === "SUCCESSFUL" ||
    status === "COMPLETED"
  ) {
    colorClass = "bg-green-100 text-green-800 border border-green-200";
  } else if (status === "PENDING" || status === "PENDING_PAYMENT") {
    colorClass = "bg-yellow-100 text-yellow-800 border border-yellow-200";
  } else if (status?.includes("CANCELLED") || status === "FAILED") {
    colorClass = "bg-red-100 text-red-800 border border-red-200";
  }

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}
    >
      {status?.replace(/_/g, " ") || "N/A"}
    </span>
  );
};

export default function AdminCommissionsPage() {
  const params = useParams();
  const router = useRouter();
  const adminId = params.adminId as string;
  const [currentPage, setCurrentPage] = useState(0);

  const { data: adminData } = useGetAdminDetails(adminId);

  const {
    data: paginatedData,
    isLoading,
    isError,
  } = useGetAdminOfflineBookings(adminId, currentPage);

  const bookings = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  const columns: ColumnDefinition<OfflineBooking>[] = [
    {
      header: "Booking Ref",
      accessorKey: "invoiceNumber",
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-mono font-medium text-gray-900">
            {item.invoiceNumber}
          </span>
          <span className="text-xs text-gray-500">
            {item.createdAt && isValid(new Date(item.createdAt))
              ? format(new Date(item.createdAt), "MMM d, yyyy")
              : "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Customer",
      accessorKey: "customerName",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-900">
            {item.customerName || "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Vehicle",
      accessorKey: "vehicleName",
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{item.vehicleName}</span>
          <span className="text-xs text-gray-500">
            {item.vehicleIdentifier}
          </span>
        </div>
      ),
    },
    {
      header: "Trip Start",
      accessorKey: "firstSegmentStarts",
      cell: (item) => {
        const date = item.firstSegmentStarts
          ? new Date(item.firstSegmentStarts)
          : null;
        return (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span>
              {date && isValid(date)
                ? format(date, "MMM d, yyyy • h:mm a")
                : "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "bookingStatus",
      cell: (item) => <StatusBadge status={item.bookingStatus} />,
    },
    {
      header: "Total Value",
      accessorKey: "totalPrice",
      cell: (item) => (
        <span className="font-semibold text-gray-900">
          ₦{item.totalPrice?.toLocaleString() ?? "0.00"}
        </span>
      ),
    },
  ];

  return (
    <main className="py-1 max-w-8xl mx-auto px-0 sm:px-0 lg:px-0">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="secondary"
          size="sm"
          className="!w-10 !h-10 !p-0 rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Staff Commissions
          </h1>
          {adminData && (
            <p className="text-gray-500 text-sm mt-1">
              Offline bookings created by{" "}
              <span className="font-semibold text-gray-800">
                {adminData.firstName} {adminData.lastName}
              </span>
            </p>
          )}
        </div>
      </div>

      {isLoading && !paginatedData ? (
        <CustomLoader />
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-600">Failed to load commission data.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm font-medium">
                <FileText className="w-4 h-4" /> Total Bookings
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {paginatedData?.totalItems || 0}
              </p>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No Commissions Found
              </h3>
              <p className="text-gray-500 mt-1">
                This staff member hasn't created any offline bookings yet.
              </p>
            </div>
          ) : (
            <>
              <CustomTable
                data={bookings}
                columns={columns}
                getUniqueRowId={(item) => item.bookingId}
              />

              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      )}
    </main>
  );
}
