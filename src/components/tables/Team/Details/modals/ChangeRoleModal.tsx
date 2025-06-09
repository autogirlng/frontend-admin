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

interface ChangeRoleData {
  userRole: UserRole; // Ensure this matches userRole in payload
}

type ChangeRolerProps = {
  openModal: boolean;
  handleModal: (value: boolean) => void;
  trigger: ReactNode;
};

const ChangeRole = ({ trigger, openModal, handleModal }: ChangeRolerProps) => {
  const { changeRole, isLoading, isSuccess, isError } = useChangeRole();

  React.useEffect(() => {
    if (isSuccess) {
      handleModal(false);
    }
  }, [isSuccess, handleModal]);

  const handleSubmitFormik = (values: ChangeRoleData) => {
    const payload: ChangeRoleData = {
      ...values,
      userRole: values.userRole,
    };
    changeRole({ role: payload.userRole });
  };

  return (
    <BlurredDialog
      open={openModal}
      onOpenChange={handleModal}
      trigger={trigger}
      width="max-w-2xl"
      title="Update Admin Role"
      content={
        <ChangeRoleContent
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

export default ChangeRole;

type ChangeRoleContentProps = {
  handleModal: (value: boolean) => void;
  onSubmit: (data: ChangeRoleData) => void; // This is now the hook's mutation trigger
  isLoading: boolean;
  isMutationSuccess?: boolean; // Optional: to reset form when mutation succeeds
};

// Define role options for the SelectInput
const roleOptions = [
  { value: UserRole.Admin, option: "Admin" },
  { value: UserRole.CustomerSupport, option: "Customer Support" },
  { value: UserRole.FinanceManager, option: "Finance Manager" },
  { value: UserRole.OperationManager, option: "Operation Manager" },
  { value: UserRole.SuperAdmin, option: "Super Admin" },
];

const ChangeRoleContent = ({
  handleModal,
  onSubmit,
  isLoading,
  isMutationSuccess,
}: ChangeRoleContentProps) => {
  const validationSchema = Yup.object({
    role: Yup.string().required("Role is required"), // Corresponds to userRole in payload
  });

  const formik = useFormik<ChangeRoleData>({
    initialValues: {
      userRole: UserRole.CustomerSupport,
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
        <SelectInput
          id="userRole"
          label="Role"
          placeholder="Select role"
          options={roleOptions}
          value={formik.values.userRole}
          onChange={(value) => {
            formik.setFieldTouched("userRole", true);
            formik.setFieldValue("userRole", value);
          }}
          error={
            formik.touched.userRole && formik.errors.userRole
              ? formik.errors.userRole
              : ""
          }
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
