"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Car, AlertCircle, CheckCircle } from "lucide-react";
import VehicleCard from "./VehicleCard";
import SearchFiltersComponent from "./SearchFilters";
import Pagination from "./Pagination";
import HourlyAvailabilityModal from "./HourlyAvailabilityModal"; // New Modal Component
import {
  Vehicle,
  VehicleSearchResponse,
  SearchFilters,
  HourlyAvailability,
  VehicleWithHourly,
} from "../types/vehicle";

const MUVMENT_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const AvailabilityComponent: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // State for the new Hourly Availability Modal
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    vehicle: Vehicle | null;
    date: string;
    hourlyData: HourlyAvailability[];
    loading: boolean;
    error: string | null;
  }>({
    isOpen: false,
    vehicle: null,
    date: "",
    hourlyData: [],
    loading: false,
    error: null,
  });

  const formatDate = (date: Date) => date.toISOString().slice(0, 10);

  const today = new Date();
  const defaultEndDate = new Date();
  defaultEndDate.setDate(today.getDate() + 6);

  const [filters, setFilters] = useState<SearchFilters>({
    startDate: formatDate(today),
    endDate: formatDate(defaultEndDate),
    search: "",
    page: 1,
    limit: 10,
  });

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
        search: filters.search,
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });

      const response = await fetch(
        `${MUVMENT_URL}/admin/avaliability/find?${params}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: VehicleSearchResponse = await response.json();
      setVehicles(data.data);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleSearch = () => {
    // Reset to page 1 for new searches
    setFilters((prev) => ({ ...prev, page: 1 }));
    // The useEffect will then trigger the fetch
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleDayClick = async (vehicle: Vehicle, date: string) => {
    setModalState({
      isOpen: true,
      vehicle,
      date,
      hourlyData: [],
      loading: true,
      error: null,
    });

    try {
      // FIX: Use 'vehicle.id' instead of 'vehicle.vehicleId'
      const response = await fetch(
        `${MUVMENT_URL}/admin/avaliability/${vehicle.id}/by-date?date=${date}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch hourly availability. Status: ${response.status}`
        );
      }

      const vehicleWithHourlyData: VehicleWithHourly = await response.json();

      const hourlyData = vehicleWithHourlyData.availability;

      setModalState((prev) => ({ ...prev, hourlyData, loading: false }));
    } catch (err) {
      setModalState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "An unknown error occurred",
      }));
    }
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      vehicle: null,
      date: "",
      hourlyData: [],
      loading: false,
      error: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-600 p-3 rounded-xl shadow-md">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Vehicle Availability
              </h1>
              <p className="text-gray-500 mt-1">
                View daily and hourly vehicle schedules at a glance.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
          loading={loading}
        />

        {!loading && !error && (
          <div className="mb-6 px-2 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-700">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>
                Showing <span className="font-semibold">{vehicles.length}</span>{" "}
                of <span className="font-semibold">{totalCount}</span> results
              </span>
            </div>
            <div className="text-gray-500">
              Page {filters.page} of {totalPages}
            </div>
          </div>
        )}

        {error && (
          <div
            className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md"
            role="alert"
          >
            <p className="font-bold flex items-center">
              <AlertCircle className="mr-2" />
              Error
            </p>
            <p>{error}</p>
            <button
              onClick={fetchVehicles}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Skeleton Loader */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 animate-pulse"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 mt-6">
                  {[...Array(7)].map((_, j) => (
                    <div
                      key={j}
                      className="w-full h-8 bg-gray-200 rounded-md"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && vehicles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onDayClick={(date) => handleDayClick(vehicle, date)}
                />
              ))}
            </div>

            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {!loading && !error && vehicles.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-md border">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              No Vehicles Found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search filters or date range.
            </p>
          </div>
        )}
      </main>

      {/* Render the Modal */}
      <HourlyAvailabilityModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        vehicle={modalState.vehicle}
        date={modalState.date}
        hourlyData={modalState.hourlyData}
        loading={modalState.loading}
        error={modalState.error}
      />
    </div>
  );
};

export default AvailabilityComponent;
