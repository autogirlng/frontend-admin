"use client";

import React, { useEffect, useState, useRef } from "react";
import { X, Download, Loader2, AlertCircle } from "lucide-react";
import Button from "@/components/generic/ui/Button";

type DocumentResponse = Blob | { data: Blob };

interface DocumentPreviewModalProps {
  title: string;
  // Function to fetch the blob (e.g., mutation.mutateAsync)
  fetchDocument: () => Promise<DocumentResponse>;
  onClose: () => void;
}

export function DocumentPreviewModal({
  title,
  fetchDocument,
  onClose,
}: DocumentPreviewModalProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // 1. Use a Ref to store the fetch function.
  // This keeps the function stable across renders so we don't need it in the dependency array.
  const fetchDocRef = useRef(fetchDocument);

  useEffect(() => {
    let active = true;
    let url: string | null = null; // 2. Local variable to track URL for cleanup

    const loadPreview = async () => {
      try {
        setIsLoading(true);
        setError(false);

        // Call the function via ref
        const response = await fetchDocRef.current();

        let blob: Blob;
        if (response instanceof Blob) {
          blob = response;
        } else if ("data" in response && response.data instanceof Blob) {
          blob = response.data;
        } else {
          // Fallback: Cast to BlobPart if the structure doesn't match expected types
          // This handles edge cases while satisfying TypeScript
          blob = new Blob([response as unknown as BlobPart], {
            type: "application/pdf",
          });
        }

        // Create object URL
        url = URL.createObjectURL(blob);

        if (active) {
          setBlobUrl(url);
        }
      } catch (err) {
        console.error("Failed to load preview:", err);
        if (active) setError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadPreview();

    // Cleanup function
    return () => {
      active = false;
      // Revoke the specific URL created in this instance
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, []); // Dependency array is intentionally empty to run once on mount

  const handleDownload = () => {
    if (blobUrl) {
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${title.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-6xl bg-white rounded-lg shadow-2xl flex flex-col h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg shrink-0">
          <h3 className="text-lg font-semibold text-gray-900 capitalize">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden flex flex-col">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-600">
                Generating Document...
              </p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-red-600">
              <AlertCircle className="h-10 w-10 mb-2" />
              <p className="font-semibold">Failed to load document preview.</p>
              <Button variant="secondary" className="mt-4" onClick={onClose}>
                Close
              </Button>
            </div>
          )}

          {!isLoading && !error && blobUrl && (
            <iframe
              src={blobUrl}
              className="w-full h-full border-none"
              title="Document Preview"
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t flex justify-between items-center shrink-0">
          <p className="text-sm text-gray-500 italic">
            This above is the {title}
          </p>
        </div>
      </div>
    </div>
  );
}
