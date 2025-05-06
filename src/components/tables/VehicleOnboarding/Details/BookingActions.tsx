import cn from "classnames";
import { Dispatch, forwardRef, ReactNode, SetStateAction } from "react";
import { BookingBadgeStatus } from "@/utils/types";
import Icons from "@/components/shared/icons";
import AcceptTrip from "@/components/BookingsAnalytics/Details/modals/AcceptTrip";
import DeclineTrip from "@/components/BookingsAnalytics/Details/modals/DeclineTrip";
import ReportTrip from "@/components/BookingsAnalytics/Details/modals/ReportTrip";

type BookingActionsProps = {
  bookingStatus: BookingBadgeStatus;

  openReportModal: boolean;
  handleReportModal: () => void;
  handleReportTrip: () => void;
  isLoadingReportTrip: boolean;
  setReport: Dispatch<SetStateAction<string>>;

  openAcceptModal: boolean;
  handleAcceptModal: () => void;
  handleAcceptTrip: () => void;
  isLoadingAcceptTrip: boolean;

  openDeclineModal: boolean;
  handleDeclineModal: () => void;
  handleDeclineTrip: () => void;
  isLoadingDeclineTrip: boolean;
};

const BookingActions = ({
  bookingStatus,

  openReportModal,
  handleReportModal,
  handleReportTrip,
  isLoadingReportTrip,
  setReport,

  handleAcceptTrip,
  openAcceptModal,
  handleAcceptModal,
  isLoadingAcceptTrip,

  openDeclineModal,
  handleDeclineModal,
  handleDeclineTrip,
  isLoadingDeclineTrip,
}: BookingActionsProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-1">
      <>
        <AcceptTrip
          trigger={
            <ActionButton
              color="bg-success-500 disabled:!text-success-500 disabled:!bg-success-50"
              text={
                bookingStatus === BookingBadgeStatus.APPROVED
                  ? "Accepted"
                  : "Accept"
              }
              icon={Icons.ic_done_circle}
              disabled={
                bookingStatus === BookingBadgeStatus.APPROVED ? true : false
              }
            />
          }
          handleAction={handleAcceptTrip}
          openModal={openAcceptModal}
          handleModal={handleAcceptModal}
          isLoading={isLoadingAcceptTrip}
        />

        <DeclineTrip
          trigger={
            <ActionButton
              color=" bg-error-900"
              text="Decline"
              icon={Icons.ic_cancel_circle}
              disabled={
                bookingStatus === BookingBadgeStatus.CANCELLED ? true : false
              }
            />
          }
          openModal={openDeclineModal}
          handleModal={handleDeclineModal}
          handleAction={handleDeclineTrip}
          isLoading={isLoadingDeclineTrip}
        />
      </>

      <ReportTrip
        trigger={
          <ActionButton
            color="bg-grey-700"
            text="Report"
            icon={Icons.ic_info}
          />
        }
        openModal={openReportModal}
        handleModal={handleReportModal}
        handleAction={handleReportTrip}
        isLoading={isLoadingReportTrip}
        setReport={setReport}
      />
    </div>
  );
};

type ActionButtonProps = {
  icon?: ReactNode;
  color: string;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
};

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ icon, color, text, onClick, disabled = false }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-4 py-2 text-white rounded-[33px] text-sm 3xl:text-base !font-semibold flex items-center gap-2 w-full lg:w-fit",
          color
        )}
        onClick={onClick}
        disabled={disabled}
      >
        {icon} <span>{text}</span>
      </button>
    );
  }
);
ActionButton.displayName = "ActionButton";

export default BookingActions;
