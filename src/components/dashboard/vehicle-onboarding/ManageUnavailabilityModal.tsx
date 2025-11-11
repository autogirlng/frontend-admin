// app/dashboard/vehicle-onboarding/ManageUnavailabilityModal.tsx
"use client";

import React, { useState } from "react";
import { X, AlertCircle, Calendar, Trash2, Info } from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  useGetVehicleUnavailability,
  useCreateVehicleUnavailability,
  useDeleteVehicleUnavailability,
} from "@/lib/hooks/vehicle-onboarding/useVehiclesOnboarding";
import {
  CreateUnavailabilityPayload,
  UnavailabilityPeriod,
  UnavailabilityReason,
} from "./types";
import CustomLoader from "@/components/generic/CustomLoader";
import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import toast from "react-hot-toast";

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
  // --- State for new period form ---
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
      toast.error("End date/time must be after start date/time.");
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
          // Reset form
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

  // --- Render Function for the List ---
  const renderCurrentPeriods = () => {
    if (isLoadingPeriods) {
      return (
        <div className="h-full flex items-center justify-center">
          <CustomLoader />
        </div>
      );
    }
    if (isError) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-red-600">
          <AlertCircle className="h-8 w-8" />
          <span className="font-semibold mt-2">Failed to load periods.</span>
        </div>
      );
    }
    if (!periods || periods.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-gray-500">
          <Calendar className="h-12 w-12 text-gray-400" />
          <p className="font-semibold mt-2">No active periods</p>
          <p className="text-sm">This vehicle is fully available.</p>
        </div>
      );
    }

    // ✅ This div now controls the scrolling
    return (
      <div className="space-y-3 pr-2 overflow-y-auto">
        {periods.map((period) => (
          <div
            key={period.id}
            className="p-3 bg-gray-50 rounded-lg border flex items-start justify-between"
          >
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{period.reason}</p>
              <p className="text-sm text-gray-600">
                {format(parseISO(period.startDateTime), "MMM d, yyyy h:mm a")}{" "}
                to
              </p>
              <p className="text-sm text-gray-600">
                {format(parseISO(period.endDateTime), "MMM d, yyyy h:mm a")}
              </p>
              {period.notes && (
                <p className="text-xs text-gray-500 mt-1">
                  Notes: {period.notes}
                </p>
              )}
            </div>
            <Button
              variant="danger"
              size="sm"
              className="w-auto p-2"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* ✅ CHANGED: Increased max-width for two-column layout */}
      <div className="relative w-full max-w-4xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-xl font-semibold leading-6 text-gray-900">
              Manage Unavailability
            </h3>
            <p className="text-sm text-gray-500">{vehicleName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={createMutation.isPending || deleteMutation.isPending}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ✅ CHANGED: Two-column layout for content */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* --- Column 1: Add New Period Form --- */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 p-6 border-r border-gray-200"
          >
            <h4 className="text-lg font-semibold text-gray-800">
              Add New Period
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                id="startDate"
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
              <TextInput
                id="startTime"
                label="Start Time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                id="endDate"
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                required
              />
              <TextInput
                id="endTime"
                label="End Time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
            <Select
              label="Reason"
              options={reasonOptions}
              selected={
                reasonOptions.find((o) => o.id === reason) || reasonOptions[0]
              }
              onChange={(opt) => setReason(opt.id as UnavailabilityReason)}
            />
            <TextAreaInput
              label="Notes (Optional)"
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                variant="primary"
                isLoading={createMutation.isPending}
                className="w-full md:w-auto"
              >
                Add Unavailability
              </Button>
            </div>
          </form>

          {/* --- Column 2: Current Periods List --- */}
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Current Periods
            </h4>
            {/* ✅ This div controls the height and scroll of the list */}
            <div
              className="h-[420px] relative" // Fixed height
            >
              {renderCurrentPeriods()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t rounded-b-lg">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={createMutation.isPending || deleteMutation.isPending}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
