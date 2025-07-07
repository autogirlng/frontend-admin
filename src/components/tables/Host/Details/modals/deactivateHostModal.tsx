"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify"; // Assuming you use react-toastify for notifications

import React, { ReactNode } from "react";
import { BlurredDialog } from "@/components/shared/dialog"; // Ensure this path is correct
import Button from "@/components/shared/button"; // Ensure this path is correct
import InputField from "@/components/shared/inputField"; // Ensure this path is correct
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHttp } from "@/utils/useHttp";
import { LocalRoute } from "@/utils/LocalRoutes";

interface BlockUserPayload {
  userId: string;
  reason?: string; // Reason is optional
}

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  const { put } = useHttp(); // Destructure the post method from your http client

  const blockUserRequest = async (payload: BlockUserPayload) => {
    // Use the post method from your custom http client
    // Your useHttp.post already handles try/catch and error propagation
    const response = await put(
      `/user/deactivate/${payload.userId}`,
      {
        blockedReason: payload.reason,
      }
    );
    return response;
  };

  return useMutation({
    mutationFn: blockUserRequest,
    onSuccess: () => {
      toast.success("User blocked successfully!");
      queryClient.invalidateQueries({ queryKey: ["hosts"] });
      queryClient.invalidateQueries({ queryKey: ["users"] }); // If you have a general users list
    },
    onError: (error: any) => {
      console.error("Failed to block user via Tanstack Query:", error);
      toast.error(error.message || "Failed to block user.");
    },
  });
};
interface BlockUserData {
  userId: string; // ID of the user to block
  reason: string; // Reason for blocking, will be optional
}

type BlockUserModalProps = {
  openModal: boolean;
  handleModal: (value: boolean) => void;
  trigger: ReactNode;
  userId: string; // Pass the ID of the user to be blocked
};

const BlockUserModal = ({
  trigger,
  openModal,
  handleModal,
  userId,
}: BlockUserModalProps) => {
  const {
    mutate: blockUserMutation,
    isPending,
    isSuccess,
    isError,
  } = useBlockUser();

  React.useEffect(() => {
    if (isSuccess) {
      handleModal(false); // Close modal on success
    }
  }, [isSuccess, handleModal]);

  const handleSubmitFormik = (values: { reason: string }) => {
    const payload: BlockUserData = {
      userId: userId,
      reason: values.reason,
    };
    blockUserMutation(payload); // Call the mutation
  };

  return (
    <BlurredDialog
      open={openModal}
      onOpenChange={handleModal}
      trigger={trigger}
      width="max-w-xl" // Adjusted width to match image
      title="Block This User"
      content={
        <div className="bg-grey-50 rounded-2xl p-8">
          <BlockUserContent
            handleModal={handleModal}
            onSubmit={handleSubmitFormik}
            isPending={isPending} // Pass isPending down to content
            isMutationSuccess={isSuccess}
          />
        </div>
      }
    />
  );
};

export default BlockUserModal;

type BlockUserContentProps = {
  handleModal: (value: boolean) => void;
  onSubmit: (data: { reason: string }) => void; // Expects only reason from the form
  isPending: boolean; // Corrected from isLoading to isPending
  isMutationSuccess?: boolean;
};

const BlockUserContent = ({
  handleModal,
  onSubmit,
  isPending, // Corrected from isLoading to isPending
  isMutationSuccess,
}: BlockUserContentProps) => {
  const validationSchema = Yup.object({
    reason: Yup.string().optional(), // Reason is optional
  });

  const formik = useFormik<{ reason: string }>({
    initialValues: {
      reason: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  // Reset form when mutation is successful
  React.useEffect(() => {
    if (isMutationSuccess) {
      formik.resetForm();
    }
  }, [isMutationSuccess, formik]);

  return (
    <div className="w-full">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Descriptive text */}
        <p className="text-sm text-grey-600">
          Blocking this user will restrict them from accessing or interacting
          with the platform. You can unblock them later if needed.
        </p>

        {/* Reason for Blocking (optional) - using InputField for textarea behavior */}
        <InputField
          name="reason"
          id="reason"
          label="Reason for Blocking (optional)"
          placeholder="Type your reasons for blocking this user..."
          value={formik.values.reason}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.reason && formik.errors.reason
              ? formik.errors.reason
              : ""
          }
          as="textarea" // Make it a textarea
          rows={4} // Adjust rows for textarea height
        />

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
            type="submit"
            loading={isPending} // Use isPending for loading state
            disabled={isPending} // Use isPending to disable button
          >
            Confirm Block
          </Button>
        </div>
      </form>
    </div>
  );
};
