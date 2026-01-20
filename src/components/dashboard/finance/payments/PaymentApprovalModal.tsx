import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  UploadCloud,
  X,
  FileIcon,
  CheckCircle2,
  DollarSign,
  AlertCircle,
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
import TextInput from "@/components/generic/ui/TextInput";
import { formatPrice } from "./utils";

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
    {},
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [paymentType, setPaymentType] = useState<"full" | "partial">("full");
  const [partialAmount, setPartialAmount] = useState<string>("");

  const confirmPaymentMutation = useConfirmOfflinePayment();
  const bulkConfirmMutation = useBulkConfirmOfflinePayment();

  useEffect(() => {
    if (!isOpen) {
      setGlobalFile(null);
      setIndividualFiles({});
      setIsUploading(false);
      setIsDragging(false);
      setPaymentType("full");
      setPartialAmount("");
    }
  }, [isOpen]);

  const totalPayable = payment?.totalPayable || 0;
  const alreadyPaid = payment?.amountPaid || 0;
  const remainingBalance = totalPayable - alreadyPaid;

  const isAmountError =
    partialAmount !== "" && Number(partialAmount) > remainingBalance;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    bookingId?: string,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (bookingId)
        setIndividualFiles((prev) => ({ ...prev, [bookingId]: file }));
      else setGlobalFile(file);
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

        let finalAmountPaid: number | undefined = undefined;
        if (paymentType === "partial") {
          const amount = parseFloat(partialAmount);
          if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount.");
            setIsUploading(false);
            return;
          }
          if (amount > remainingBalance) {
            toast.error(
              `Amount cannot exceed remaining balance of ${formatPrice(remainingBalance)}`,
            );
            setIsUploading(false);
            return;
          }
          finalAmountPaid = amount;
        }

        const uploaded = await uploadToCloudinary(globalFile);
        const payload: OfflinePaymentPayload = {
          paymentImageUrl: uploaded.url,
          publicId: uploaded.publicId,
          amountPaid: finalAmountPaid,
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
            (p) => !globalFile && !individualFiles[p.bookingId],
          )
        ) {
          toast.error("All bookings must have a proof of payment.");
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
            let uploadData = globalUploadData;

            if (specificFile) {
              uploadData = await uploadToCloudinary(specificFile);
            }

            if (!uploadData) throw new Error("Missing file logic error");

            return {
              bookingId: booking.bookingId,
              paymentImageUrl: uploadData.url,
              publicId: uploadData.publicId,
              amountPaid: undefined,
            };
          }),
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
          : "Approve Payment"
      }
      isLoading={
        isUploading ||
        confirmPaymentMutation.isPending ||
        bulkConfirmMutation.isPending
      }
      variant="primary"
      confirmLabel={
        isUploading
          ? "Processing..."
          : paymentType === "partial"
            ? `Record ${formatPrice(Number(partialAmount) || 0)}`
            : "Confirm Full Payment"
      }
      onConfirm={handleConfirm}
      onCancel={onClose}
      message={
        <div className="space-y-6">
          {mode === "single" && payment && (
            <div className="bg-gray-50 p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                <span className="text-gray-600 text-sm">Total Payable</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(payment.totalPayable)}
                </span>
              </div>

              {payment.paymentStatus === "PARTIALLY_PAID" && (
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                  <span className="text-orange-600 text-sm">Already Paid</span>
                  <span className="font-semibold text-orange-600">
                    {formatPrice(payment.amountPaid || 0)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center mb-4">
                <span className="text-blue-600 text-sm font-medium">
                  Remaining Balance
                </span>
                <span className="font-bold text-xl text-blue-600">
                  {formatPrice(remainingBalance)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setPaymentType("full")}
                  className={clsx(
                    "py-2 px-3 text-sm font-medium border transition-colors flex items-center justify-center gap-2",
                    paymentType === "full"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50",
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" /> Full Payment
                </button>
                <button
                  onClick={() => setPaymentType("partial")}
                  className={clsx(
                    "py-2 px-3 text-sm font-medium border transition-colors flex items-center justify-center gap-2",
                    paymentType === "partial"
                      ? "bg-orange-600 text-white border-orange-600"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50",
                  )}
                >
                  <DollarSign className="w-4 h-4" /> Part Payment
                </button>
              </div>

              {paymentType === "partial" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200 mt-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Enter Amount Received
                  </label>
                  <div className="relative">
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none">
                      ₦
                    </span>

                    <TextInput
                      id="partial-amount"
                      label="Enter Amount Received"
                      hideLabel={true}
                      type="number"
                      value={partialAmount}
                      onChange={(e) => setPartialAmount(e.target.value)}
                      placeholder="0.00"
                      max={remainingBalance}
                      className="pl-10"
                      error={isAmountError ? "Error" : undefined}
                    />
                  </div>

                  {isAmountError ? (
                    <p className="mt-1 text-sm text-red-600">
                      Amount exceeds remaining balance
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      New Balance will be:{" "}
                      <span className="font-medium">
                        {formatPrice(
                          remainingBalance - (Number(partialAmount) || 0),
                        )}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proof of Payment {mode === "bulk" && "(Master File)"}
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
            <div className="bg-yellow-50 p-3 rounded text-xs text-yellow-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Bulk approval currently records all selected items as{" "}
                <strong>Full Payments</strong>. Use single approval for partial
                payments.
              </span>
            </div>
          )}
        </div>
      }
    />
  );
};
