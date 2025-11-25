// app/dashboard/vehicle-onboarding/ManageUnavailabilityModal.tsx
"use client";

import React, { useState } from "react";
import { X, AlertCircle, Calendar, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  useGetVehicleUnavailability,
  useCreateVehicleUnavailability,
  useDeleteVehicleUnavailability,
} from "@/lib/hooks/vehicle-onboarding/useVehiclesOnboarding";
import { CreateUnavailabilityPayload, UnavailabilityReason } from "./types";
import CustomLoader from "@/components/generic/CustomLoader";
import Button from "@/components/generic/ui/Button";
import Select, { Option } from "@/components/generic/ui/Select";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import toast from "react-hot-toast";

// ✅ Import your custom picker (Adjust path as needed)
import { ModernDateTimePicker } from "@/components/generic/ui/ModernDateTimePicker";

interface ManageUnavailabilityModalProps {
  vehicleId: string;
  vehicleName: string;
  onClose: () => void;
}

const reasonOptions: Option[] = [
  { id: "MAINTENANCE", name: "Maintenance" },
  { id: "COMPANY_USE", name: "Company Use" },
  { id: "UNAVAILABLE", name: "Unavailable" },
];

export function ManageUnavailabilityModal({
  vehicleId,
  vehicleName,
  onClose,
}: ManageUnavailabilityModalProps) {
  // --- State ---
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState<UnavailabilityReason>("MAINTENANCE");
  const [notes, setNotes] = useState("");

  // --- API Hooks ---
  const {
    data: periods,
    isLoading: isLoadingPeriods,
    isError,
  } = useGetVehicleUnavailability(vehicleId);

  const createMutation = useCreateVehicleUnavailability();
  const deleteMutation = useDeleteVehicleUnavailability();

  // --- Handlers ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !startTime || !endDate || !endTime) {
      toast.error("Please fill in all date and time fields.");
      return;
    }

    const startDateTime = `${startDate}T${startTime}:00`;
    const endDateTime = `${endDate}T${endTime}:00`;

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      toast.error("End date must be after start date.");
      return;
    }

    const payload: CreateUnavailabilityPayload = {
      startDateTime,
      endDateTime,
      reason,
      notes,
    };

    createMutation.mutate(
      { vehicleId, payload },
      {
        onSuccess: () => {
          setStartDate("");
          setStartTime("");
          setEndDate("");
          setEndTime("");
          setNotes("");
          toast.success("New period added.");
        },
      }
    );
  };

  const handleDelete = (periodId: string) => {
    deleteMutation.mutate({ vehicleId, unavailabilityId: periodId });
  };

  // --- Render List Helper ---
  const renderCurrentPeriods = () => {
    if (isLoadingPeriods) {
      return (
        <div className="flex h-32 items-center justify-center">
          <CustomLoader />
        </div>
      );
    }
    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center text-red-600 py-8">
          <AlertCircle className="h-8 w-8" />
          <span className="font-semibold mt-2">Failed to load periods.</span>
        </div>
      );
    }
    if (!periods || periods.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-500 py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <Calendar className="h-10 w-10 text-gray-400 mb-2" />
          <p className="font-medium text-sm">No active periods</p>
          <p className="text-xs">Vehicle is fully available.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {periods.map((period) => (
          <div
            key={period.id}
            className="p-3 bg-white border border-gray-200 flex items-start justify-between gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-800 text-sm">
                  {period.reason}
                </span>
              </div>
              <div className="text-xs text-gray-600 flex flex-col sm:flex-row sm:gap-1">
                <span>
                  {format(parseISO(period.startDateTime), "MMM d, h:mm a")}
                </span>
                <span className="hidden sm:inline">→</span>
                <span className="sm:hidden">to</span>
                <span>
                  {format(parseISO(period.endDateTime), "MMM d, h:mm a")}
                </span>
              </div>
              {period.notes && (
                <p className="text-xs text-gray-500 mt-1 italic truncate">
                  {period.notes}
                </p>
              )}
            </div>
            <Button
              variant="danger"
              size="sm"
              className="h-8 w-8 p-0 flex items-center justify-center flex-shrink-0"
              onClick={() => handleDelete(period.id)}
              isLoading={
                deleteMutation.isPending &&
                deleteMutation.variables?.unavailabilityId === period.id
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
      {/* Modal Container */}
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-4xl bg-white sm:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex-none flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              Unavailability
            </h3>
            <p className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-md">
              {vehicleName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            disabled={createMutation.isPending || deleteMutation.isPending}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Form Column */}
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 bg-white border-b md:border-b-0 md:border-r border-gray-200"
            >
              <h4 className="text-sm uppercase tracking-wide font-semibold text-gray-500 mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Add New Period
              </h4>

              <div className="space-y-5">
                {/* ✅ REPLACED: Using ModernDateTimePicker */}
                <ModernDateTimePicker
                  label="Start Date & Time"
                  dateValue={startDate}
                  timeValue={startTime}
                  onDateChange={setStartDate}
                  onTimeChange={setStartTime}
                  minDate={new Date().toISOString().split("T")[0]}
                  required
                />

                <ModernDateTimePicker
                  label="End Date & Time"
                  dateValue={endDate}
                  timeValue={endTime}
                  onDateChange={setEndDate}
                  onTimeChange={setEndTime}
                  minDate={startDate} // Prevent ending before starting date
                  required
                />

                <Select
                  label="Reason"
                  options={reasonOptions}
                  selected={
                    reasonOptions.find((o) => o.id === reason) ||
                    reasonOptions[0]
                  }
                  onChange={(opt) => setReason(opt.id as UnavailabilityReason)}
                />

                <TextAreaInput
                  label="Notes"
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Optional details..."
                />

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={createMutation.isPending}
                  className="w-full py-2.5 shadow-sm mt-2"
                >
                  Add Unavailability
                </Button>
              </div>
            </form>

            {/* List Column */}
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm uppercase tracking-wide font-semibold text-gray-500">
                  Existing Periods
                </h4>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                  {periods?.length || 0}
                </span>
              </div>

              <div className="md:max-h-[400px] md:overflow-y-auto md:pr-1 custom-scrollbar">
                {renderCurrentPeriods()}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-none p-4 bg-white border-t border-gray-100 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="w-full sm:w-auto"
            disabled={createMutation.isPending || deleteMutation.isPending}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
