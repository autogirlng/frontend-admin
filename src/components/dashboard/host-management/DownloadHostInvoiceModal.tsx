import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "@/components/generic/ui/Button";
import { DatePickerWithRange } from "../availability/DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { useDownloadHostInvoice } from "@/lib/hooks/host-management/useDownloadHostInvoice";

interface DownloadHostInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostId: string;
}

export const DownloadHostInvoiceModal = ({
  isOpen,
  onClose,
  hostId,
}: DownloadHostInvoiceModalProps) => {
  const { mutate: downloadHostInvoice, isPending } = useDownloadHostInvoice();

  const [filters, setFilters] = useState<{
    dateRange: DateRange | null;
  }>({
    dateRange: null,
  });

  useEffect(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date();
    setFilters({ dateRange: { from: startOfMonth, to: today } });
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let startDate = filters.dateRange?.from;
    let endDate = filters.dateRange?.to;
    if (startDate && endDate) {
      startDate = new Date(startDate);
      endDate = new Date(endDate);
      downloadHostInvoice({
        hostId,
        startDate: encodeURIComponent(startDate.toISOString()),
        endDate: encodeURIComponent(endDate.toISOString()),
      });
    }
  };

  const handleDateChange = (dateRange: DateRange | undefined) => {
    setFilters((prev) => ({ ...prev, dateRange: dateRange || null }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Download Host Invoice
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <DatePickerWithRange
            setDate={handleDateChange}
            date={filters.dateRange || undefined}
          />

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-2">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isPending}
              disabled={!filters.dateRange?.from || !filters.dateRange?.to}
            >
              Download
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
