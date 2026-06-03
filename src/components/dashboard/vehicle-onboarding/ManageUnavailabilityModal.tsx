"use client";

import React, { useState } from "react";
import {
  X,
  AlertCircle,
  Calendar,
  Trash2,
  StopCircle,
  Clock,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  useGetVehicleUnavailability,
  useCreateVehicleUnavailability,
  useDeleteVehicleUnavailability,
  useEndVehicleUnavailabilityEarly,
} from "@/lib/hooks/vehicle-onboarding/useVehiclesOnboarding";
import {
  CreateUnavailabilityPayload,
  UnavailabilityPeriod,
  UnavailabilityReason,
} from "./types";
import CustomLoader from "@/components/generic/CustomLoader";
import Button from "@/components/generic/ui/Button";
import Select, { Option } from "@/components/generic/ui/Select";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import toast from "react-hot-toast";

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
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState<UnavailabilityReason>("MAINTENANCE");
  const [notes, setNotes] = useState("");
  const [endingPeriodId, setEndingPeriodId] = useState<string | null>(null);
  const [earlyEndDate, setEarlyEndDate] = useState("");
  const [earlyEndTime, setEarlyEndTime] = useState("");

  const {
    data: periods,
    isLoading: isLoadingPeriods,
    isError,
  } = useGetVehicleUnavailability(vehicleId);

  const createMutation = useCreateVehicleUnavailability();
  const deleteMutation = useDeleteVehicleUnavailability();
  const endEarlyMutation = useEndVehicleUnavailabilityEarly();

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
      },
    );
  };

  const handleDelete = (periodId: string) => {
    deleteMutation.mutate({ vehicleId, unavailabilityId: periodId });
  };

  const handleOpenEndEarly = (period: UnavailabilityPeriod) => {
    const now = new Date();
    setEarlyEndDate(format(now, "yyyy-MM-dd"));
    setEarlyEndTime(format(now, "HH:mm"));
    setEndingPeriodId(period.id);
  };

  const handleConfirmEndEarly = (period: UnavailabilityPeriod) => {
    if (!earlyEndDate || !earlyEndTime) {
      toast.error("Please select a date and time to end the unavailability.");
      return;
    }

    const startDateTime = new Date(period.startDateTime);
    const endEarlyDateTime = new Date(`${earlyEndDate}T${earlyEndTime}:00`);

    if (endEarlyDateTime <= startDateTime) {
      toast.error("The end time must be after the start time.");
      return;
    }

    const endedAt = format(endEarlyDateTime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    endEarlyMutation.mutate(
      { vehicleId, unavailabilityId: period.id, endedAt },
      {
        onSuccess: () => {
          setEndingPeriodId(null);
          setEarlyEndDate("");
          setEarlyEndTime("");
        },
      },
    );
  };

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
        <div className="flex flex-col items-center justify-center text-gray-500 py-8 bg-white sm:bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <Calendar className="h-10 w-10 text-gray-400 mb-2" />
          <p className="font-medium text-sm">No active periods</p>
          <p className="text-xs">Vehicle is fully available.</p>
        </div>
      );
    }

    const now = new Date();

    return (
      <div className="space-y-4">
        {periods.map((period) => {
          const isPeriodActive = new Date(period.endDateTime) > now;
          const isEndingThis = endingPeriodId === period.id;

          return (
            <div
              key={period.id}
              className={`p-4 bg-white border rounded-xl flex flex-col transition-all ${
                !isPeriodActive && !isEndingThis
                  ? "border-gray-200 opacity-60 bg-gray-50/50"
                  : isEndingThis
                    ? "border-blue-300 ring-4 ring-blue-50 shadow-md"
                    : "border-gray-300 shadow-sm hover:shadow-md"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`font-semibold text-sm ${
                        isPeriodActive ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {period.reason}
                    </span>
                    {!isPeriodActive && (
                      <span className="text-[10px] uppercase tracking-wider bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                        Completed
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-600 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span>
                        {format(
                          parseISO(period.startDateTime),
                          "MMM d, h:mm a",
                        )}
                      </span>
                    </div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold">
                      to
                    </span>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span>
                        {format(parseISO(period.endDateTime), "MMM d, h:mm a")}
                      </span>
                    </div>
                  </div>

                  {period.notes && (
                    <p className="text-xs text-gray-500 mt-2 bg-gray-50/50 p-2 rounded-md border border-gray-100 italic line-clamp-2">
                      "{period.notes}"
                    </p>
                  )}
                </div>
                {!isEndingThis && (
                  <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 sm:border-transparent sm:flex-shrink-0 w-full sm:w-auto">
                    {isPeriodActive && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="flex-1 sm:flex-none h-9 px-4 text-xs font-medium flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm"
                        onClick={() => handleOpenEndEarly(period)}
                      >
                        <StopCircle className="h-4 w-4 mr-2" />
                        End Early
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      className={`h-9 w-10 sm:w-9 p-0 flex items-center justify-center flex-shrink-0 ${
                        !isPeriodActive ? "flex-1 sm:flex-none w-full" : ""
                      }`}
                      onClick={() => handleDelete(period.id)}
                      isLoading={
                        deleteMutation.isPending &&
                        deleteMutation.variables?.unavailabilityId === period.id
                      }
                      title="Delete record"
                    >
                      <Trash2 className="h-4 w-4" />
                      {!isPeriodActive && (
                        <span className="sm:hidden ml-2">Delete</span>
                      )}
                    </Button>
                  </div>
                )}
              </div>
              {isEndingThis && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <h5 className="text-sm font-semibold text-gray-800">
                      Select End Time
                    </h5>
                  </div>

                  <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 space-y-4">
                    <ModernDateTimePicker
                      label="Custom End Date & Time"
                      dateValue={earlyEndDate}
                      timeValue={earlyEndTime}
                      onDateChange={setEarlyEndDate}
                      onTimeChange={setEarlyEndTime}
                      minDate={period.startDateTime.split("T")[0]}
                      required
                    />

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setEndingPeriodId(null)}
                        disabled={endEarlyMutation.isPending}
                        className="bg-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleConfirmEndEarly(period)}
                        isLoading={
                          endEarlyMutation.isPending &&
                          endEarlyMutation.variables?.unavailabilityId ===
                            period.id
                        }
                      >
                        Confirm End
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
      <div className="relative w-full h-[95vh] sm:h-auto sm:max-h-[90vh] sm:max-w-4xl bg-gray-50 sm:bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200">
        <div className="flex-none flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 bg-white z-10">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
              Manage Unavailability
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[250px] sm:max-w-md mt-0.5">
              {vehicleName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            disabled={
              createMutation.isPending ||
              deleteMutation.isPending ||
              endEarlyMutation.isPending
            }
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 min-h-full">
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 bg-white border-b md:border-b-0 md:border-r border-gray-200 md:col-span-2"
            >
              <h4 className="text-xs sm:text-sm uppercase tracking-wider font-bold text-gray-500 mb-5 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Add New Period
              </h4>

              <div className="space-y-5">
                <ModernDateTimePicker
                  label="Start Date & Time"
                  dateValue={startDate}
                  timeValue={startTime}
                  onDateChange={setStartDate}
                  onTimeChange={setStartTime}
                  minDate={format(new Date(), "yyyy-MM-dd")}
                  required
                />

                <ModernDateTimePicker
                  label="End Date & Time"
                  dateValue={endDate}
                  timeValue={endTime}
                  onDateChange={setEndDate}
                  onTimeChange={setEndTime}
                  minDate={startDate}
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
                  rows={3}
                  placeholder="Optional details (e.g., specific repair shop, employee name)..."
                />

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={createMutation.isPending}
                  className="w-full py-2.5 shadow-sm mt-4"
                >
                  Save Unavailability
                </Button>
              </div>
            </form>

            <div className="p-4 sm:p-6 bg-gray-50 md:col-span-3">
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-xs sm:text-sm uppercase tracking-wider font-bold text-gray-500">
                  Existing Periods
                </h4>
                <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full">
                  {periods?.length || 0}
                </span>
              </div>

              <div className="md:max-h-[500px] md:overflow-y-auto md:pr-2 custom-scrollbar">
                {renderCurrentPeriods()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-none p-4 sm:p-5 bg-white border-t border-gray-200 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="w-full sm:w-32 py-2.5 font-medium"
            disabled={
              createMutation.isPending ||
              deleteMutation.isPending ||
              endEarlyMutation.isPending
            }
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
