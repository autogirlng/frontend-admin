import { useHttp } from "@/utils/useHttp";
import { useAppSelector } from "@/lib/hooks";
import { VehicleInformation } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

export default function useGetCustomerView({ id }: { id: string }) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["getCustomerView", id],

    queryFn: async () =>
      http.get<VehicleInformation | null>(`/vehicle-onboarding/${id}`),
    enabled: !!user?.id && !!id,
    retry: false,
  });

  return {
    vehicle: data,
    isError,
    isLoading,
    isSuccess,
  };
}
