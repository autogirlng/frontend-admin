"use client";

import React, { useState, useEffect } from "react";
import { Car, AlertCircle, CheckCircle } from "lucide-react";
import VehicleCard from "./VehicleCard";
import SearchFiltersComponent from "./SearchFilters";
import Pagination from "./Pagination";
import {
  Vehicle,
  VehicleSearchResponse,
  SearchFilters,
} from "../types/vehicle";

const MUVMENT_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const AvailabilityComponent: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const today = new Date();
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(today.getDate() + 7);

  const formatDate = (date: Date) => date.toISOString().slice(0, 10);

  const [filters, setFilters] = useState<SearchFilters>({
    startDate: formatDate(today),
    endDate: formatDate(sevenDaysLater),
    search: "",
    page: 1,
    limit: 10,
  });

  const fetchVehicles = async () => {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: VehicleSearchResponse = await response.json();

      setVehicles(data.data);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching vehicles"
      );
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [filters.page]); // Auto-fetch when page changes

  const handleSearch = () => {
    fetchVehicles();
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Vehicle Availability
              </h1>
              <p className="text-gray-600">
                Find and book available vehicles for your dates
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Filters */}
        <SearchFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={handleSearch}
          loading={loading}
        />

        {/* Results Summary */}
        {!loading && !error && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">
                  Found <span className="font-semibold">{totalCount}</span>{" "}
                  vehicles
                  {filters.search && (
                    <span>
                      {" "}
                      matching "
                      <span className="font-medium">{filters.search}</span>"
                    </span>
                  )}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Page {filters.page} of {totalPages}
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">
                Error loading vehicles
              </span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={handleSearch}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg border"
                style={{
                  borderColor: "#f3f4f6", // border-gray-100
                  padding: "1.5rem",
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div
                    style={{
                      width: "3rem",
                      height: "3rem",
                      backgroundColor: "#e5e7eb", // bg-gray-200
                      borderRadius: "9999px",
                    }}
                  ></div>
                  <div className="flex-1">
                    <div
                      style={{
                        height: "1rem",
                        backgroundColor: "#e5e7eb", // bg-gray-200
                        borderRadius: "0.5rem",
                        width: "75%",
                        marginBottom: "0.5rem",
                      }}
                    ></div>
                    <div
                      style={{
                        height: "0.75rem",
                        backgroundColor: "#e5e7eb", // bg-gray-200
                        borderRadius: "0.5rem",
                        width: "50%",
                      }}
                    ></div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      height: "0.75rem",
                      backgroundColor: "#e5e7eb", // bg-gray-200
                      borderRadius: "0.5rem",
                    }}
                  ></div>
                  <div
                    style={{
                      height: "0.75rem",
                      backgroundColor: "#e5e7eb", // bg-gray-200
                      borderRadius: "0.5rem",
                      width: "83.333333%",
                    }}
                  ></div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                      gap: "0.25rem",
                      marginTop: "1rem",
                    }}
                  >
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: "2rem",
                          height: "2rem",
                          backgroundColor: "#e5e7eb", // bg-gray-200
                          borderRadius: "0.5rem",
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vehicle Grid */}
        {!loading && !error && vehicles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.vehicleId} vehicle={vehicle} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Empty State */}
        {!loading && !error && vehicles.length === 0 && (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No vehicles found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or date range to find available
              vehicles.
            </p>
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, search: "", page: 1 }));
                handleSearch();
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AvailabilityComponent;
