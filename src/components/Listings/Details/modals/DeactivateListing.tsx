import Button from "@/components/shared/button";
import useListingsActions from "../hooks/useListingsActions";

type Props = { handleModal: (open: boolean) => void; id?: string };

const DeactivateListing = ({ handleModal, id }: Props) => {
  const { deactivateListing } = useListingsActions(handleModal,id);
  return (
    <div className="space-y-6 z-">
      <h6 className="text-base sm:text-xl 3xl:text-h6 !font-semibold text-grey-800">
        Sure you want to deactivate listing?
      </h6>
      <p className="text-xs sm:text-sm 3xl:text-base text-grey-500">
        Deactivating this vehicle will temporarily remove it from the active
        listings, making it unavailable for new bookings. However, all
        associated data, including booking history, revenue records, and
        customer reviews, will be preserved. You can reactivate the vehicle at
        any time to restore its availability. Are you sure you want to proceed
        with deactivation?
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          fullWidth
          variant="filled"
          color="primary"
          type="submit"
          onClick={() => handleModal(false)}
        >
          No, go back
        </Button>

        <Button
          fullWidth
          variant="filled"
          color="white"
          className="!bg-grey-90 !text-grey-700"
          loading={deactivateListing.isPending}
          disabled={deactivateListing.isPending}
          onClick={() => deactivateListing.mutate()}
        >
          Yes, deactivate
        </Button>
      </div>
    </div>
  );
};

export default DeactivateListing;
