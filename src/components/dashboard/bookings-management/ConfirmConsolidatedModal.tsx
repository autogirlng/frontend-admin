import React, { useState, useEffect } from "react";
import { UploadCloud } from "lucide-react";
import clsx from "clsx";
import { ConfirmModal } from "@/components/generic/ui/CustomModal";
import { uploadToCloudinary } from "@/components/dashboard/finance/payments/utils";
import { ConsolidatedInvoice } from "@/components/dashboard/bookings-management/consolidated-types";
import {
  useConfirmConsolidatedInvoice,
  useGetConsolidatedInvoiceById,
} from "@/components/dashboard/bookings-management/useConsolidatedInvoices";
import { FilePreviewThumbnail } from "@/components/generic/ui/FilePreviewThumbnail";

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
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const confirmMutation = useConfirmConsolidatedInvoice();
  const { data: consolidatedInvoiceData } = useGetConsolidatedInvoiceById(
    invoice.id,
  );

  useEffect(() => {
    if (!isOpen) {
      setGlobalFile(null);
      setIsUploading(false);
      setIsDragging(false);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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
  };

  const confirm = async () => {
    setIsUploading(true);
    if (globalFile && consolidatedInvoiceData) {
      const uploaded = await uploadToCloudinary(globalFile);
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
    setIsUploading(false);
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
                globalFile && !isDragging
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
              {globalFile ? (
                <div className="flex flex-col items-center">
                  <FilePreviewThumbnail
                    file={globalFile}
                    onRemove={() => removeFile()}
                  />
                  <p className="mt-2 text-sm font-medium text-green-700">
                    File Attached
                  </p>
                  <p className="text-xs text-gray-500">{globalFile.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                </div>
              )}
            </label>
          </div>
        </div>
      }
    />
  );
};
