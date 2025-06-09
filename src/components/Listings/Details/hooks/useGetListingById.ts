import { useHttp } from "@/utils/useHttp";
import { useAppSelector } from "@/lib/hooks";
import { EarningsStatistics, ListingInformation } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ApiRoutes } from "@/utils/ApiRoutes";

export default function useGetListingById({ id }: { id: string }) {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["getListingById", id],

    queryFn: async () =>
      http.get<ListingInformation>(`${ApiRoutes.fetchVehicle}/${id}`),
    enabled: !!user?.id && !!id,
    retry: false,
  });

  const vehicleDetails = useMemo(() => {
    if (data) {
      return [
        { make: data?.make || "N/A" },
        { model: data?.model || "N/A" },
        { year: data?.yearOfRelease || "N/A" },
        { colour: data?.vehicleColor || "N/A" },
        { city: data?.location || "N/A" },
        { vehicleType: data?.vehicleType || "N/A" },
        { seatingCapacity: data?.numberOfSeats || "N/A" },
      ];
    }
    return [{}];
  }, [data]);

  const vehicleImages = useMemo(() => {
    if (data) {
      return [
        data?.VehicleImage?.frontView,
        data?.VehicleImage?.backView,
        data?.VehicleImage?.sideView1,
        data?.VehicleImage?.sideView2,
        data?.VehicleImage?.interior,
        data?.VehicleImage?.other,
      ];
    }
    console.log("data images", data);
    return [];
  }, [data]);

  return {
    listingDetail: {
      ...data,
      statistics: data?.user?.statistics as EarningsStatistics,
    } as ListingInformation,
    isError,
    isLoading,
    isSuccess,
    vehicleDetails,
    vehicleImages,
  };
}
