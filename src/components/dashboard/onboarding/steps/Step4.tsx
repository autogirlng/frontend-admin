// app/components/steps/Step3.tsx
"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Stepper from "@/components/generic/Stepper";
import TipsSidebar from "@/components/generic/TipsSidebar";
import Button from "@/components/generic/ui/Button";
import ImageDropzone from "@/components/generic/ui/ImageDropzone";
import { useVehiclePhotos } from "@/lib/hooks/onboarding/steps/useVehicleStep3";
import { Loader2, X, Check, Star, Camera, UploadCloud } from "lucide-react"; // Added Camera, UploadCloud
import clsx from "clsx";
import Link from "next/link";
import CustomLoader from "@/components/generic/CustomLoader";

const currentStep = 4;
const REQUIRED_PHOTO_COUNT = 6; // Define the requirement as a constant

// --- PhotoPreviewCard Component (No changes needed, it's good) ---
const PhotoPreviewCard: React.FC<{
  previewUrl: string;
  publicId: string | undefined;
  isPrimary: boolean;
  isUploading: boolean;
  onRemove: () => void;
  onSetPrimary: () => void;
}> = ({
  previewUrl,
  publicId,
  isPrimary,
  isUploading,
  onRemove,
  onSetPrimary,
}) => {
  return (
    <div className="relative aspect-video w-full overflow-hidden shadow-md group">
      <img
        src={previewUrl}
        alt="Vehicle preview"
        className="w-full h-full object-cover"
      />

      {/* Overlay for actions */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        {/* Only show actions if upload is complete */}
        {publicId && !isUploading && (
          <>
            <button
              type="button"
              title="Set as primary"
              disabled={isPrimary}
              onClick={onSetPrimary}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Star
                className={clsx(isPrimary && "fill-yellow-400 text-yellow-400")}
              />
            </button>
            <button
              type="button"
              title="Remove photo"
              onClick={onRemove}
              className="p-2 rounded-full bg-red-500/50 text-white hover:bg-red-500/80"
            >
              <X />
            </button>
          </>
        )}
      </div>

      {/* Status Indicator */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {isPrimary && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">
          PRIMARY
        </div>
      )}
    </div>
  );
};

// --- [NEW] Empty Placeholder Slot ---
// This component shows the empty states in the grid.
const EmptySlotPlaceholder: React.FC = () => {
  return (
    <div className="relative aspect-video w-full border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center">
      <Camera className="w-8 h-8 text-gray-400" />
      <span className="mt-1 text-sm text-gray-500">Empty Slot</span>
    </div>
  );
};

// --- [NEW] Photo Progress Tracker ---
// This component visually tracks the 6-photo requirement.
const PhotoProgressTracker: React.FC<{
  photos: ReturnType<typeof useVehiclePhotos>["photos"];
  primaryPhotoId: string | null;
  onRemove: (publicId: string) => void;
  onSetPrimary: (publicId: string) => void;
}> = ({ photos, primaryPhotoId, onRemove, onSetPrimary }) => {
  const filledSlots = photos.map((photo) => (
    <PhotoPreviewCard
      key={photo.preview} // Use preview as key before publicId exists
      previewUrl={photo.preview}
      publicId={photo.publicId}
      isUploading={photo.isUploading}
      isPrimary={photo.publicId === primaryPhotoId && !!photo.publicId}
      onRemove={() => onRemove(photo.publicId!)}
      onSetPrimary={() => onSetPrimary(photo.publicId!)}
    />
  ));

  const emptySlotsCount = REQUIRED_PHOTO_COUNT - photos.length;
  const emptySlots = Array.from({ length: emptySlotsCount }, (_, i) => (
    <EmptySlotPlaceholder key={`empty-${i}`} />
  ));

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {filledSlots}
      {emptySlots}
    </div>
  );
};

// --- [MODIFIED] Child Form Component ---
function PhotoUploadForm({ vehicleId }: { vehicleId: string }) {
  const {
    photos,
    primaryPhotoId,
    isLoading,
    isLoadingSession,
    isSubmitting,
    onFilesDrop,
    onRemovePhoto,
    onSetPrimary,
    handleSubmit,
  } = useVehiclePhotos(vehicleId);

  if (isLoading || isLoadingSession) {
    return <CustomLoader />;
  }

  const photoCount = photos.length;
  const hasMetRequirement = photoCount === REQUIRED_PHOTO_COUNT;
  const canUploadMore = photoCount < REQUIRED_PHOTO_COUNT;

  // Modify the submit handler to prevent submission if requirement isn't met
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasMetRequirement) {
      // This is an extra safeguard, the button should be disabled anyway
      alert(`You must upload exactly ${REQUIRED_PHOTO_COUNT} photos.`);
      return;
    }
    handleSubmit(e);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-12"
    >
      <div className="lg:col-span-2 space-y-8">
        {/* --- 1. Clear Instructions --- */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Upload Your Vehicle Photos
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            A great first impression counts! Please upload{" "}
            <strong>exactly {REQUIRED_PHOTO_COUNT} high-quality photos</strong>{" "}
            of your vehicle.
          </p>
        </div>

        {/* --- 2. Conditional Dropzone --- */}
        {canUploadMore && (
          <div>
            <h3 className="text-lg font-medium text-gray-800">
              Add photos ({photoCount} / {REQUIRED_PHOTO_COUNT})
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              You can drag & drop files or click to select.
            </p>
            <ImageDropzone
              onDrop={onFilesDrop}
              // You might need to add a 'disabled' prop to ImageDropzone
              // or handle it in the onDrop function to reject files if
              // (files.length + photoCount) > REQUIRED_PHOTO_COUNT
            />
          </div>
        )}

        {/* --- 3. Visual Progress Grid --- */}
        {!canUploadMore && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 flex items-center gap-3">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">
              Great! You've uploaded all {REQUIRED_PHOTO_COUNT} photos.
            </span>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Your Photos</h3>
          <PhotoProgressTracker
            photos={photos}
            primaryPhotoId={primaryPhotoId}
            onRemove={onRemovePhoto}
            onSetPrimary={onSetPrimary}
          />
        </div>

        {/* --- 4. Navigation & Submission --- */}
        <div className="md:col-span-2 flex flex-col items-end gap-4 pt-4">
          <div className="flex justify-between w-full">
            <Link
              href={`/dashboard/onboarding/documents?id=${vehicleId}`}
              className="inline-flex items-center justify-center px-4 border border-gray-300 text-sm font-medium shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Back to Documents
            </Link>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting || isLoading || !hasMetRequirement}
              className="w-full md:w-auto"
            >
              {isSubmitting ? "Saving..." : "Next: Pricing"}
            </Button>
          </div>

          {/* --- 5. Submission Helper Text --- */}
          {!hasMetRequirement && (
            <p className="text-sm text-red-500 text-right">
              You must upload exactly {REQUIRED_PHOTO_COUNT} photos to continue.
            </p>
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <TipsSidebar currentStep={currentStep} />
      </div>
    </form>
  );
}

// --- Main Page Component (No changes) ---
function Step3Content() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("id");

  if (!vehicleId) {
    return (
      <div className="text-red-500 text-center p-8">
        Error: No vehicle ID found in the URL.
      </div>
    );
  }

  return <PhotoUploadForm vehicleId={vehicleId} />;
}

export default function Step3() {
  return (
    <div className="relative min-h-screen pb-24 bg-white">
      <Stepper currentStep={currentStep} />
      {/* Reduced top margin for a tighter layout */}
      <main className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<CustomLoader />}>
          <Step3Content />
        </Suspense>
      </main>
    </div>
  );
}
