"use client";

import React, { useState, useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { UseMutationResult } from "@tanstack/react-query";
import { CsvUploadResponse } from "@/components/set-up-management/vehicle-make-model/types";
import Button from "./Button";
import { X, UploadCloud, File, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface CsvUploadModalProps {
  title: string;
  onClose: () => void;
  uploadMutation: UseMutationResult<CsvUploadResponse, Error, File>;
}

export function CsvUploadModal({
  title,
  onClose,
  uploadMutation,
}: CsvUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<CsvUploadResponse | null>(
    null
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setUploadResult(null);
      setUploadError(null);

      if (fileRejections.length > 0) {
        toast.error("File rejected. Please upload a valid .csv file.");
        return;
      }
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }
    setUploadError(null);
    setUploadResult(null);

    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        setUploadResult(data);
        setFile(null); // Clear file on success
        toast.success("CSV processed successfully.");
      },
      onError: (error) => {
        setUploadError(error.message);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        {!uploadResult && !uploadError && (
          <>
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer
                ${
                  isDragActive
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-300"
                }
                ${
                  uploadMutation.isPending
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
            >
              <input {...getInputProps()} disabled={uploadMutation.isPending} />
              <UploadCloud className="h-12 w-12 text-gray-400" />
              {file ? (
                <p className="mt-2 font-semibold text-gray-700">{file.name}</p>
              ) : (
                <p className="mt-2 text-sm text-gray-600">
                  {isDragActive
                    ? "Drop the file here ..."
                    : "Drag 'n' drop a .csv file here, or click to select"}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleUpload}
                isLoading={uploadMutation.isPending}
                disabled={!file || uploadMutation.isPending}
              >
                Upload File
              </Button>
            </div>
          </>
        )}

        {/* Upload Result Display */}
        {uploadResult && (
          <UploadResultReport result={uploadResult} onClose={onClose} />
        )}
        {uploadError && (
          <UploadErrorDisplay error={uploadError} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

// --- Sub-component for Success Report ---
function UploadResultReport({
  result,
  onClose,
}: {
  result: CsvUploadResponse;
  onClose: () => void;
}) {
  const hasErrors = result.errors && result.errors.length > 0;
  return (
    <div>
      <div className="flex items-center gap-3 p-4 bg-green-50 text-green-800 rounded-lg">
        <CheckCircle className="h-8 w-8" />
        <div>
          <h3 className="font-semibold">Upload Processed</h3>
          <p>File processed with the following results:</p>
        </div>
      </div>
      <ul className="list-disc list-inside space-y-1 my-4 px-2 text-sm">
        <li>
          <span className="font-semibold">{result.totalRecords}</span> total
          records found.
        </li>
        <li>
          <span className="font-semibold">{result.successfulImports}</span> new
          records imported.
        </li>
        <li>
          <span className="font-semibold">{result.duplicateSkips}</span>{" "}
          duplicate records skipped.
        </li>
        {result.invalidMakeSkips !== undefined && (
          <li>
            <span className="font-semibold">{result.invalidMakeSkips}</span>{" "}
            records skipped due to invalid Make.
          </li>
        )}
      </ul>
      {hasErrors && (
        <>
          <h4 className="font-semibold text-red-700">Import Errors:</h4>
          <pre className="max-h-40 overflow-y-auto bg-gray-100 p-3 mt-2 rounded-md text-xs text-red-800">
            {result.errors.join("\n")}
          </pre>
        </>
      )}
      <div className="flex justify-end pt-6">
        <Button variant="primary" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
}

// --- Sub-component for Upload Error ---
function UploadErrorDisplay({
  error,
  onClose,
}: {
  error: string;
  onClose: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 p-4 bg-red-50 text-red-800 rounded-lg">
        <AlertCircle className="h-8 w-8" />
        <div>
          <h3 className="font-semibold">Upload Failed</h3>
          <p>{error}</p>
        </div>
      </div>
      <div className="flex justify-end pt-6">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
