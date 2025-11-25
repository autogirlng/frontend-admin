"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  useGetMyProfile,
  useUpdateMyProfile,
  useUpdateProfilePicture,
  useChangePassword,
  useUpdateBirthday,
} from "@/lib/hooks/profile/useProfile";
import { useDropzone } from "react-dropzone";
import {
  User,
  Mail,
  Phone,
  AlertCircle,
  Camera,
  Eye,
  EyeOff,
  Lock,
  Calendar,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import CustomLoader from "@/components/generic/CustomLoader";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";
import CustomBack from "@/components/generic/CustomBack";

import { ModernDatePicker } from "@/components/generic/ui/ModernDatePicker";

const Avatar = ({
  src,
  name,
  isLoading = false,
  getRootProps,
  getInputProps,
}: {
  src?: string;
  name: string;
  isLoading?: boolean;
  getRootProps: () => any;
  getInputProps: () => any;
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div
      {...getRootProps()}
      className="relative h-24 w-24 rounded-full cursor-pointer group flex-shrink-0"
    >
      <input {...getInputProps()} />
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-24 w-24 rounded-full object-cover transition-all"
        />
      ) : (
        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-3xl font-semibold text-gray-600">
            {initials}
          </span>
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

const ChangePasswordCard = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPass, setShowPass] = useState(false);

  const changePasswordMutation = useChangePassword();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.id]: e.target.value });
    if (errors[e.target.id]) {
      setErrors((prev) => ({ ...prev, [e.target.id]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!passwords.oldPassword) {
      setErrors((prev) => ({
        ...prev,
        oldPassword: "Old password is required.",
      }));
      return;
    }
    if (passwords.newPassword.length < 8) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "Must be at least 8 characters.",
      }));
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      return;
    }

    changePasswordMutation.mutate(
      {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      },
      {
        onSuccess: () => {
          setPasswords({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Change Password</h3>
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="text-sm text-gray-500 hover:text-[#0096FF] flex items-center gap-1"
        >
          {showPass ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          {showPass ? "Hide" : "Show"}
        </button>
      </div>

      <div className="space-y-4">
        <TextInput
          id="oldPassword"
          label="Old Password"
          type={showPass ? "text" : "password"}
          value={passwords.oldPassword}
          onChange={handleChange}
          error={errors.oldPassword}
          disabled={changePasswordMutation.isPending}
        />
        <TextInput
          id="newPassword"
          label="New Password"
          type={showPass ? "text" : "password"}
          value={passwords.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          disabled={changePasswordMutation.isPending}
        />
        <TextInput
          id="confirmPassword"
          label="Confirm New Password"
          type={showPass ? "text" : "password"}
          value={passwords.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={changePasswordMutation.isPending}
        />
      </div>
      <div className="flex justify-end pt-6 mt-6 border-t">
        <Button
          type="submit"
          variant="primary"
          isLoading={changePasswordMutation.isPending}
          disabled={
            !passwords.oldPassword ||
            !passwords.newPassword ||
            !passwords.confirmPassword
          }
          className="w-auto px-4"
        >
          <Lock className="h-4 w-4 mr-2" />
          Update Password
        </Button>
      </div>
    </form>
  );
};

export default function ProfilePage() {
  const { data: profile, isLoading, isError } = useGetMyProfile();
  const updateProfileMutation = useUpdateMyProfile();
  const updatePictureMutation = useUpdateProfilePicture();
  const updateBirthdayMutation = useUpdateBirthday();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    birthday: "",
  });
  const [originalData, setOriginalData] = useState(formData);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      const data = {
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phoneNumber: profile.phoneNumber || "",
        birthday: profile.birthday || "",
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [profile]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        updatePictureMutation.mutate(file, {
          onSuccess: () => setPreview(null),
          onError: () => setPreview(null),
        });
      }
    },
    [updatePictureMutation]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: false,
    noDrag: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const basicProfileChanged =
      formData.firstName !== originalData.firstName ||
      formData.lastName !== originalData.lastName ||
      formData.phoneNumber !== originalData.phoneNumber;

    const birthdayChanged = formData.birthday !== originalData.birthday;

    const promises = [];

    if (basicProfileChanged) {
      promises.push(
        updateProfileMutation.mutateAsync({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
        })
      );
    }

    if (birthdayChanged && formData.birthday) {
      promises.push(
        updateBirthdayMutation.mutateAsync({
          birthday: formData.birthday,
        })
      );
    }

    try {
      await Promise.all(promises);
      setOriginalData(formData);

      if (birthdayChanged && !basicProfileChanged) {
        toast.success("Birthday updated successfully.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isFormChanged =
    JSON.stringify(formData) !== JSON.stringify(originalData);
  const isLoadingMutation =
    updateProfileMutation.isPending ||
    updatePictureMutation.isPending ||
    updateBirthdayMutation.isPending;

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-lg text-gray-600 mt-1">
            Manage your personal information and settings.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Personal Details
              </h3>
              <p className="text-sm text-gray-500">
                Update your information here.
              </p>
            </div>

            <Avatar
              src={preview || profile.profilePictureUrl}
              name={`${profile.firstName} ${profile.lastName}`}
              isLoading={updatePictureMutation.isPending}
              getRootProps={getRootProps}
              getInputProps={getInputProps}
            />
          </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                id="email"
                label="Email Address"
                value={profile.email}
                disabled
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModernDatePicker
                label="Birthday"
                value={formData.birthday}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, birthday: val }))
                }
                maxDate={new Date().toISOString().split("T")[0]}
                disabled={isLoadingMutation}
              />
              <div className="hidden md:block"></div>
            </div>
          </div>
          <div className="flex justify-end pt-6 mt-6 border-t">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoadingMutation}
              disabled={!isFormChanged || isLoadingMutation}
              className="w-auto px-4"
            >
              Save Changes
            </Button>
          </div>
        </form>

        <ChangePasswordCard />

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
            {profile.birthday && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <p>
                  Birthday:{" "}
                  <span className="font-semibold">{profile.birthday}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
