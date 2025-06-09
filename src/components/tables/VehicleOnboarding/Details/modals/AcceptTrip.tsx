import Button from "@/components/shared/button";
import { BlurredDialog } from "@/components/shared/dialog";
import { ReactNode } from "react";

type AcceptTripProps = {
  handleAction: () => void;
  openModal: boolean;
  handleModal: (value?: boolean) => void;
  trigger: ReactNode;
  isLoading: boolean;
};

const AcceptTrip = ({
  trigger,
  handleAction,
  openModal,
  handleModal,
  isLoading,
}: AcceptTripProps) => {
  return (
    <BlurredDialog
      open={openModal}
      onOpenChange={handleModal}
      trigger={trigger}
      content={
        <PopupContent
          handleAction={handleAction}
          handleModal={handleModal}
          isLoading={isLoading}
        />
      }
    />
  );
};

export default AcceptTrip;

type PopupContentProps = {
  handleAction: () => void;
  // openModal: boolean;
  handleModal: (value?: boolean) => void;
  isLoading: boolean;
};

const PopupContent = ({
  handleAction,
  handleModal,
  isLoading,
}: PopupContentProps) => {
  return (
    <div className="space-y-6">
      <h6 className="text-base sm:text-xl 3xl:text-h6 !font-semibold text-grey-800">
        Accept Trip
      </h6>
      <p className="text-xs sm:text-sm 3xl:text-base text-grey-500">
        Are you sure you want to accept this trip?
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
          loading={isLoading}
          disabled={isLoading}
          onClick={handleAction}
        >
          Yes, Accept
        </Button>
      </div>
    </div>
  );
};
