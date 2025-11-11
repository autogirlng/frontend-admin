// app/components/generic/ui/FileUploadCard.tsx
"use client";

import React from "react";
import { useDropzone, Accept } from "react-dropzone";
import {
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  DocumentUploadState,
  uploadToCloudinary,
} from "@/lib/hooks/onboarding/steps/useVehicleStep4"; // Import from our new hook

type FileUploadCardProps = {
  label: string;
  isCompulsory: boolean;
  docState: DocumentUploadState;
  onStateChange: (newState: Partial<DocumentUploadState>) => void;
  accept?: Accept;
};

const FileUploadCard: React.FC<FileUploadCardProps> = ({
  label,
  isCompulsory,
  docState,
  onStateChange,
  accept = {
    "image/*": [".jpeg", ".jpg", ".png"],
    "application/pdf": [".pdf"],
  },
}) => {
  const { status, fileName, errorMessage } = docState;

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 1. Set state to "uploading"
    onStateChange({
      status: "uploading",
      fileName: file.name,
      errorMessage: "",
    });

    // 2. Start upload
    uploadToCloudinary(file)
      .then((result) => {
        // 3. Set state to "success"
        onStateChange({
          status: "success",
          cloudinaryUrl: result.url,
          cloudinaryPublicId: result.publicId,
        });
      })
      .catch((err) => {
        // 4. Set state to "error"
        onStateChange({
          status: "error",
          errorMessage: err.message || "Upload failed. Please try again.",
        });
      });
  };

  const onRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropzone from opening
    // TODO: Call Cloudinary delete API if needed
    onStateChange({
      status: "idle",
      fileName: null,
      cloudinaryUrl: null,
      cloudinaryPublicId: null,
      errorMessage: "",
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled: status === "uploading",
  });

  const getBorderColor = () => {
    if (status === "error") return "border-red-500 bg-red-50";
    if (isDragActive) return "border-blue-500 bg-blue-50";
    if (status === "success") return "border-green-500 bg-green-50";
    return "border-gray-300 hover:border-gray-400";
  };

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed p-4 h-full flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${getBorderColor()}`}
    >
      <input {...getInputProps()} />

      {/* Label and Compulsory Badge */}
      <div className="absolute top-2 left-2 text-left">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {isCompulsory && (
          <span className="text-xs font-bold text-red-600">Compulsory</span>
        )}
      </div>

      {/* Card Body (Status-dependent) */}
      <div className="mt-10">
        {status === "idle" && (
          <div className="text-gray-500">
            <UploadCloud className="w-10 h-10 mx-auto" />
            <p className="mt-2 text-sm">Drop file or click</p>
          </div>
        )}

        {status === "uploading" && (
          <div className="text-blue-500">
            <Loader2 className="w-10 h-10 mx-auto animate-spin" />
            <p className="mt-2 text-sm truncate max-w-full px-2">{fileName}</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-green-600">
            <CheckCircle2 className="w-10 h-10 mx-auto" />
            <p className="mt-2 text-sm font-medium truncate max-w-full px-2">
              {fileName || "Upload Complete"}
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="text-red-600">
            <AlertTriangle className="w-10 h-10 mx-auto" />
            <p className="mt-2 text-sm font-medium">Upload Failed</p>
          </div>
        )}
      </div>

      {/* Remove Button */}
      {status === "success" && (
        <button
          type="button"
          title="Remove file"
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Error Message */}
      {status === "error" && errorMessage && (
        <p className="text-xs text-red-600 mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default FileUploadCard;
