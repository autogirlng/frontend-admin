// app/services/apiService.ts

import { getSession } from "next-auth/react";

// A simple type for the API responses
export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
  timestamp: string;
};

// Types for our specific data
export type VehicleColor = {
  id: string;
  name: string;
  hexCode: string;
};

export type VehicleFeature = {
  id: string;
  name: string;
};

// Type for the PATCH payload
export type VehicleDetailsPayload = {
  licensePlateNumber?: string;
  stateOfRegistration?: string;
  vehicleColorId?: string;
  numberOfSeats?: number;
  description?: string;
  featureIds?: string[];
};

const baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Helper for PUBLIC routes (no token)
async function handlePublicResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An API error occurred");
  }
  return response.json();
}

// Helper for AUTHENTICATED routes (requires token)
async function handleAuthResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized access, e.g., force logout or refresh token
      throw new Error("You are not authorized. Please log in again.");
    }
    const errorData = await response.json();
    throw new Error(errorData.message || "An API error occurred");
  }
  return response.json();
}

/**
 * Fetches the list of available vehicle colors.
 */
export async function getVehicleColors(): Promise<ApiResponse<VehicleColor[]>> {
  const response = await fetch(`${baseURL}/public/vehicle-colors`);
  return handlePublicResponse<VehicleColor[]>(response); // Use public handler
}

/**
 * Fetches the list of available vehicle features.
 */
export async function getVehicleFeatures(): Promise<
  ApiResponse<VehicleFeature[]>
> {
  const response = await fetch(`${baseURL}/public/vehicle-features`);
  return handlePublicResponse<VehicleFeature[]>(response); // Use public handler
}

/**
 * Updates vehicle details with a PATCH request.
 * Now requires an accessToken.
 */
export async function updateVehicleDetails(
  id: string,
  payload: VehicleDetailsPayload,
  accessToken: string // <-- MODIFIED: Added token parameter
): Promise<ApiResponse<any>> {
  // Replace 'any' with the actual response type if known
  const response = await fetch(`${baseURL}/vehicles/details?id=${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  return handleAuthResponse<any>(response); // Use auth handler
}
