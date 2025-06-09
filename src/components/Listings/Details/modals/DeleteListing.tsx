import Button from "@/components/shared/button";
import useListingsActions from "../hooks/useListingsActions";

type Props = {
  handleModal: (open: boolean) => void;
  id?: string;
  isDraft?: boolean;
};

const DeleteListing = ({ handleModal, id, isDraft }: Props) => {
  const { deleteListing, moveListingToDraft } = useListingsActions(
    handleModal,
    id
  );
  return (
    <div className="space-y-6">
      <h6 className="text-base sm:text-xl 3xl:text-h6 !font-semibold text-grey-800">
        Are you sure you want to delete this vehicle?
      </h6>
      <p className="text-xs sm:text-sm 3xl:text-base text-grey-500">
        Deleting this vehicle will result in the loss of all associated data,
        including booking history, revenue records, and customer reviews. This
        action is irreversible and cannot be undone. Are you sure you want to
        proceed?
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
        {!isDraft && (
          <Button
            fullWidth
            variant="filled"
            color="white"
            type="submit"
            className="!bg-grey-90 !text-grey-700"
            loading={moveListingToDraft.isPending}
            disabled={moveListingToDraft.isPending}
            onClick={() => moveListingToDraft.mutate()}
          >
            Move to draft instead
          </Button>
        )}
        <Button
          fullWidth
          variant="filled"
          color="white"
          type="submit"
          className="!bg-grey-90 !text-grey-700"
          loading={deleteListing.isPending}
          disabled={deleteListing.isPending}
          onClick={() => deleteListing.mutate()}
        >
          Yes, delete
        </Button>
      </div>
    </div>
  );
};

export default DeleteListing;
