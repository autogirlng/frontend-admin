import { AxiosError } from "axios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";
import { handleErrors } from "@/utils/functions";
import { AssignNewDriver, ErrorResponse } from "@/utils/types";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";

export default function useListingDrivers(id: string) {
  const http = useHttp();
  const queryClient = useQueryClient();

  const { user } = useAppSelector((state) => state.user);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleModal = (value: boolean) => setOpenModal(value);

  const {
    data: drivers,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["getAssignedDrivers", user?.id, id],

    queryFn: () =>
      http.get<AssignNewDriver[]>(`${ApiRoutes.fetchVehicle}/${id}`),
    enabled: !!user?.id && !!id,
    retry: false,
  });

  const assignNewDriver = useMutation({
    mutationFn: (values: AssignNewDriver) =>
      http.post<AssignNewDriver>("/drivers", values),

    onSuccess: (data) => {
      console.log("Assign New Driver successful", data);

      queryClient.setQueryData(
        ["getAssignedDrivers", user?.id, id],
        (oldData: AssignNewDriver[] | undefined) => {
          // If there's no existing data, return array with new driver
          if (!oldData) return [data];

          // Return new array with existing drivers plus new driver
          return [...oldData, data];
        }
      );

      handleModal(false);
    },

    onError: (error: AxiosError<ErrorResponse>) =>
      handleErrors(error, "Assign New Driver"),
  });

  return {
    isError,
    isLoading,
    openModal,
    handleModal,
    assignNewDriver,
    drivers,
  };
}
