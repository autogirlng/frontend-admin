// app/components/generic/ui/ImageUploadButton.tsx
"use client";

import { UploadCloud, Loader2 } from "lucide-react";
import React, { useRef } from "react";

type ImageUploadButtonProps = {
  isLoading?: boolean; // <-- CHANGED
  onFileSelect?: (file: File) => void; // <-- CHANGED
};

export default function ImageUploadButton({
  isLoading = false, // <-- CHANGED
  onFileSelect = () => {}, // <-- CHANGED
}: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
    // Clear the input value
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!isLoading) {
      inputRef.current?.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative aspect-video flex flex-col items-center justify-center border-2 border-dashed text-center transition-all
               ${
                 isLoading
                   ? "border-gray-300 bg-gray-50"
                   : "border-gray-400 hover:border-[#0096FF] cursor-pointer"
               }`}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        disabled={isLoading}
      />

      {/* Loading State */}
      {isLoading && (
        <>
          <Loader2 className="w-8 h-8 text-[#0096FF] animate-spin" />
          <p className="text-sm text-gray-500 mt-2">Uploading...</p>
        </>
      )}

      {/* Empty State */}
      {!isLoading && (
        <>
          <UploadCloud className="w-10 h-10 text-gray-500" />
          <p className="text-sm text-gray-600 mt-2 font-medium">Add Photo</p>
          <p className="text-xs text-gray-400">(Up to 6)</p>
        </>
      )}
    </div>
  );
}
