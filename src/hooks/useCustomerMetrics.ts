import { useQuery } from "@tanstack/react-query";
import { useHttp } from "@/utils/useHttp";

export interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  blockedCustomers: number;
  onboardingDistribution: {
    selfOnboarded: number;
    adminOnboarded: number;
  };
  previewCustomers: {
    data: Array<{
      id: string;
      firstName: string;
      lastName: string;
      businessName: string | null;
      phoneNumber: string;
      vehicles: number;
      totalBookings: number;
      totalRides: number;
      lastLogin: string | null;
      lastBooked: string | null;
      location: string | null;
      status: string;
    }>;
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export default function useCustomerMetrics() {
  const http = useHttp();
  return useQuery<CustomerMetrics | null>({
    queryKey: ["customer-metrics"],
    queryFn: async () => {
      const metrics = await http.get<CustomerMetrics>(
        "/admin/customer/metrics"
      );
      return metrics ?? null;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
} 