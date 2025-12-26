import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  UploadCloud,
  X,
  FileIcon,
  Paperclip,
  CheckCircle2,
} from "lucide-react";
import clsx from "clsx";
import { ConfirmModal } from "@/components/generic/ui/CustomModal";
import { Payment } from "../types";
import { uploadToCloudinary } from "./utils";
import {
  useConfirmOfflinePayment,
  useBulkConfirmOfflinePayment,
  OfflinePaymentPayload,
  BulkOfflinePaymentPayload,
} from "@/lib/hooks/finance/useFinanceBookings";

const FilePreviewThumbnail = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) => {
  const isImage = file.type.startsWith("image/");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isImage) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isImage]);

  return (
    <div className="relative group inline-block">
      {isImage && previewUrl ? (
        <Image
          src={previewUrl}
          alt="Preview"
          width={80}
          height={80}
          className="h-20 w-20 object-cover rounded-md border border-gray-200"
        />
      ) : (
        <div className="h-20 w-20 bg-gray-100 rounded-md border border-gray-200 flex flex-col items-center justify-center text-gray-500">
          <FileIcon className="h-8 w-8 text-red-500" />
          <span className="text-[9px] mt-1 px-1 truncate max-w-full">PDF</span>
        </div>
      )}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

interface PaymentApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
  selectedPayments: Payment[];
  mode: "single" | "bulk";
  onSuccess: () => void;
}

export const PaymentApprovalModal: React.FC<PaymentApprovalModalProps> = ({
  isOpen,
  onClose,
  payment,
  selectedPayments,
  mode,
  onSuccess,
}) => {
  const [globalFile, setGlobalFile] = useState<File | null>(null);
  const [individualFiles, setIndividualFiles] = useState<Record<string, File>>(
    {}
  );
  const [isUploading, setIsUploading] = useState(false);

  // New state for drag-and-drop visual feedback
  const [isDragging, setIsDragging] = useState(false);

  const confirmPaymentMutation = useConfirmOfflinePayment();
  const bulkConfirmMutation = useBulkConfirmOfflinePayment();

  useEffect(() => {
    if (!isOpen) {
      setGlobalFile(null);
      setIndividualFiles({});
      setIsUploading(false);
      setIsDragging(false);
    }
  }, [isOpen]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    bookingId?: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (bookingId)
        setIndividualFiles((prev) => ({ ...prev, [bookingId]: file }));
      else setGlobalFile(file);
    }
  };

  // --- New Drag and Drop Handlers ---
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Create a synthetic event to reuse existing handleFileChange logic
      const syntheticEvent = {
        target: {
          files: e.dataTransfer.files,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleFileChange(syntheticEvent);
    }
  };
  // ----------------------------------

  const removeFile = (bookingId?: string) => {
    if (bookingId) {
      setIndividualFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[bookingId];
        return newFiles;
      });
    } else setGlobalFile(null);
  };

  const handleConfirm = async () => {
    setIsUploading(true);
    try {
      if (mode === "single" && payment) {
        if (!globalFile) {
          toast.error("Please upload a payment proof.");
          setIsUploading(false);
          return;
        }
        const uploaded = await uploadToCloudinary(globalFile);
        const payload: OfflinePaymentPayload = {
          paymentImageUrl: uploaded.url,
          publicId: uploaded.publicId,
        };

        await confirmPaymentMutation.mutateAsync({
          bookingId: payment.bookingId,
          payload,
        });
        onSuccess();
        return;
      }

      if (mode === "bulk") {
        const bookingsToProcess = selectedPayments;
        if (
          bookingsToProcess.some(
            (p) => !globalFile && !individualFiles[p.bookingId]
          )
        ) {
          toast.error(
            "All bookings must have a proof of payment (either Global or Individual)."
          );
          setIsUploading(false);
          return;
        }

        let globalUploadData: { url: string; publicId: string } | null = null;
        if (globalFile) {
          globalUploadData = await uploadToCloudinary(globalFile);
        }

        const paymentConfirmations = await Promise.all(
          bookingsToProcess.map(async (booking) => {
            const specificFile = individualFiles[booking.bookingId];
            if (specificFile) {
              const upload = await uploadToCloudinary(specificFile);
              return {
                bookingId: booking.bookingId,
                paymentImageUrl: upload.url,
                publicId: upload.publicId,
              };
            } else if (globalUploadData) {
              return {
                bookingId: booking.bookingId,
                paymentImageUrl: globalUploadData.url,
                publicId: globalUploadData.publicId,
              };
            }
            throw new Error("Missing file logic error");
          })
        );

        const payload: BulkOfflinePaymentPayload = { paymentConfirmations };
        await bulkConfirmMutation.mutateAsync(payload);
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload or Confirmation failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      title={
        mode === "bulk"
          ? `Approve ${selectedPayments.length} Payments`
          : "Approve Offline Payment"
      }
      isLoading={
        isUploading ||
        confirmPaymentMutation.isPending ||
        bulkConfirmMutation.isPending
      }
      variant="primary"
      confirmLabel={
        isUploading ? "Uploading & Processing..." : "Confirm & Approve"
      }
      onConfirm={handleConfirm}
      onCancel={onClose}
      message={
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
            {mode === "bulk"
              ? "Upload one 'Master Proof' to apply to all, or override specifically below."
              : `Upload proof for ${payment?.userName} (Ref: ${payment?.bookingRef}).`}
          </div>

          <div className="relative">
            <label
              htmlFor="global-proof-upload"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={clsx(
                "block border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer",
                // Added isDragging condition to mimic the hover/active style
                isDragging ? "border-blue-500 bg-blue-50" : "",
                globalFile && !isDragging
                  ? "border-green-400 bg-green-50"
                  : !isDragging &&
                      "border-gray-300 hover:border-blue-500 hover:bg-gray-50"
              )}
            >
              <input
                id="global-proof-upload"
                type="file"
                className="sr-only"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange(e)}
              />
              {globalFile ? (
                <div className="flex flex-col items-center">
                  <FilePreviewThumbnail
                    file={globalFile}
                    onRemove={() => removeFile()}
                  />
                  <p className="mt-2 text-sm font-medium text-green-700">
                    Master Proof Attached
                  </p>
                  <p className="text-xs text-gray-500">{globalFile.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    {mode === "bulk"
                      ? "Click or Drag to upload Master Proof"
                      : "Click or Drag to upload Proof"}
                  </span>
                </div>
              )}
            </label>
          </div>

          {mode === "bulk" && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Selected Bookings:
              </p>
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md divide-y divide-gray-100 bg-white">
                {selectedPayments.map((p) => {
                  const hasIndividual = !!individualFiles[p.bookingId];
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {p.userName}
                        </span>
                        <span className="text-xs font-mono text-gray-500">
                          {p.bookingRef}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {hasIndividual ? (
                          <FilePreviewThumbnail
                            file={individualFiles[p.bookingId]}
                            onRemove={() => removeFile(p.bookingId)}
                          />
                        ) : globalFile ? (
                          <div className="flex items-center gap-1 text-green-600 px-2 py-1 bg-green-50 rounded text-xs border border-green-100">
                            <CheckCircle2 className="w-3 h-3" /> Master
                          </div>
                        ) : (
                          <span className="text-xs text-orange-500 italic">
                            No proof
                          </span>
                        )}
                        <label className="cursor-pointer p-2 hover:bg-gray-200 rounded-full text-gray-500">
                          <Paperclip className="w-4 h-4" />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*,application/pdf"
                            onChange={(e) => handleFileChange(e, p.bookingId)}
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      }
    />
  );
};
