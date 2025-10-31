// app/dashboard/profile/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  useGetMyProfile,
  useUpdateMyProfile,
  useUpdateProfilePicture,
} from "@/lib/hooks/profile/useProfile";
import { useDropzone } from "react-dropzone";
import { User, Mail, Phone, UploadCloud, AlertCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import CustomLoader from "@/components/generic/CustomLoader";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";
import CustomBack from "@/components/generic/CustomBack";

// A small helper component for the user avatar
const Avatar = ({ src, name }: { src?: string; name: string }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="h-24 w-24 rounded-full object-cover"
      />
    );
  }
  // Fallback to initials
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
      <span className="text-3xl font-semibold text-gray-600">{initials}</span>
    </div>
  );
};

export default function ProfilePage() {
  // --- Hooks ---
  const { data: profile, isLoading, isError } = useGetMyProfile();
  const updateProfileMutation = useUpdateMyProfile();
  const updatePictureMutation = useUpdateProfilePicture();

  // --- State ---
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [originalData, setOriginalData] = useState(formData);
  const [preview, setPreview] = useState<string | null>(null);

  // --- Effects ---
  // Populate form when profile data loads
  useEffect(() => {
    if (profile) {
      const data = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [profile]);

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
        // Set preview
        setPreview(URL.createObjectURL(file));
        // Trigger mutation
        updatePictureMutation.mutate(file, {
          onSuccess: () => setPreview(null), // Clear preview on success
          onError: () => setPreview(null), // Clear preview on error
        });
      }
    },
    [updatePictureMutation]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: false,
  });

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData, {
      onSuccess: () => {
        // Update original data to match new state
        setOriginalData(formData);
      },
    });
  };

  // --- Derived State ---
  const isFormChanged =
    JSON.stringify(formData) !== JSON.stringify(originalData);
  const isLoadingMutation =
    updateProfileMutation.isPending || updatePictureMutation.isPending;

  // --- Render ---
  if (isLoading) {
    return <CustomLoader />;
  }

  if (isError || !profile) {
    return (
      <main className="py-3 max-w-8xl mx-auto">
        <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-8 w-8" />
          <span className="font-semibold">Failed to load profile.</span>
        </div>
      </main>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto space-y-8">
        {/* --- Header --- */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-lg text-gray-600 mt-1">
            Manage your personal information and settings.
          </p>
        </div>

        {/* --- Profile Picture Card --- */}
        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Profile Picture
          </h3>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar
                src={preview || profile.profilePictureUrl}
                name={`${profile.firstName} ${profile.lastName}`}
              />
              {updatePictureMutation.isPending && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-full">
                  <CustomLoader />
                </div>
              )}
            </div>
            <div
              {...getRootProps()}
              className={`flex-1 border-2 border-dashed ${
                isDragActive ? "border-[#0096FF] bg-blue-50" : "border-gray-300"
              } rounded-lg p-8 text-center cursor-pointer transition-colors`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center text-gray-500">
                <UploadCloud className="h-10 w-10 mb-2" />
                {isDragActive ? (
                  <p className="font-semibold">Drop the image here...</p>
                ) : (
                  <p className="font-semibold">
                    Drag & drop an image, or click to select
                  </p>
                )}
                <p className="text-sm">PNG, JPG, or WEBP. Max 5MB.</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Profile Details Card --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Personal Details
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                id="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isLoadingMutation}
              />
              <TextInput
                id="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isLoadingMutation}
              />
            </div>
            <TextInput
              id="email"
              label="Email Address"
              value={profile.email}
              disabled // Email is not updatable
              readOnly
            />
            <TextInput
              id="phoneNumber"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={isLoadingMutation}
            />
          </div>
          <div className="flex justify-end pt-6 mt-6 border-t">
            <Button
              type="submit"
              variant="primary"
              isLoading={updateProfileMutation.isPending}
              disabled={!isFormChanged || isLoadingMutation}
            >
              Save Changes
            </Button>
          </div>
        </form>

        {/* --- Account Info Card --- */}
        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <p>
                User Type:{" "}
                <span className="font-semibold">{profile.userType}</span>
              </p>
            </div>
            {profile.referralCode && (
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                <p>
                  Referral Code:{" "}
                  <span className="font-semibold">{profile.referralCode}</span>
                </p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-500" />
              <p>
                Email Verified:{" "}
                <span className="font-semibold">
                  {profile.emailVerified ? "Yes" : "No"}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-gray-500" />
              <p>
                Phone Verified:{" "}
                <span className="font-semibold">
                  {profile.phoneVerified ? "Yes" : "No"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
