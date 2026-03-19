"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Booking } from "./types";
import TextInput from "@/components/generic/ui/TextInput";
import { Search, Download, AlertCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Button from "@/components/generic/ui/Button";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";
import {
  useGetOrganizationBookings,
  useGetOrganizationDetails,
} from "@/lib/hooks/organizations/useOrganizations";
import { useOrganizationBookingsExport } from "@/lib/hooks/organizations/useOrganizationBookingsExport";

const formatPrice = (price: number = 0) => `₦${price.toLocaleString()}`;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getStatusClasses = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "COMPLETED":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface OrganizationBookingsProps {
  organizationId: string;
}

export default function OrganizationBookings({
  organizationId,
}: OrganizationBookingsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);

  const { data: orgDetail } = useGetOrganizationDetails(organizationId);
  const { data: bookingsData, isLoading } = useGetOrganizationBookings(organizationId, currentPage);
  const orgName = orgDetail?.name ?? "Organization";
  const allBookings = useMemo(() => bookingsData?.content ?? [], [bookingsData?.content]);
  const totalPages = bookingsData?.totalPages ?? 0;

  const { handleExport, isExporting } = useOrganizationBookingsExport({
    organizationId,
    orgName,
  });

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const filteredBookings = useMemo(() => {
    if (!searchTerm.trim()) return allBookings;
    const term = searchTerm.toLowerCase();
    return allBookings.filter(
      (b) =>
        b.invoiceNumber.toLowerCase().includes(term) ||
        b.bookingRef.toLowerCase().includes(term) ||
        `${b.user.firstName} ${b.user.lastName}`.toLowerCase().includes(term) ||
        b.status.toLowerCase().includes(term)
    );
  }, [searchTerm, allBookings]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);



  const columns: ColumnDefinition<Booking>[] = [
    { header: "Invoice #", accessorKey: "invoiceNumber" },
    { header: "Booking Ref", accessorKey: "bookingRef" },
    {
      header: "User",
      accessorKey: "userId",
      cell: (item) => (
        <span className="font-medium text-gray-900">
          {item.user.firstName} {item.user.lastName}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusClasses(
            item.status
          )}`}
        >
          {item.status}
        </span>
      ),
    },
    {
      header: "Total Price",
      accessorKey: "totalPrice",
      cell: (item) => <span>{formatPrice(item.totalPrice)}</span>,
    },
    {
      header: "Booked At",
      accessorKey: "bookedAt",
      cell: (item) => <span>{formatDate(item.bookedAt)}</span>,
    },
    {
      header: "Pickup",
      accessorKey: "bookingId",
      cell: (item) => (
        <span className="text-gray-600">
          {item.segments[0]?.pickupLocationString || "N/A"}
        </span>
      ),
    },
    {
      header: "Dropoff",
      accessorKey: "bookingRef",
      cell: (item) => (
        <span className="text-gray-600">
          {item.segments[0]?.dropoffLocationString || "N/A"}
        </span>
      ),
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
              {orgName} — Bookings
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              View all bookings for this organization.
            </p>
          </div>
          <Button
            onClick={handleExport}
            variant="primary"
            size="smd"
            disabled={isExporting}
            className="w-full sm:w-auto min-w-35 whitespace-nowrap"
          >
            {isExporting ? (
              <span>Exporting...</span>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Export Bookings
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
            label="Search Bookings"
            id="search-org-bookings"
            hideLabel
            type="text"
            placeholder="Search by invoice, booking ref, user, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            style={{ paddingLeft: 35 }}
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <CustomLoader size="sm" showText={false} />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-gray-500">
            <AlertCircle className="h-8 w-8" />
            <p>No bookings found.</p>
          </div>
        ) : (
          <CustomTable
            data={filteredBookings}
            columns={columns}
            getUniqueRowId={(item) => item.bookingId}
          />
        )}

        {/* Pagination */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </>
  );
}
