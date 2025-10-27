// app/components/generic/ui/FileUploadCard.tsx
"use client";

import { UploadCloud, FileText, X, Loader2 } from "lucide-react";
import React, { useRef } from "react";

type FileUploadCardProps = {
  label: string;
  isCompulsory?: boolean;
  file?: { cloudinaryUrl: string; [key: string]: any } | null; // <-- CHANGED
  fileName?: string | null; // <-- CHANGED
  isLoading?: boolean; // <-- CHANGED
  onFileSelect?: (file: File) => void; // <-- CHANGED
  onRemove?: () => void; // <-- CHANGED
};

export default function FileUploadCard({
  label,
  isCompulsory,
  file = null, // <-- CHANGED
  fileName = null, // <-- CHANGED
  isLoading = false, // <-- CHANGED
  onFileSelect = () => {}, // <-- CHANGED
  onRemove = () => {}, // <-- CHANGED
}: FileUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
    // Clear the input value to allow re-uploading the same file
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleCardClick = () => {
    if (!isLoading && !file) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="border border-gray-300 p-4 transition-all">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-800">
          {label} {isCompulsory && <span className="text-red-500">*</span>}
        </p>
        {/* Show remove button only if not loading and file exists */}
        {file && !isLoading && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div
        onClick={handleCardClick}
        className={`mt-2 h-28 flex flex-col items-center justify-center border-2 border-dashed text-center
                 ${
                   !file && !isLoading
                     ? "border-gray-400 hover:border-[#0096FF] cursor-pointer"
                     : "border-gray-300"
                 }
                 ${file && !isLoading ? "bg-green-50 border-green-300" : ""}
                 ${isLoading ? "bg-gray-50" : ""}`}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/jpeg,image/png,application/pdf"
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
        {!isLoading && !file && (
          <>
            <UploadCloud className="w-8 h-8 text-gray-500" />
            <p className="text-sm text-gray-600 mt-2 font-medium">
              Click to upload
            </p>
            <p className="text-xs text-gray-400">PDF, PNG, JPG</p>
          </>
        )}

        {/* Success State */}
        {!isLoading && file && (
          <>
            <FileText className="w-8 h-8 text-green-600" />
            <p
              className="text-sm text-green-700 mt-2 truncate max-w-full px-2"
              title={fileName || "File uploaded"}
            >
              {fileName || "File uploaded"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
