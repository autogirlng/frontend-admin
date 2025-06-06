// src/components/tables/Team/Details/modals/AddNewMember.tsx
"use client";
import React, { ReactNode } from "react";
import { BlurredDialog } from "@/components/shared/dialog";
import Button from "@/components/shared/button";
import SelectInput from "@/components/shared/select";
import Image from "next/image";
import { UserRole } from "@/utils/types";
import { useFormik } from "formik";
import * as Yup from "yup";
import Icons from "@/utils/Icon";
import useChangeRole from "../../hooks/useChangeRole";
import InputField from "@/components/shared/inputField";
import useDeactivateMember from "../../hooks/useDeactivateMember";

interface DeactivateMemberData {
  password: string;
}

type ChangeRolerProps = {
  openModal: boolean;
  handleModal: (value: boolean) => void;
  trigger: ReactNode;
};

const DeactivateMemberModal = ({
  trigger,
  openModal,
  handleModal,
}: ChangeRolerProps) => {
  const { deactivateMember, isLoading, isSuccess, isError } =
    useDeactivateMember();

  React.useEffect(() => {
    if (isSuccess) {
      handleModal(false); // Close modal on success
      // You might want to reset the form here
    }
  }, [isSuccess, handleModal]);

  const handleSubmitFormik = (values: DeactivateMemberData) => {
    const payload: DeactivateMemberData = {
      ...values,
      password: values.password,
    };
    deactivateMember({ password: payload.password });
  };

  return (
    <BlurredDialog
      open={openModal}
      onOpenChange={handleModal}
      trigger={trigger}
      width="max-w-2xl"
      title="Deactivate Admin "
      content={
        <DeactivateMemberContent
          handleModal={handleModal}
          // Pass the mutation function as onSubmit
          onSubmit={handleSubmitFormik}
          isLoading={isLoading} // Combine parent loading with mutation loading
          isMutationSuccess={isSuccess} // Pass success state to content if needed
        />
      }
    />
  );
};

export default DeactivateMemberModal;

type DeactivateMemberContentProps = {
  handleModal: (value: boolean) => void;
  onSubmit: (data: DeactivateMemberData) => void; // This is now the hook's mutation trigger
  isLoading: boolean;
  isMutationSuccess?: boolean; // Optional: to reset form when mutation succeeds
};

const DeactivateMemberContent = ({
  handleModal,
  onSubmit,
  isLoading,
  isMutationSuccess,
}: DeactivateMemberContentProps) => {
  const validationSchema = Yup.object({
    password: Yup.string().required("Password is required"), // Corresponds to userRole in payload
  });

  const formik = useFormik<DeactivateMemberData>({
    initialValues: {
      password: "",
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
    <div className="w-full max-w-xl">
      <form onSubmit={formik.handleSubmit} className="space-y-2">
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-orange-500">
          {/* Use the 'avatar' property from the member object.
                Provide a fallback if avatar is not present or invalid. */}
          <Image
            src={"/images/default-avatar.png"} // Use member.avatar, with a default fallback
            alt={` avatar`}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
            priority
            onError={(e) => {
              {
                Icons;
              }
            }}
          />
        </div>
        <InputField
          name="password"
          id="password"
          label="Password"
          placeholder="Enter Your Password "
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.password && formik.errors.password
              ? formik.errors.password
              : ""
          }
          required
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
            loading={isLoading}
            disabled={isLoading}
          >
            Change Role
          </Button>
        </div>
      </form>
    </div>
  );
};
