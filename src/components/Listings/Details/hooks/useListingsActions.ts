import { useHttp } from "@/utils/useHttp";
import { handleErrors } from "@/utils/functions";
import {
  CalendarValue,
  ErrorResponse,
  VehicleInformation,
  VehicleStatus,
} from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useListingsActions(
  handleModal?: (open: boolean) => void,
  id?: string
) {
  const http = useHttp();
  const queryClient = useQueryClient();
  const router = useRouter();
  const listingsByIdQueryKey = ["getListingById", id];
  const [unavailabilityValue, onChangeUnavailability] =
    useState<CalendarValue>(null);

  const deactivateListing = useMutation({
    mutationFn: () =>
      http.put<VehicleInformation>(`/listings/deactivate/${id}`),

    onSuccess: (data) => {
      console.log("Deactivate Listing successful", data);
      queryClient.invalidateQueries({
        queryKey: listingsByIdQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["getListings"],
      });

      handleModal && handleModal(false);
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Deactivate Listing"),
  });

  const moveListingToDraft = useMutation({
    mutationFn: () => http.put(`/api/listings/draft/${id}`),

    onSuccess: (data) => {
      console.log("Move Listing to Draft successful", data);

      queryClient.invalidateQueries({
        queryKey: listingsByIdQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["getListings"],
      });

      handleModal && handleModal(false);
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Move Listing to Draft"),
  });

  const deleteListing = useMutation({
    mutationFn: () => http.delete(`/api/listings/${id}`),

    onSuccess: (data) => {
      console.log("Delete Listing successful", data);
      queryClient.invalidateQueries({
        queryKey: listingsByIdQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["getListings"],
      });

      router.push("/listings");
      handleModal && handleModal(false);
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Delete Listing"),
  });

  const updateListingStatusToBooked = useMutation({
    mutationFn: () =>
      http.put(`/api/listings/status/${id}`, { status: VehicleStatus.BOOKED }),

    onSuccess: (data) => {
      console.log("Update Listing status to booked successful", data);
      queryClient.invalidateQueries({
        queryKey: listingsByIdQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["getListings"],
      });
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Update Listing status to booked"),
  });

  const updateListingStatusToAvaliable = useMutation({
    mutationFn: () =>
      http.put(`/api/listings/status/${id}`, { status: VehicleStatus.ACTIVE }),

    onSuccess: (data) => {
      console.log("Update Listing status to available successful", data);

      queryClient.invalidateQueries({
        queryKey: listingsByIdQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["getListings"],
      });
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Update Listing status to available"),
  });

  const updateListingStatusToMaintenance = useMutation({
    mutationFn: () =>
      http.put(`/api/listings/status/${id}`, {
        status: VehicleStatus.MAINTENANCE,
      }),

    onSuccess: (data) => {
      console.log("Update Listing status to maintenance successful", data);
      queryClient.invalidateQueries({
        queryKey: listingsByIdQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["getListings"],
      });
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Update Listing status to maintenance"),
  });

  const updateListingStatusToUnavaliable = useMutation({
    mutationFn: () =>
      http.put(`/api/listings/status/${id}`, {
        status: VehicleStatus.UNAVAILABLE,
      }),

    onSuccess: (data) => {
      console.log("Update Listing status successful", data);
      queryClient.invalidateQueries({
        queryKey: listingsByIdQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["getListings"],
      });
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Update Listing status"),
  });

  return {
    deactivateListing,
    deleteListing,
    moveListingToDraft,
    updateListingStatusToBooked,
    updateListingStatusToAvaliable,
    updateListingStatusToMaintenance,
    updateListingStatusToUnavaliable,
    unavailabilityValue,
    onChangeUnavailability,
  };
}
