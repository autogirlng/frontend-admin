"use client";

import React, { useState, useMemo } from "react";
import { format, subYears } from "date-fns";
import { Trophy, Activity, MapPin } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useGetLeaderboard } from "./hooks/useLeaderboard";
import {
  LeaderboardBookingStatus,
  OwnerType,
  SortOrder,
} from "./types/leaderboard";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import Select, { Option } from "@/components/generic/ui/Select";
import AddressInput from "@/components/generic/ui/AddressInput";
import CustomLoader from "@/components/generic/CustomLoader";
import { DatePickerWithRange } from "../dashboard/availability/DatePickerWithRange";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import Button from "@/components/generic/ui/Button";
import { VehicleAnalyticsModal } from "./VehicleAnalyticsModal";

const statusOptions: Option[] = [
  { id: "", name: "All Statuses" },
  ...Object.values(LeaderboardBookingStatus).map((status) => ({
    id: status,
    name: status.replace(/_/g, " "),
  })),
];

const ownerOptions: Option[] = [
  { id: "", name: "All Owners" },
  ...Object.values(OwnerType).map((type) => ({ id: type, name: type })),
];

const sortOptions: Option[] = [
  { id: SortOrder.DESC, name: "Highest First (DESC)" },
  { id: SortOrder.ASC, name: "Lowest First (ASC)" },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

export default function Leaderboard() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subYears(new Date(), 1),
    to: new Date(),
  });

  const [statusFilter, setStatusFilter] = useState<Option | null>(
    statusOptions[2],
  );
  const [ownerFilter, setOwnerFilter] = useState<Option | null>(null);
  const [sortFilter, setSortFilter] = useState<Option>(sortOptions[0]);

  const [addressSearch, setAddressSearch] = useState("");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [selectedVehicleForAnalytics, setSelectedVehicleForAnalytics] =
    useState<{ id: string; name: string } | null>(null);

  const filters = useMemo(
    () => ({
      page: currentPage,
      size: pageSize,
      bookingStatuses: statusFilter?.id || undefined,
      ownerType: ownerFilter?.id || undefined,
      sortOrder: sortFilter.id,
      startDate: dateRange?.from
        ? format(dateRange.from, "yyyy-MM-dd'T'00:00:00")
        : undefined,
      endDate: dateRange?.to
        ? format(dateRange.to, "yyyy-MM-dd'T'23:59:59")
        : undefined,
      latitude: location?.latitude,
      longitude: location?.longitude,
    }),
    [
      currentPage,
      pageSize,
      statusFilter,
      ownerFilter,
      sortFilter,
      dateRange,
      location,
    ],
  );

  const { data, isLoading, isError, isPlaceholderData } =
    useGetLeaderboard(filters);
  const vehicles = data?.content || [];

  const columns: ColumnDefinition<any>[] = [
    {
      header: "Rank",
      accessorKey: "rank",
      cell: (item) => {
        const index = vehicles.indexOf(item);
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-sm">
            #{currentPage * pageSize + index + 1}
          </div>
        );
      },
    },
    {
      header: "Vehicle",
      accessorKey: "vehicleDetails",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
            {item.vehicleDetails.photos?.find((p: any) => p.isPrimary)
              ?.cloudinaryUrl ? (
              <img
                src={
                  item.vehicleDetails.photos.find((p: any) => p.isPrimary)
                    .cloudinaryUrl
                }
                alt="Vehicle"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                N/A
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {item.vehicleDetails.name}
            </div>
            <div className="text-xs text-gray-500">
              {item.vehicleDetails.vehicleIdentifier}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Location",
      accessorKey: "city",
      cell: (item) => (
        <div className="flex items-center text-gray-600 gap-1 text-sm capitalize">
          <MapPin className="w-4 h-4 text-gray-400" />
          {item.vehicleDetails.city}
        </div>
      ),
    },
    {
      header: "Total Bookings",
      accessorKey: "bookingCount",
      cell: (item) => (
        <span className="font-medium text-gray-900">
          {item.bookingCount} Trips
        </span>
      ),
    },
    {
      header: "Revenue Generated",
      accessorKey: "totalAmount",
      cell: (item) => (
        <span className="font-mono font-semibold text-green-700">
          {formatCurrency(item.totalAmount)}
        </span>
      ),
    },
    {
      header: "Analytics",
      accessorKey: "action",
      cell: (item) => (
        <Button
          variant="secondary"
          className="py-1.5 px-3 text-xs"
          onClick={() =>
            setSelectedVehicleForAnalytics({
              id: item.vehicleDetails.id,
              name: item.vehicleDetails.name,
            })
          }
        >
          <Activity className="w-3.5 h-3.5 mr-1" /> View Stats
        </Button>
      ),
    },
  ];

  return (
    <main className="py-3 max-w-8xl mx-auto relative">
      <div className="flex flex-wrap items-center justify-between mb-8">
        <div className="my-1">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" /> Vehicle Leaderboard
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            Discover top-performing vehicles by bookings and revenue.
          </p>
        </div>
      </div>

      <div className="bg-white p-5 border border-gray-200 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <AddressInput
              id="location"
              label="Location"
              placeholder="Search by city or area..."
              value={addressSearch}
              onChange={setAddressSearch}
              onLocationSelect={setLocation}
            />
          </div>
          <div className="lg:col-span-2">
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>
          <Select
            label="Sort Order"
            hideLabel
            options={sortOptions}
            selected={sortFilter}
            onChange={(opt) => setSortFilter(opt)}
          />
          <Select
            label="Status"
            hideLabel
            options={statusOptions}
            selected={statusFilter}
            onChange={(opt) => setStatusFilter(opt)}
            placeholder="All Statuses"
          />
          <Select
            label="Owner Type"
            hideLabel
            options={ownerOptions}
            selected={ownerFilter}
            onChange={(opt) => setOwnerFilter(opt)}
            placeholder="All Owners"
          />
        </div>
      </div>

      {isLoading && !data && <CustomLoader />}

      {isError && (
        <div className="flex flex-col items-center p-10 text-red-600 bg-red-50 border border-red-200">
          <span className="font-semibold">
            Failed to load leaderboard data.
          </span>
        </div>
      )}

      {!isLoading && !isError && vehicles.length === 0 && (
        <div className="flex justify-center p-10 text-gray-500 border border-dashed border-gray-300 bg-gray-50">
          <p>No vehicles found for the selected criteria.</p>
        </div>
      )}

      {!isError && vehicles.length > 0 && (
        <div
          className={`bg-white border border-gray-200 overflow-hidden ${isPlaceholderData ? "opacity-60" : ""}`}
        >
          <CustomTable
            data={vehicles}
            columns={columns}
            getUniqueRowId={(item) => item.vehicleDetails.id}
          />
        </div>
      )}

      {data && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={data.totalPages}
          onPageChange={setCurrentPage}
          isLoading={isPlaceholderData}
        />
      )}

      {selectedVehicleForAnalytics && (
        <VehicleAnalyticsModal
          vehicleId={selectedVehicleForAnalytics.id}
          vehicleName={selectedVehicleForAnalytics.name}
          onClose={() => setSelectedVehicleForAnalytics(null)}
        />
      )}
    </main>
  );
}
