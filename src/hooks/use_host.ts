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

  const mapFormValuesToApiPayload = (values: HostOnboardingFormValues) => {
    // Base payload structure matching your API requirements
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      countryCode: values.countryCode,
      country: values.country,
      email: values.email,
      userRole: "HOST" as const,
      cities: values.outskirtsLocation, // Array of selected cities
      onBoardedBy: values.onboardedBy,
    };

    // Add business fields only if operating as business
    if (values.isOperatingAsBusiness) {
      return {
        ...payload,
        isBusiness: true,
        businessName: values.businessName,
        businessAddress: values.businessAddress,
        businessPhoneNumber: values.businessNumber,
        businessEmail: values.businessEmail,
      };
    }

    return {
      ...payload,
      isBusiness: false,
    };
  };

  const hostMutation = useMutation<
    HostInformation,
    AxiosError<ErrorResponse>,
    HostOnboardingFormValues
  >({
    mutationFn: async (values) => {
      const apiPayload = mapFormValuesToApiPayload(values);

      // Handle file upload using FormData if 'mou' is a File
      if (values.mou instanceof File) {
        const formData = new FormData();

        // Add all payload fields to FormData
        Object.entries(apiPayload).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            // Handle arrays (cities)
            value.forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else if (typeof value === "boolean") {
            formData.append(key, value.toString());
          } else if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });

        // Add the MOU file
        formData.append("mouDocument", values.mou);

        const response = await http.post<HostInformation>(
          ApiRoutes.hostOnboarding,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response!;
      } else {
        // JSON format without file
        const response = await http.post<HostInformation>(
          ApiRoutes.hostOnboarding,
          apiPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response!;
      }
    },
    onSuccess: (data) => {
      // console.log("Host Onboarding successful:", data);
      toast.success("Host onboarded successfully!");
      // router.push(LocalRoute.hostSuccessfulOnboarding);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.message || "Host onboarding failed");
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
