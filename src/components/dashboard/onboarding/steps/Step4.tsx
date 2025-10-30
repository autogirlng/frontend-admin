// app/components/steps/Step3.tsx
"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Stepper from "@/components/generic/Stepper";
import TipsSidebar from "@/components/generic/TipsSidebar";
import Button from "@/components/generic/ui/Button";
import ImageDropzone from "@/components/generic/ui/ImageDropzone"; // Our new component
import { useVehiclePhotos } from "@/lib/hooks/onboarding/steps/useVehicleStep3"; // Our new hook
import { Loader2, X, Check, Star } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import CustomLoader from "@/components/generic/CustomLoader";

const currentStep = 4;

// A small sub-component for rendering the photo previews
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
    <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-md group">
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

// --- Child Form Component ---
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

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-12"
    >
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h2 className="text-lg font-medium text-gray-800">
            Upload Vehicle Photos
          </h2>
          <p className="text-sm text-gray-500">
            Upload at least 5 high-quality photos. The first photo will be the
            primary one.
          </p>
        </div>

        <ImageDropzone onDrop={onFilesDrop} />

        {/* --- Photo Grid --- */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <PhotoPreviewCard
                key={photo.preview} // Use preview as key before publicId exists
                previewUrl={photo.preview}
                publicId={photo.publicId}
                isUploading={photo.isUploading}
                isPrimary={
                  photo.publicId === primaryPhotoId && !!photo.publicId
                }
                onRemove={() => onRemovePhoto(photo.publicId!)}
                onSetPrimary={() => onSetPrimary(photo.publicId!)}
              />
            ))}
          </div>
        )}
        <div className="md:col-span-2 flex justify-between gap-4 pt-4">
          <Link
            href={`/dashboard/onboarding/documents?id=${vehicleId}`}
            className="inline-flex items-center justify-center px-4 py-2 border border-[#0096FF] text-sm font-medium shadow-sm text-white bg-[#0096FF] hover:bg-[#007ACC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Documents
          </Link>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "Saving..." : "Pricing"}
          </Button>
        </div>
      </div>

      <div className="lg:col-span-1">
        <TipsSidebar currentStep={currentStep} />
      </div>
    </form>
  );
}

// --- Main Page Component ---
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
      <main className="max-w-8xl mt-8">
        <Suspense fallback={<CustomLoader />}>
          <Step3Content />
        </Suspense>
      </main>
    </div>
  );
}
