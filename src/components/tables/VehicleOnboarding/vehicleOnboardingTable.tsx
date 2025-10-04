import Pagination from "@/components/shared/pagination";
import { FullPageSpinner } from "@/components/shared/spinner";
import { useState } from "react";
import useVehicleOnboardingTable from "./hooks/useVehicleOnboardingTable";
import { useVehicleOnboardingActions } from "./hooks/useVehicleOnboardingActions";
import OnboardedAnalyticsTable from "./Table";
import ApproveVehicleModal from "./modals/ApproveVehicleModal";
import RejectVehicleModal from "./modals/RejectVehicleModal";
import RequestUpdateModal from "./modals/RequestUpdateModal";
import MobileActionModal from "./modals/MobileActionModal";

type Props = { search?: string; filters?: Record<string, string[]> };

export default function VehicleOnboardingTable({ search, filters }: Props) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, totalCount, isError, pageSize, totalPages, isLoading } =
    useVehicleOnboardingTable({
      currentPage: currentPage,
      pageLimit: 10,
      search: search,
      filters: filters,
    });

  const {
    modalStates,
    loadingStates,
    handleApprove,
    handleReject,
    handleRequestUpdate,
    approveVehicle,
    rejectVehicle,
    requestUpdate,
    closeApproveModal,
    closeRejectModal,
    closeRequestUpdateModal,
  } = useVehicleOnboardingActions();

  console.log("VehicleOnboardingTable data", data);

  return (
    <div>
      {isLoading ? (
        <FullPageSpinner />
      ) : isError ? (
        <p>something went wrong</p>
      ) : (
        <OnboardedAnalyticsTable
          items={data}
          emptyStateTitle="No Onboared Vehicles "
          emptyStateMessage="Your Onboarded Vehicles Will Appear Here"
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestUpdate={handleRequestUpdate}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageLimit={pageSize}
        totalPage={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Desktop Modals */}
      <ApproveVehicleModal
        isOpen={modalStates.approveModal}
        onClose={closeApproveModal}
        vehicle={modalStates.selectedVehicle}
        onApprove={approveVehicle}
        isLoading={loadingStates.isApproving}
      />

      <RejectVehicleModal
        isOpen={modalStates.rejectModal}
        onClose={closeRejectModal}
        vehicle={modalStates.selectedVehicle}
        onReject={rejectVehicle}
        isLoading={loadingStates.isRejecting}
      />

      <RequestUpdateModal
        isOpen={modalStates.requestUpdateModal}
        onClose={closeRequestUpdateModal}
        vehicle={modalStates.selectedVehicle}
        onRequestUpdate={requestUpdate}
        isLoading={loadingStates.isRequestingUpdate}
      />

      {/* Mobile Modal - Handles all actions */}
      <MobileActionModal
        isOpen={modalStates.approveModal || modalStates.rejectModal || modalStates.requestUpdateModal}
        onClose={() => {
          closeApproveModal();
          closeRejectModal();
          closeRequestUpdateModal();
        }}
        vehicle={modalStates.selectedVehicle}
        actionType={
          modalStates.approveModal ? 'approve' :
          modalStates.rejectModal ? 'reject' :
          modalStates.requestUpdateModal ? 'requestUpdate' : null
        }
        onApprove={approveVehicle}
        onReject={rejectVehicle}
        onRequestUpdate={requestUpdate}
        isLoading={loadingStates.isApproving || loadingStates.isRejecting || loadingStates.isRequestingUpdate}
      />
    </div>
  );
}
