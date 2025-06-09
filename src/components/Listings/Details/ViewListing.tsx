import ViewAsCustomer from "@/components/VehicleOnboarding/VehicleSummary/ViewAsCustomer";
import useGetCustomerView from "@/components/Listings/Details/hooks/useGetCustomerView";
import { FullPageSpinner } from "@/components/shared/spinner";

type Props = { id: string };

export default function ViewListing({ id }: Props) {
  const { vehicle, isError, isLoading } = useGetCustomerView({ id });
  return isLoading ? (
    <FullPageSpinner />
  ) : isError ? (
    <p>Something went wrong</p>
  ) : (
    <ViewAsCustomer vehicle={vehicle ?? null} />
  );
}
