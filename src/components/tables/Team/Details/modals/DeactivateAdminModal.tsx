// src/components/tables/Team/Details/modals/DeactivateMember.tsx

"use client";
import React, { ReactNode } from "react";
import { BlurredDialog } from "@/components/shared/dialog";
import Button from "@/components/shared/button";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "@/components/shared/inputField";
import useDeactivateMember from "../../hooks/useDeactivateMember";
import { ImageAssets } from "@/utils/ImageAssets";

// Assuming you have a type for your full team member data
interface TeamMemberData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}

interface DeactivateMemberData {
  blockedReason: string;
}

type DeactivateMemberProps = {
  openModal: boolean;
  handleModal: (value: boolean) => void;
  trigger: ReactNode;
  member: TeamMemberData; // Now accepting the member object
};

const DeactivateMemberModal = ({
  trigger,
  openModal,
  handleModal,
  member,
}: DeactivateMemberProps) => {
  const { deactivateMember, isLoading, isSuccess } = useDeactivateMember();

  React.useEffect(() => {
    if (isSuccess) {
      handleModal(false);
    }
  }, [isSuccess, handleModal]);

  const handleSubmitFormik = React.useCallback(
    (values: DeactivateMemberData) => {
      deactivateMember({
        memberId: member.id, // Pass the member's ID
        blockedReason: values.blockedReason,
      });
    },
    [member, deactivateMember]
  );

  return (
    <BlurredDialog
      open={openModal}
      onOpenChange={handleModal}
      trigger={trigger}
      width="max-w-2xl"
      title="Deactivate Team Member"
      content={
        <DeactivateMemberContent
          handleModal={handleModal}
          onSubmit={handleSubmitFormik}
          isLoading={isLoading}
          isMutationSuccess={isSuccess}
          member={member} // Pass the member object to the content component
        />
      }
    />
  );
};

export default DeactivateMemberModal;

type DeactivateMemberContentProps = {
  handleModal: (value: boolean) => void;
  onSubmit: (data: DeactivateMemberData) => void;
  isLoading: boolean;
  isMutationSuccess?: boolean;
  member: TeamMemberData;
};

const DeactivateMemberContent = ({
  handleModal,
  onSubmit,
  isLoading,
  isMutationSuccess,
  member,
}: DeactivateMemberContentProps) => {
  const validationSchema = Yup.object({
    blockedReason: Yup.string().required("Reason is required"),
  });

  const formik = useFormik<DeactivateMemberData>({
    initialValues: {
      blockedReason: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    enableReinitialize: true,
  });

  React.useEffect(() => {
    if (isMutationSuccess) {
      formik.resetForm();
    }
  }, [isMutationSuccess, formik]);

  return (
    <div className="w-full max-w-xl">
      <div className="flex flex-col items-center justify-center space-y-4 mb-4">
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-orange-500">
          <Image
            src={member?.profileImage || ImageAssets.icons.user}
            alt={`${member.firstName} avatar`}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
            priority
            onError={(e) => {}} // Handle image loading errors
          />
        </div>
        <div className="text-center">
          <h3 className="font-semibold">{`${member.firstName} ${member.lastName}`}</h3>
          <p className="text-sm text-gray-500">{member.email}</p>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-2">
        <InputField
          name="blockedReason"
          id="blockedReason"
          label="Reason for Deactivation"
          placeholder="Enter reason for deactivating this member"
          value={formik.values.blockedReason}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.blockedReason && formik.errors.blockedReason
              ? formik.errors.blockedReason
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
            Deactivate Member
          </Button>
        </div>
      </form>
    </div>
  );
};