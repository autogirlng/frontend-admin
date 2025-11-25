"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, MapPin, Briefcase } from "lucide-react";
import { format, addMinutes } from "date-fns";
import { useEditTrip } from "@/lib/hooks/trips-management/useTrips";
import { useGetBookingTypes } from "@/lib/hooks/set-up/booking-types/useBookingTypes";
import { Trip, EditTripPayload } from "./types";
import { BookingType } from "@/components/set-up-management/bookings-types/types";
import AddressInput from "@/components/generic/ui/AddressInput";
import Select, { Option } from "@/components/generic/ui/Select";
import Button from "@/components/generic/ui/Button";
import { ModernDateTimePicker } from "@/components/generic/ui/ModernDateTimePicker";

interface EditTripModalProps {
  trip: Trip;
  onClose: () => void;
}

export function EditTripModal({ trip, onClose }: EditTripModalProps) {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const [pickupLocation, setPickupLocation] = useState(
    trip.pickupLocation || ""
  );
  const [pickupCoords, setPickupCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [dropoffLocation, setDropoffLocation] = useState("");
  const [dropoffCoords, setDropoffCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [bookingTypeId, setBookingTypeId] = useState("");

  const editMutation = useEditTrip();
  const { data: bookingTypes = [] } = useGetBookingTypes();

  const bookingTypeOptions: Option[] = bookingTypes.map((bt: BookingType) => ({
    id: bt.id,
    name: bt.name,
  }));

  useEffect(() => {
    if (trip) {
      const start = new Date(trip.startDateTime);
      const end = new Date(trip.endDateTime);

      setStartDate(format(start, "yyyy-MM-dd"));
      setStartTime(format(start, "HH:mm"));
      setEndDate(format(end, "yyyy-MM-dd"));
      setEndTime(format(end, "HH:mm"));

      const matchingType = bookingTypes.find(
        (bt) => bt.name === trip.bookingTypeName
      );
      if (matchingType) {
        setBookingTypeId(matchingType.id);
      }
    }
  }, [trip, bookingTypes]);

  useEffect(() => {
    if (startDate && startTime && bookingTypeId) {
      const selectedType = bookingTypes.find((t) => t.id === bookingTypeId);

      if (selectedType && selectedType.durationInMinutes) {
        const start = new Date(`${startDate}T${startTime}`);
        const end = addMinutes(start, selectedType.durationInMinutes);
        setEndDate(format(end, "yyyy-MM-dd"));
        setEndTime(format(end, "HH:mm"));
      }
    }
  }, [startDate, startTime, bookingTypeId, bookingTypes]);

  const handleSubmit = () => {
    const newStartDateTime = `${startDate}T${startTime}:00.000Z`;
    const newEndDateTime = `${endDate}T${endTime}:00.000Z`;

    const payload: EditTripPayload = {
      newStartDateTime,
      newEndDateTime,
      newPickupLocation: pickupLocation,
      newDropoffLocation: dropoffLocation || undefined,
      newPickupLatitude: pickupCoords?.lat,
      newPickupLongitude: pickupCoords?.lng,
      newDropoffLatitude: dropoffCoords?.lat,
      newDropoffLongitude: dropoffCoords?.lng,
      newBookingTypeId: bookingTypeId || undefined,
    };

    editMutation.mutate({ tripId: trip.id, payload }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl bg-white sm:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        <div className="flex-none flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              Edit Trip Details
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Update location or schedule
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            disabled={editMutation.isPending}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:p-6 space-y-6">
          <div className="space-y-4 bg-white p-4 border border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-blue-500" /> Route Details
            </h4>
            <div className="space-y-4">
              <AddressInput
                label="Pickup Location"
                id="pickup"
                value={pickupLocation}
                onChange={setPickupLocation}
                onLocationSelect={(coords) =>
                  setPickupCoords({
                    lat: coords.latitude,
                    lng: coords.longitude,
                  })
                }
              />
              <AddressInput
                label="Dropoff Location"
                id="dropoff"
                value={dropoffLocation}
                onChange={setDropoffLocation}
                onLocationSelect={(coords) =>
                  setDropoffCoords({
                    lat: coords.latitude,
                    lng: coords.longitude,
                  })
                }
                placeholder="Enter new dropoff location (optional)"
              />
            </div>
          </div>
          <div className="space-y-4 bg-white p-4 border border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-purple-500" /> Trip Type
            </h4>
            <Select
              label="Booking Type"
              options={bookingTypeOptions}
              selected={
                bookingTypeOptions.find((o) => o.id === bookingTypeId) || null
              }
              onChange={(opt) => setBookingTypeId(opt.id)}
              placeholder="Select new booking type"
            />
          </div>
          <div className="space-y-4 bg-white p-4 border border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-orange-500" /> Schedule
            </h4>

            <div className="space-y-5">
              <ModernDateTimePicker
                label="Start Date & Time"
                dateValue={startDate}
                timeValue={startTime}
                onDateChange={setStartDate}
                onTimeChange={setStartTime}
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
        </div>
        <div className="flex-none flex-wrap p-4 bg-white border-t border-gray-100 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={editMutation.isPending}
            className="flex-1 sm:flex-none w-[230px] my-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={editMutation.isPending}
            className="flex-1 sm:flex-none w-[230px] my-1"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
