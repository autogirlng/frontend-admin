"use client";

import React from "react";
import { useDropzone, Accept } from "react-dropzone";
import {
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  DocumentUploadState,
  uploadToCloudinary,
} from "@/lib/hooks/onboarding/steps/useVehicleStep4";

const STAGING_IMAGE_URL =
  "https://res.cloudinary.com/dgnalaojk/image/upload/f_auto,q_auto,w_450/v1767115432/trv57nsfk4ww6eudsj7f.jpg";

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

    onStateChange({
      status: "uploading",
      fileName: file.name,
      errorMessage: "",
    });

    uploadToCloudinary(file)
      .then((result) => {
        onStateChange({
          status: "success",
          cloudinaryUrl: result.url,
          cloudinaryPublicId: result.publicId,
        });
      })
      .catch((err) => {
        onStateChange({
          status: "error",
          errorMessage: err.message || "Upload failed. Please try again.",
        });
      });
  };

  const onRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStateChange({
      status: "idle",
      fileName: null,
      cloudinaryUrl: null,
      cloudinaryPublicId: null,
      errorMessage: "",
    });
  };

  const handlePrefill = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onStateChange({
      status: "success",
      fileName: "staging-test-document.jpg",
      cloudinaryUrl: STAGING_IMAGE_URL,
      cloudinaryPublicId: "mock_staging_id",
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

      <div className="absolute top-2 left-2 text-left">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {isCompulsory && (
          <span className="text-xs font-bold text-red-600">Compulsory</span>
        )}
      </div>

      <div className="mt-10 flex flex-col items-center">
        {status === "idle" && (
          <div className="text-gray-500 flex flex-col items-center">
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

        {process.env.NEXT_PUBLIC_APP_ENV === "staging" &&
          (status === "idle" || status === "error") && (
            <button
              type="button"
              onClick={handlePrefill}
              className="mt-4 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold bg-blue-100 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-200 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-3 h-3" /> Prefill
            </button>
          )}
      </div>

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

      {status === "error" && errorMessage && (
        <p className="text-xs text-red-600 mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default FileUploadCard;
