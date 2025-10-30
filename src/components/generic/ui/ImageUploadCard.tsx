// app/components/generic/ui/ImageUploadCard.tsx
"use client";

import { PhotoUpload } from "@/components/dashboard/onboarding/types/form";
import { Star, X } from "lucide-react";
import clsx from "clsx";

type ImageUploadCardProps = {
  photo?: PhotoUpload; // <-- CHANGED
  onRemove?: () => void; // <-- CHANGED
  onSetPrimary?: () => void; // <-- CHANGED
};

// Default photo for static display
const defaultPhoto: PhotoUpload = {
  cloudinaryUrl: "https://placehold.co/600x400/EEE/31343C?text=Vehicle+Photo",
  cloudinaryPublicId: "placeholder_id",
  fileName: "placeholder.jpg",
  isPrimary: false,
};

export default function ImageUploadCard({
  photo = defaultPhoto, // <-- CHANGED
  onRemove = () => {}, // <-- CHANGED
  onSetPrimary = () => {}, // <-- CHANGED
}: ImageUploadCardProps) {
  return (
    <div className="relative aspect-video border border-gray-300 overflow-hidden group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.cloudinaryUrl}
        alt={photo.fileName || "Uploaded vehicle photo"}
        className="w-full h-full object-cover"
      />

      {/* Overlay buttons (visible on hover) */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
        <button
          type="button"
          title="Set as primary"
          onClick={onSetPrimary}
          className="p-2 bg-white/80 rounded-full text-gray-800 hover:bg-white"
        >
          <Star
            className={clsx(
              "w-5 h-5",
              photo.isPrimary
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-600"
            )}
          />
        </button>
        <button
          type="button"
          title="Remove photo"
          onClick={onRemove}
          className="p-2 bg-white/80 rounded-full text-red-600 hover:bg-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Primary Badge (always visible if primary) */}
      {photo.isPrimary && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3" />
          Primary
        </div>
      )}
    </div>
  );
}
