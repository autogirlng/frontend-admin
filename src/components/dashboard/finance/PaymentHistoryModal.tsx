import React, { useState } from "react";
import { X, Copy, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import {
  useGetPaymentHistory,
  useGenerateBalanceDva,
  useWaiveBalance,
} from "@/lib/hooks/finance/usePayments";
import { Payment, GeneratedDvaResponse } from "./types";
import { formatPrice } from "./payments/utils";
import { format } from "date-fns";
import clsx from "clsx";

interface PaymentHistoryModalProps {
  payment: Payment;
  onClose: () => void;
}

export function PaymentHistoryModal({
  payment,
  onClose,
}: PaymentHistoryModalProps) {
  const { data: history, isLoading } = useGetPaymentHistory(payment.bookingId);
  const generateDvaMutation = useGenerateBalanceDva();
  const waiveBalanceMutation = useWaiveBalance();

  const [waiveReason, setWaiveReason] = useState("");
  const [generatedDva, setGeneratedDva] = useState<GeneratedDvaResponse | null>(
    null,
  );

  const isCompleted = payment.paymentStatus === "SUCCESSFUL";

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleGenerateDva = async () => {
    try {
      const result = await generateDvaMutation.mutateAsync({
        bookingId: payment.bookingId,
      });
      setGeneratedDva(result);
    } catch (error) {}
  };

  const handleWaiveBalance = async () => {
    if (!waiveReason.trim()) {
      toast.error("Please provide a reason for waiving the balance.");
      return;
    }
    try {
      await waiveBalanceMutation.mutateAsync({
        bookingId: payment.bookingId,
        reason: waiveReason,
      });
      onClose();
    } catch (error) {}
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "SETTLED":
      case "SUCCESSFUL":
        return "bg-green-100 text-green-700 border-green-200";
      case "WAIVED":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "SUPERSEDED":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Payment Management
        </h2>

        {isLoading ? (
          <div className="py-12">
            <CustomLoader />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Total Payable
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(history?.totalPayable || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Total Paid / Waived
                </p>
                <p className="text-lg font-bold text-green-600">
                  {formatPrice(history?.totalPaid || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Method
                </p>
                <p className="text-sm font-medium mt-1">
                  {history?.paymentMethod || payment.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  Status
                </p>
                <span
                  className={`inline-flex px-2.5 py-0.5 mt-1 text-xs font-bold rounded border uppercase ${getStatusBadge(history?.paymentStatus || payment.paymentStatus)}`}
                >
                  {(history?.paymentStatus || payment.paymentStatus).replace(
                    /_/g,
                    " ",
                  )}
                </span>
              </div>
            </div>
            {!payment.hasDva && !isCompleted && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">
                      Dedicated Virtual Account (DVA)
                    </h3>
                  </div>
                  {!generatedDva && (
                    <Button
                      onClick={handleGenerateDva}
                      isLoading={generateDvaMutation.isPending}
                      variant="primary"
                      size="sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" /> Generate DVA
                    </Button>
                  )}
                </div>

                {generatedDva && (
                  <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-white rounded border border-blue-100">
                    <div>
                      <p className="text-xs text-gray-500">Bank Name</p>
                      <p className="font-medium">{generatedDva.bankName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Account Number</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium font-mono text-lg">
                          {generatedDva.accountNumber}
                        </p>
                        <button
                          onClick={() =>
                            handleCopy(
                              generatedDva.accountNumber,
                              "Account Number",
                            )
                          }
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Account Name</p>
                      <p className="font-medium">{generatedDva.accountName}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Allocation History
              </h3>
              {history?.allocations?.length ? (
                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                          Seq
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Account Details
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Financials
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status & Timing
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider max-w-[200px]">
                          Reference / Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {history.allocations.map((alloc) => (
                        <tr
                          key={alloc.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4 text-sm text-gray-500 font-mono">
                            #{alloc.sequenceNumber}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {alloc.dvaBankName}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-mono text-gray-500">
                                  {alloc.dvaAccountNumber}
                                </span>
                                <button
                                  onClick={() =>
                                    handleCopy(
                                      alloc.dvaAccountNumber,
                                      "Account Number",
                                    )
                                  }
                                  className="text-gray-400 hover:text-[#0096FF]"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1 text-sm">
                              <div className="flex justify-between gap-4">
                                <span className="text-gray-500 text-xs">
                                  Expected:
                                </span>
                                <span className="font-medium text-gray-900">
                                  {formatPrice(alloc.amountExpected)}
                                </span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-gray-500 text-xs">
                                  Received:
                                </span>
                                <span className="font-semibold text-green-600">
                                  {alloc.amountReceived !== undefined
                                    ? formatPrice(alloc.amountReceived)
                                    : "—"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col items-start gap-1">
                              <span
                                className={clsx(
                                  "px-2 py-0.5 text-[10px] font-bold uppercase rounded border",
                                  getStatusBadge(alloc.status),
                                )}
                              >
                                {alloc.status}
                              </span>
                              <span className="text-[10px] text-gray-500 whitespace-nowrap">
                                {alloc.settledAt
                                  ? `Settled: ${format(new Date(alloc.settledAt), "MMM d, HH:mm")}`
                                  : `Created: ${format(new Date(alloc.createdAt), "MMM d, HH:mm")}`}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 max-w-[200px]">
                            <div className="flex flex-col gap-1">
                              {alloc.monnifyTransactionReference && (
                                <div
                                  className="text-[10px] text-gray-600 truncate"
                                  title={alloc.monnifyTransactionReference}
                                >
                                  <span className="font-semibold text-gray-900">
                                    Ref:
                                  </span>{" "}
                                  {alloc.monnifyTransactionReference}
                                </div>
                              )}
                              {alloc.reason && (
                                <div
                                  className="text-[10px] text-purple-700 bg-purple-50 p-1 rounded italic line-clamp-2"
                                  title={alloc.reason}
                                >
                                  <span className="font-semibold not-italic">
                                    Note:
                                  </span>{" "}
                                  {alloc.reason}
                                </div>
                              )}
                              {!alloc.monnifyTransactionReference &&
                                !alloc.reason && (
                                  <span className="text-xs text-gray-400 italic">
                                    No notes
                                  </span>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 border border-gray-200 border-dashed rounded-lg bg-gray-50">
                  <p className="text-gray-500 text-sm">
                    No allocation history available yet.
                  </p>
                </div>
              )}
            </div>
            {!isCompleted && (
              <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Waive Outstanding Balance
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Waiving the balance will mark this booking as fully settled.
                  This action cannot be undone.
                </p>
                <TextAreaInput
                  id="waiveReason"
                  label="Reason for waiving"
                  placeholder="E.g., Customer compensation, system error, managerial override..."
                  value={waiveReason}
                  onChange={(e) => setWaiveReason(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={handleWaiveBalance}
                    isLoading={waiveBalanceMutation.isPending}
                    variant="danger"
                    disabled={!waiveReason.trim()}
                  >
                    Waive Balance
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
