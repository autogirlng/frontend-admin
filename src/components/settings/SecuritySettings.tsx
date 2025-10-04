// SecuritySettingsWidget.tsx
import React, { useState } from "react";
import Button from "@/components/shared/button"; // Assuming you have a reusable Button component
import ChangePasswordModal from "./modal/ChangePassword";

const SecuritySettings = () => {
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  const handleOpenChangePasswordModal = (value: boolean) => {
    setIsChangePasswordModalOpen(value);
  };

  return (
    <div className="bg-grey-50 rounded-lg shadow-sm p-8">
      <h2 className="text-xl font-semibold text-grey-900 mb-6">
        Login & Security
      </h2>

      <div className="flex items-center justify-between py-4 border-b border-grey-200 last:border-b-0">
        <div className="text-grey-900 font-medium">Password</div>
        {/* We'll use your Button component for consistency and potential loading/disabled states */}
        <Button
          onClick={() => handleOpenChangePasswordModal(true)}
          className="px-4 py-2 bg-grey-500 text-grey-700 rounded-lg hover:bg-grey-500 focus:outline-none focus:ring-2 focus:ring-grey-300"
          type="button"
        >
          Change Password
        </Button>
      </div>

      {/* Integrate the ChangePasswordModal */}
      <ChangePasswordModal
        openModal={isChangePasswordModalOpen}
        handleModal={handleOpenChangePasswordModal}
        trigger={null} // We are controlling the modal's open state manually, so `trigger` is null here.
        // If your BlurredDialog component inherently uses `trigger` to open,
        // you might place the <Button> inside <ChangePasswordModal trigger={...}>
        // but for explicit state control, passing null is common.
      />
    </div>
  );
};

export default SecuritySettings;
