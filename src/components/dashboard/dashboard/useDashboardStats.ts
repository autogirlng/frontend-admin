// lib/hooks/dashboard/useDashboardStats.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient"; // Adjust path
import {
  BookingStats,
  PlatformStats,
  VehicleOnboardingStats,
  VehicleFleetStats,
} from "./types"; // Adjust path

// --- Query Keys ---
const BOOKING_STATS_KEY = "bookingStats";
const PLATFORM_STATS_KEY = "platformStats";
const VEHICLE_ONBOARDING_STATS_KEY = "vehicleOnboardingStats";
const VEHICLE_FLEET_STATS_KEY = "vehicleFleetStats";

// --- 1. Get Booking Stats ---
export function useGetBookingStats() {
  return useQuery<BookingStats, Error>({
    queryKey: [BOOKING_STATS_KEY],
    queryFn: () => apiClient.get<BookingStats>("/admin/bookings/stats"),
  });
}

// --- 2. Get Platform Stats ---
export function useGetPlatformStats() {
  return useQuery<PlatformStats, Error>({
    queryKey: [PLATFORM_STATS_KEY],
    queryFn: () => apiClient.get<PlatformStats>("/admin/stats/platform"),
  });
}

// --- 3. Get Vehicle Onboarding Stats ---
export function useGetVehicleOnboardingStats() {
  return useQuery<VehicleOnboardingStats, Error>({
    queryKey: [VEHICLE_ONBOARDING_STATS_KEY],
    queryFn: () =>
      apiClient.get<VehicleOnboardingStats>("/vehicles/admin/stats"),
  });
}

// --- 4. Get Vehicle Fleet Stats ---
export function useGetVehicleFleetStats() {
  return useQuery<VehicleFleetStats, Error>({
    queryKey: [VEHICLE_FLEET_STATS_KEY],
    queryFn: () =>
      apiClient.get<VehicleFleetStats>("/vehicles/admin/stats/fleet"),
  });
}
