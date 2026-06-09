import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, CheckCircle2, X } from "lucide-react";
import clsx from "clsx";
import { toast } from "react-hot-toast";
import { ConfirmModal } from "@/components/generic/ui/CustomModal";
import { uploadToCloudinary } from "@/components/dashboard/finance/payments/utils";
import { ConsolidatedInvoice } from "@/components/dashboard/bookings-management/consolidated-types";
import {
  useConfirmConsolidatedInvoice,
  useGetConsolidatedInvoiceById,
} from "@/components/dashboard/bookings-management/useConsolidatedInvoices";
import { FilePreviewThumbnail } from "@/components/generic/ui/FilePreviewThumbnail";

const STAGING_IMAGE_URL =
  "https://res.cloudinary.com/dgnalaojk/image/upload/f_auto,q_auto,w_450/v1767115432/trv57nsfk4ww6eudsj7f.jpg";

interface ConfirmConsolidatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  invoice: ConsolidatedInvoice;
}

export const ConfirmConsolidatedModal: React.FC<
  ConfirmConsolidatedModalProps
> = ({ isOpen, onClose, onSuccess, invoice }) => {
  const [globalFile, setGlobalFile] = useState<File | null>(null);
  const [usePrefill, setUsePrefill] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const confirmMutation = useConfirmConsolidatedInvoice();
  const { data: consolidatedInvoiceData } = useGetConsolidatedInvoiceById(
    invoice.id,
  );

  useEffect(() => {
    if (!isOpen) {
      setGlobalFile(null);
      setUsePrefill(false);
      setIsUploading(false);
      setIsDragging(false);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUsePrefill(false);
      setGlobalFile(file);
    }
  };

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
      const syntheticEvent = {
        target: { files: e.dataTransfer.files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(syntheticEvent);
    }
  };

  const removeFile = () => {
    setGlobalFile(null);
    setUsePrefill(false);
  };

  const confirm = async () => {
    if (!globalFile && !usePrefill) {
      toast.error("Please upload a proof of payment.");
      return;
    }

    setIsUploading(true);
    try {
      if (consolidatedInvoiceData) {
        let uploaded;
        if (usePrefill) {
          uploaded = { url: STAGING_IMAGE_URL, publicId: "mock_staging_id" };
          await new Promise((res) => setTimeout(res, 500));
        } else {
          uploaded = await uploadToCloudinary(globalFile!);
        }

        const payload = {
          ...invoice,
          bookingInvoiceNumbers: consolidatedInvoiceData.invoiceNumbers,
          proofOfPayment: uploaded.url,
          publicId: uploaded.publicId,
        };

        confirmMutation.mutate(payload, {
          onSuccess: () => {
            onSuccess();
          },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to confirm invoice.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      title={"Approve Consolidated Invoice"}
      isLoading={isUploading || confirmMutation.isPending}
      variant="primary"
      confirmLabel={"Confirm"}
      onConfirm={confirm}
      onCancel={onClose}
      message={
        <div className="space-y-6">
          <section>
            Are you sure you want to confirm invoice{" "}
            <strong className="text-gray-900">{invoice.invoiceNumber}</strong>?
            This will mark it as PAID and send the receipt.
          </section>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Proof of Payment
            </label>
            <label
              htmlFor="global-proof-upload"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={clsx(
                "block border-2 border-dashed p-6 text-center transition-all cursor-pointer relative",
                isDragging ? "border-blue-500 bg-blue-50" : "",
                (globalFile || usePrefill) && !isDragging
                  ? "border-green-400 bg-green-50"
                  : !isDragging &&
                      "border-gray-300 hover:border-blue-500 hover:bg-gray-50",
              )}
            >
              <input
                id="global-proof-upload"
                type="file"
                className="sr-only"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange(e)}
              />
              {globalFile || usePrefill ? (
                <div className="flex flex-col items-center">
                  {usePrefill ? (
                    <div className="relative group inline-block">
                      <Image
                        src={STAGING_IMAGE_URL}
                        alt="Prefill Preview"
                        width={80}
                        height={80}
                        className="h-20 w-20 object-cover rounded-md border border-gray-200"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <FilePreviewThumbnail
                      file={globalFile!}
                      onRemove={() => removeFile()}
                    />
                  )}
                  <p className="mt-2 text-sm font-medium text-green-700">
                    {usePrefill ? "Test File Attached" : "File Attached"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {usePrefill ? "staging-test-image.jpg" : globalFile!.name}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    Click or Drag to upload Proof
                  </span>
                  {process.env.NEXT_PUBLIC_APP_ENV === "staging" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setUsePrefill(true);
                      }}
                      className="mt-4 inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Prefill Staging Image
                    </button>
                  )}
                </div>
              )}
            </label>
          </div>
        </div>
      }
    />
  );
};
