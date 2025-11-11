// app/dashboard/settings/staffs/CreateAdminModal.tsx
"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { useCreateAdmin } from "@/lib/hooks/settings/useAdmins";
import TextInput from "@/components/generic/ui/TextInput";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import Button from "@/components/generic/ui/Button";

interface CreateAdminModalProps {
  onClose: () => void;
}

// Basic email regex for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CreateAdminModal({ onClose }: CreateAdminModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sendCredentialTo, setSendCredentialTo] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createAdmin, isPending } = useCreateAdmin();

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

    // Validate email list
    const emails = sendCredentialTo
      .split(/[\n,]+/) // Split by newline or comma
      .map((e) => e.trim())
      .filter((e) => e); // Remove empty strings

    if (emails.length > 0) {
      for (const email of emails) {
        if (!emailRegex.test(email)) {
          newErrors.sendCredentialTo = `Invalid email found: ${email}`;
          break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const emails = sendCredentialTo
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter((e) => e);

    createAdmin(
      { firstName, lastName, email, phoneNumber, sendCredentialTo: emails },
      {
        onSuccess: onClose,
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={isPending}
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-4">
          Create New Admin
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            id="firstName"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={errors.firstName}
            disabled={isPending}
          />
          <TextInput
            id="lastName"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={errors.lastName}
            disabled={isPending}
          />
          <TextInput
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            disabled={isPending}
            className="md:col-span-2"
          />
          <TextInput
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            error={errors.phoneNumber}
            disabled={isPending}
            className="md:col-span-2"
          />
          <TextAreaInput
            id="sendCredentialTo"
            label="Send Credentials To (Optional)"
            placeholder="Enter comma or new-line separated emails..."
            value={sendCredentialTo}
            onChange={(e) => setSendCredentialTo(e.target.value)}
            error={errors.sendCredentialTo}
            disabled={isPending}
            className="md:col-span-2"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            isLoading={isPending}
            className="w-auto"
          >
            Create Admin
          </Button>
        </div>
      </div>
    </div>
  );
}
