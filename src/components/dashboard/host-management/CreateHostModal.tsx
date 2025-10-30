// components/dashboard/hosts/CreateHostModal.tsx
"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import TextInput from "@/components/generic/ui/TextInput";
import { useCreateHost } from "@/lib/hooks/host-management/useCreateHost";

interface CreateHostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Basic email regex for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CreateHostModal({
  isOpen,
  onClose,
}: CreateHostModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createHost, isPending: isLoading } = useCreateHost();

  // Validate the form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName) newErrors.firstName = "First name is required.";
    if (!lastName) newErrors.lastName = "Last name is required.";
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle the confirmation (submit)
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    createHost(
      { firstName, lastName, email, phoneNumber },
      {
        onSuccess: (data) => {
          toast.success(`Host ${data.firstName} created successfully!`);
          onClose(); // Close the modal on success
        },
        onError: (error) => {
          // You can handle specific API errors here
          toast.error(error.message || "Failed to create host.");
        },
      }
    );
  };

  // We don't render anything if not open
  if (!isOpen) {
    return null;
  }

  return (
    <ActionModal
      title="Create New Host"
      message="Fill in the details below to create a new host account."
      actionLabel="Create Host"
      onClose={onClose}
      onConfirm={handleSubmit}
      isLoading={isLoading}
      variant="primary"
    >
      {/* Pass the form fields as children to the ActionModal.
        The ActionModal provides its own "Cancel" and "Create Host" buttons.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <TextInput
          id="firstName"
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={errors.firstName}
          disabled={isLoading}
        />
        <TextInput
          id="lastName"
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={errors.lastName}
          disabled={isLoading}
        />
        <TextInput
          id="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={isLoading}
          className="md:col-span-2"
        />
        <TextInput
          id="phoneNumber"
          label="Phone Number"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          error={errors.phoneNumber}
          disabled={isLoading}
          className="md:col-span-2"
        />
      </div>
    </ActionModal>
  );
}
