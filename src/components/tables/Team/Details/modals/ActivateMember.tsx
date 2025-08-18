// src/components/tables/Team/Details/modals/ActivateMemberModal.tsx

"use client";
import React, { ReactNode } from "react";
import { BlurredDialog } from "@/components/shared/dialog";
import Button from "@/components/shared/button";
import useActivateMember from "../../hooks/useActivateMember";
import { Member } from "@/utils/types";

type ActivateMemberModalProps = {
  openModal: boolean;
  handleModal: (value: boolean) => void;
  trigger: ReactNode;
  member: Member;
};

const ActivateMemberModal = ({
  trigger,
  openModal,
  handleModal,
  member,
}: ActivateMemberModalProps) => {
  const { activateMember, isLoading, isSuccess } = useActivateMember();

  React.useEffect(() => {
    if (isSuccess) {
      handleModal(false); // Close modal on success
    }
  }, [isSuccess, handleModal]);

  const handleActivate = () => {
    activateMember({ memberId: member.id });
  };

  return (
    <BlurredDialog
      open={openModal}
      onOpenChange={handleModal}
      trigger={trigger}
      width="max-w-md"
      title="Activate Team Member"
      content={
        <div className="flex flex-col items-center p-4">
          <p className="text-center text-sm mb-4">
            Are you sure you want to activate <b className="capitalize">{member.firstName} {member.lastName}</b>?
          </p>
          <div className="flex w-full gap-4 pt-4">
            <Button
              fullWidth
              className="!bg-grey-100 !text-grey-700 hover:!bg-grey-200"
              onClick={() => handleModal(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="filled"
              color="primary"
              onClick={handleActivate}
              loading={isLoading}
              disabled={isLoading}
            >
              Yes, Activate
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default ActivateMemberModal;