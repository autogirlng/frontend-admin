"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { handleErrors } from "@/utils/functions";
import { HostInformation, ErrorResponse, Member } from "@/utils/types";
import { useHttp } from "@/utils/useHttp";
import { ApiRoutes } from "@/utils/ApiRoutes";
import { LocalRoute } from "@/utils/LocalRoutes";
import { HostOnboardingFormValues } from "@/utils/initialValues";
import { useAppSelector } from "@/lib/hooks";
import { toast } from "react-toastify";

export function useHostOnboarding() {
  const http = useHttp();
  const router = useRouter();

  const mapFormValuesToApiPayload = (
    values: HostOnboardingFormValues
  ): Omit<HostInformation, "id"> => {
    const payload: Omit<HostInformation, "id"> = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      country: values.country,
      countryCode: values.countryCode,
      email: values.email,
      cities: values.outskirtsLocation,
      onBoardedBy: values.onboardedBy,
    };

    if (values.isOperatingAsBusiness) {
      payload.isBusiness = values.isOperatingAsBusiness;
      payload.businessName = values.businessName;
      payload.businessAddress = values.businessAddress;
      payload.businessPhoneNumber = values.businessNumber;
      payload.businessEmail = values.businessEmail;
    }

    return payload;
  };

  const hostMutation = useMutation<
    HostInformation,
    AxiosError<ErrorResponse>,
    HostOnboardingFormValues
  >({
    mutationFn: async (values) => {
      const apiPayload = mapFormValuesToApiPayload(values);
      let requestBody: any;
      let headers: HeadersInit = { "Content-Type": "application/json" }; // Default to JSON header

      // Handle file upload using FormData if 'mou' is a File
      if (values.mou instanceof File) {
        const formData = new FormData();
        Object.entries(apiPayload).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((item) => formData.append(key, item));
          } else if (typeof value === "boolean") {
            formData.append(key, value ? "true" : "false");
          } else if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });
        formData.append("mouDocument", values.mou);

        requestBody = formData;
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        requestBody = apiPayload;
      }

      const response = await http.post<HostInformation>(
        ApiRoutes.hostOnboarding,
        requestBody,
        { headers }
      );
      return response!;
    },
    onSuccess: (data) => {
      console.log("Host Onboarding successful:", data);

      router.push(LocalRoute.hostSuccessfulOnboarding);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.message);
      handleErrors(error, "Host Onboarding");
    },
  });

  return {
    hostMutation,
  };
}

type teamTable = {
  data: Member[];
  total: number;
  pageSize: number;
  totalPages: number;
};

export function useTeamMembers() {
  const http = useHttp();
  const { user } = useAppSelector((state) => state.user);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["members", user?.id],

    queryFn: async () =>
      http.get<teamTable>(`${ApiRoutes.getAllAdmin}?userRole=ADMIN`),
    enabled: !!user?.id,
    retry: false,
  });

  return {
    data: data?.data || [],
    isError,
    isLoading,
    isSuccess,
    totalCount: data?.total || 0,
    pageSize: data?.pageSize || 0,
    totalPages: data?.totalPages || 0,
  };
}
