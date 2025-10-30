// app/components/generic/ui/ImageDropzone.tsx
"use client";

import React from "react";
import { useDropzone, Accept } from "react-dropzone";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";

type ImageDropzoneProps = {
  onDrop: (acceptedFiles: File[]) => void;
  className?: string;
  maxFiles?: number;
  accept?: Accept;
};

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onDrop,
  className = "",
  maxFiles = 10,
  accept = { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
}) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept,
      maxFiles,
    });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ease-in-out ${
        isDragActive && !isDragReject ? "border-blue-500 bg-blue-50" : ""
      } ${
        isDragReject ? "border-red-500 bg-red-50" : ""
      } ${className} hover:border-gray-400`}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center text-gray-500">
        {isDragReject ? (
          <X className="w-12 h-12 text-red-500" />
        ) : (
          <UploadCloud className="w-12 h-12" />
        )}
        {isDragActive && !isDragReject ? (
          <p className="mt-2 text-lg font-semibold text-blue-600">
            Drop the files here ...
          </p>
        ) : isDragReject ? (
          <p className="mt-2 text-lg font-semibold text-red-600">
            Some files will be rejected
          </p>
        ) : (
          <>
            <p className="mt-2 text-lg font-semibold">
              Drag & drop photos here
            </p>
            <p className="text-sm">or click to browse</p>
            <p className="text-xs text-gray-400 mt-4">
              PNG, JPG, WEBP up to 10MB. (Max {maxFiles} files)
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageDropzone;
