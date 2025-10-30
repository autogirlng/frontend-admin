"use client";

import React, { useState } from "react";
import { useCreateDriver } from "@/lib/hooks/drivers-management/useDrivers";
import { DriverPayload } from "./types";
import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import { X } from "lucide-react";

interface CreateDriverModalProps {
  onClose: () => void;
}

export function CreateDriverModal({ onClose }: CreateDriverModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [driverIdentifier, setDriverIdentifier] = useState("");

  const createDriverMutation = useCreateDriver();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: DriverPayload = {
      firstName,
      lastName,
      phoneNumber,
      driverIdentifier,
    };
    createDriverMutation.mutate(payload, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={createDriverMutation.isPending}
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Create New Driver</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="First Name"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <TextInput
            label="Last Name"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <TextInput
            label="Phone Number"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder="+1234567890"
          />
          <TextInput
            label="Driver Identifier"
            id="driverIdentifier"
            value={driverIdentifier}
            onChange={(e) => setDriverIdentifier(e.target.value)}
            required
            placeholder="e.g., DRV-001"
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={createDriverMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createDriverMutation.isPending}
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
