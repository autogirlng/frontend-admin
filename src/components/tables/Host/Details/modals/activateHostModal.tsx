// UnblockHostModal.tsx (New file for the unblock modal component)
"use client";

import React, { ReactNode } from "react";
import { BlurredDialog } from "@/components/shared/dialog";
import Button from "@/components/shared/button";
import { toast } from "react-toastify";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useHttp } from "@/utils/useHttp";
import { LocalRoute } from "@/utils/LocalRoutes";
import { ApiRoutes } from "@/utils/ApiRoutes";

interface UnblockUserPayload {
  userId: string;
}

export const useUnblockHost = () => {
  const queryClient = useQueryClient();
  const { put } = useHttp(); // Assuming unblock is a PUT request

  const unblockUserRequest = async (payload: UnblockUserPayload) => {
    const response = await put(
      `${ApiRoutes.unblockUser}/${payload.userId}/`
      // For unblocking, you typically don't need a reason in the payload.
      // If your API requires a specific payload for unblocking, add it here.
    );
    return response;
  };

  return useMutation({
    mutationFn: unblockUserRequest,
    onSuccess: () => {
      toast.success("Host unblocked successfully!");
      // Invalidate queries to refetch the updated status of hosts/users
      queryClient.invalidateQueries({ queryKey: ["hosts"] });
      queryClient.invalidateQueries({ queryKey: ["users"] }); // If applicable
    },
    onError: (error: any) => {
      console.error("Failed to unblock host via Tanstack Query:", error);
      toast.error(error.message || "Failed to unblock host.");
    },
  });
};

interface UnblockUserData {
  userId: string; // ID of the user to unblock
}

type UnblockHostModalProps = {
  openModal: boolean;
  handleModal: (value: boolean) => void;
  trigger: ReactNode;
  userId: string; // Pass the ID of the host to be unblocked
};

const UnblockHostModal = ({
  trigger,
  openModal,
  handleModal,
  userId,
}: UnblockHostModalProps) => {
  const {
    mutate: unblockUserMutation,
    isPending,
    isSuccess,
  } = useUnblockHost();

  React.useEffect(() => {
    if (isSuccess) {
      handleModal(false); // Close modal on success
    }
  }, [isSuccess, handleModal]);

  const handleUnblock = () => {
    const payload: UnblockUserData = {
      userId: userId,
    };
    unblockUserMutation(payload); // Call the unblock mutation
  };

  return (
    <BlurredDialog
      open={openModal}
      onOpenChange={handleModal}
      trigger={trigger}
      width="max-w-xl"
      title="Unblock This Host"
      content={
        <UnblockHostContent
          handleModal={handleModal}
          onConfirm={handleUnblock}
          isPending={isPending}
        />
      }
    />
  );
};

export default UnblockHostModal;

type UnblockHostContentProps = {
  handleModal: (value: boolean) => void;
  onConfirm: () => void; // Function to call when unblock is confirmed
  isPending: boolean;
};

const UnblockHostContent = ({
  handleModal,
  onConfirm,
  isPending,
}: UnblockHostContentProps) => {
  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Descriptive text */}
        <p className="text-sm text-grey-600">
          Are you sure you want to unblock this host? Unblocking will restore
          their access to the platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            fullWidth
            className="!bg-grey-100 !text-grey-700 hover:!bg-grey-200"
            onClick={() => handleModal(false)}
            type="button"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant="filled"
            color="primary"
            type="button" // Use type="button" since it's not part of a form
            loading={isPending}
            disabled={isPending}
            onClick={onConfirm}
          >
            Confirm Unblock
          </Button>
        </div>
      </div>
    </div>
  );
};
