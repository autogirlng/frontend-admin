"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { format, addMinutes } from "date-fns"; // ✅ Import addMinutes
import { useEditTrip } from "@/lib/hooks/trips-management/useTrips";
import { useGetBookingTypes } from "@/lib/hooks/set-up/booking-types/useBookingTypes";
import { Trip, EditTripPayload } from "./types";
import { BookingType } from "@/components/set-up-management/bookings-types/types"; // Ensure this path is correct for your BookingType definition
import TextInput from "@/components/generic/ui/TextInput";
import AddressInput from "@/components/generic/ui/AddressInput";
import Select, { Option } from "@/components/generic/ui/Select";
import Button from "@/components/generic/ui/Button";

interface EditTripModalProps {
  trip: Trip;
  onClose: () => void;
}

export function EditTripModal({ trip, onClose }: EditTripModalProps) {
  // --- State ---
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

  // --- Hooks ---
  const editMutation = useEditTrip();
  const { data: bookingTypes = [] } = useGetBookingTypes();

  const bookingTypeOptions: Option[] = bookingTypes.map((bt: BookingType) => ({
    id: bt.id,
    name: bt.name,
  }));

  // --- Initialize State ---
  useEffect(() => {
    if (trip) {
      const start = new Date(trip.startDateTime);
      const end = new Date(trip.endDateTime);

      setStartDate(format(start, "yyyy-MM-dd"));
      setStartTime(format(start, "HH:mm"));
      setEndDate(format(end, "yyyy-MM-dd"));
      setEndTime(format(end, "HH:mm"));

      // Attempt to pre-fill booking type ID if possible
      // (Assuming we can match by name if ID isn't available in the trip list object,
      // or if you update your Trip type to include bookingTypeId, use that instead)
      const matchingType = bookingTypes.find(
        (bt) => bt.name === trip.bookingTypeName
      );
      if (matchingType) {
        setBookingTypeId(matchingType.id);
      }
    }
  }, [trip, bookingTypes]);

  // ✅ NEW: Auto-calculate End Date/Time logic
  useEffect(() => {
    // Only run if we have a start date, start time, and a selected booking type
    if (startDate && startTime && bookingTypeId) {
      const selectedType = bookingTypes.find((t) => t.id === bookingTypeId);

      if (selectedType && selectedType.durationInMinutes) {
        // Create date object from start inputs
        const start = new Date(`${startDate}T${startTime}`);

        // Add duration
        const end = addMinutes(start, selectedType.durationInMinutes);

        // Update end state
        setEndDate(format(end, "yyyy-MM-dd"));
        setEndTime(format(end, "HH:mm"));
      }
    }
  }, [startDate, startTime, bookingTypeId, bookingTypes]);

  // --- Handlers ---
  const handleSubmit = () => {
    const newStartDateTime = `${startDate}T${startTime}:00.000Z`; // Simplified ISO construction
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Edit Trip Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Locations */}
          <div className="space-y-4">
            <AddressInput
              label="Pickup Location"
              id="pickup"
              value={pickupLocation}
              onChange={setPickupLocation}
              onLocationSelect={(coords) =>
                setPickupCoords({ lat: coords.latitude, lng: coords.longitude })
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

          {/* Booking Type */}
          <Select
            label="Booking Type"
            options={bookingTypeOptions}
            selected={
              bookingTypeOptions.find((o) => o.id === bookingTypeId) || null
            }
            onChange={(opt) => setBookingTypeId(opt.id)}
            placeholder="Select new booking type"
          />

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Start Date"
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <TextInput
              label="Start Time"
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <TextInput
              label="End Date"
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              // Make end date semi-readonly/disabled if auto-calc is preferred,
              // or leave editable for manual overrides. Keeping it editable for now.
            />
            <TextInput
              label="End Time"
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t rounded-b-lg">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={editMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={editMutation.isPending}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
