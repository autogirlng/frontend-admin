"use client";

import React, { useState } from "react";
import { X, Calendar, FileText, AlertCircle, Plane } from "lucide-react";
import Button from "@/components/generic/ui/Button";
import { useSetVacationMode } from "./useVacationMode";
import { ModernDateTimePicker } from "@/components/generic/ui/ModernDateTimePicker";
import Select, { Option } from "@/components/generic/ui/Select";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";

interface VacationModeModalProps {
  hostId: string;
  hostName: string;
  onClose: () => void;
}

const reasonOptions: Option[] = [
  { id: "UNAVAILABLE", name: "Unavailable" },
  { id: "MAINTENANCE", name: "Maintenance" },
  { id: "COMPANY_USE", name: "Personal Use" },
];

export default function VacationModeModal({
  hostId,
  hostName,
  onClose,
}: VacationModeModalProps) {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const [selectedReason, setSelectedReason] = useState<Option>(
    reasonOptions[0]
  );
  const [notes, setNotes] = useState("");

  const { mutate: setVacationMode, isPending } = useSetVacationMode();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !startTime || !endDate || !endTime) {
      return;
    }

    const startDateTime = `${startDate}T${startTime}:00`;
    const endDateTime = `${endDate}T${endTime}:00`;

    setVacationMode(
      {
        hostId,
        payload: {
          startDateTime,
          endDateTime,
          reason: selectedReason.id,
          notes,
        },
      },
      {
        onSuccess: onClose,
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg bg-white sm:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        <div className="flex-none flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-2">
              <Plane className="h-5 w-5 text-blue-600" />
              Set Vacation Mode
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              For <span className="font-semibold">{hostName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            disabled={isPending}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:p-6 custom-scrollbar">
          <form
            id="vacation-form"
            onSubmit={handleSubmit}
            className="space-y-6 pb-20"
          >
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start shadow-sm">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-800 leading-relaxed">
                This will automatically set all vehicles belonging to this host
                as <strong>Unavailable</strong> for the selected duration.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-500" /> Duration
              </h4>

              <div className="space-y-6">
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
                  minDate={startDate}
                  required
                />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-500" /> Details
              </h4>

              <Select
                label="Reason"
                options={reasonOptions}
                selected={selectedReason}
                onChange={setSelectedReason}
                className="w-full"
              />

              <TextAreaInput
                label="Notes (Optional)"
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Additional context about this vacation..."
              />
            </div>
          </form>
        </div>
        <div className="flex-none p-4 bg-white border-t border-gray-100 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 sm:flex-none sm:w-32"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="vacation-form"
            variant="primary"
            isLoading={isPending}
            className="flex-1 sm:flex-none"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
