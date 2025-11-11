// app/dashboard/drivers-management/EditDriverModal.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  useGetDriverDetails,
  useUpdateDriver,
  useUpdateDriverProfilePicture,
} from "@/lib/hooks/drivers-management/useDrivers";
import { DriverDetail, UpdateDriverPayload } from "./types";
import { X, AlertCircle, Camera, User } from "lucide-react"; // ✅ Import User icon
import { toast } from "react-hot-toast";
import CustomLoader from "@/components/generic/CustomLoader";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";

// --- Reusable Avatar Component (UPDATED) ---
const Avatar = ({
  src,
  name,
  isLoading = false,
  getRootProps,
  getInputProps,
}: {
  src?: string;
  name?: string | null; // ✅ Allow name to be optional
  isLoading?: boolean;
  getRootProps: () => any;
  getInputProps: () => any;
}) => {
  // ✅ FIX: Provide a fallback for initials
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "?";

  return (
    <div
      {...getRootProps()}
      className="relative h-24 w-24 rounded-full cursor-pointer group flex-shrink-0"
    >
      <input {...getInputProps()} />
      {src ? (
        <img
          src={src}
          alt={name || "Driver"}
          className="h-24 w-24 rounded-full object-cover transition-all"
        />
      ) : (
        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
          {/* ✅ Use a fallback icon if no initials */}
          {initials === "?" ? (
            <User className="h-10 w-10 text-gray-500" />
          ) : (
            <span className="text-3xl font-semibold text-gray-600">
              {initials}
            </span>
          )}
        </div>
      )}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-full">
          <CustomLoader />
        </div>
      )}
      {!isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="h-6 w-6 text-white" />
        </div>
      )}
    </div>
  );
};

// --- Main Modal Component ---
interface EditDriverModalProps {
  driverId: string;
  onClose: () => void;
}

export function EditDriverModal({ driverId, onClose }: EditDriverModalProps) {
  const [formData, setFormData] = useState<UpdateDriverPayload>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    driverIdentifier: "",
  });
  const [preview, setPreview] = useState<string | null>(null);

  // --- API Hooks ---
  const {
    data: driver,
    isLoading: isLoadingDetails,
    isError,
  } = useGetDriverDetails(driverId);
  const updatePictureMutation = useUpdateDriverProfilePicture();
  const updateDriverMutation = useUpdateDriver();

  // --- Effects ---
  // Populate form when driver data loads
  useEffect(() => {
    if (driver) {
      // Split fullName if firstName/lastName aren't provided
      const [firstName, ...lastNameParts] = (driver.fullName || "").split(" ");
      setFormData({
        firstName: driver.firstName || firstName || "",
        lastName: driver.lastName || lastNameParts.join(" ") || "",
        phoneNumber: driver.phoneNumber,
        driverIdentifier: driver.driverIdentifier,
      });
    }
  }, [driver]);

  // Clean up blob URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // --- Dropzone ---
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        updatePictureMutation.mutate(
          { driverId, file },
          {
            onSuccess: () => setPreview(null),
            onError: () => setPreview(null),
          }
        );
      }
    },
    [driverId, updatePictureMutation]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: false,
    noDrag: true, // Only click
  });

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverId) return;

    updateDriverMutation.mutate(
      { driverId, payload: formData },
      {
        onSuccess: onClose,
      }
    );
  };

  const isLoading =
    isLoadingDetails ||
    updatePictureMutation.isPending ||
    updateDriverMutation.isPending;

  // --- Render ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold leading-6 text-gray-900">
            Edit Driver
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {isLoadingDetails && (
          <div className="p-10">
            <CustomLoader />
          </div>
        )}
        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">
              Failed to load driver details.
            </span>
          </div>
        )}
        {driver && (
          <div className="p-6 space-y-4">
            {/* Profile Picture Section */}
            <div className="flex items-center gap-6">
              <Avatar
                src={preview || driver.profilePictureUrl}
                name={driver.fullName}
                isLoading={updatePictureMutation.isPending}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
              />
              <div>
                <h4 className="font-semibold text-gray-800">Profile Picture</h4>
                <p className="text-sm text-gray-500">
                  Click the image to upload a new one.
                </p>
              </div>
            </div>

            <hr />

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                id="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
              <TextInput
                id="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            <TextInput
              id="driverIdentifier"
              label="Driver Identifier"
              value={formData.driverIdentifier}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            <TextInput
              id="phoneNumber"
              label="Phone Number"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
