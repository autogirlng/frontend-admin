"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  Plus,
  Trash2,
  User,
  Calendar,
  Car,
  CheckCircle,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";

// Components
import TextInput from "@/components/generic/ui/TextInput";
import Select from "@/components/generic/ui/Select";
import Button from "@/components/generic/ui/Button";
import CustomBack from "@/components/generic/CustomBack";

// Hooks & Types
import {
  useGetVehiclesForAdmin,
  useGetBookingTypes,
  useCreatePastBooking,
} from "./usePastBooking";
import { Vehicle, PastBookingSegmentPayload } from "./past-types";
import { ModernDateTimePicker } from "@/components/generic/ui/ModernDateTimePicker";

export default function CreatePastBookingPage() {
  // --- State: Vehicle Selection ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // --- State: Form Data ---
  const [guestDetails, setGuestDetails] = useState({
    guestFullName: "",
    guestEmail: "",
    guestPhoneNumber: "",
    bookedAtDate: "",
    bookedAtTime: "10:00",
    totalPrice: "",
  });

  // --- State: Segments ---
  const [segments, setSegments] = useState<PastBookingSegmentPayload[]>([
    {
      bookingTypeId: "",
      startDate: "",
      startTime: "09:00",
      pickupLocation: "",
      dropoffLocation: "",
    },
  ]);

  // --- Queries ---
  const {
    data: vehicleData,
    isLoading: isLoadingVehicles,
    isError: isVehicleError,
    error: vehicleError,
    refetch: refetchVehicles,
  } = useGetVehiclesForAdmin(searchTerm);

  const { data: bookingTypeData, isLoading: isLoadingBookingTypes } =
    useGetBookingTypes();

  const createMutation = useCreatePastBooking();

  // --- ✅ DEBUGGING & SAFE EXTRACTION: VEHICLES ---
  const vehicles: Vehicle[] = useMemo(() => {
    if (!vehicleData) return [];
    if (vehicleData.data && Array.isArray(vehicleData.data.content)) {
      return vehicleData.data.content;
    }
    const rawData = vehicleData as any;
    if (rawData.content && Array.isArray(rawData.content)) {
      return rawData.content as Vehicle[];
    }
    return [];
  }, [vehicleData]);

  // --- ✅ DEBUGGING & SAFE EXTRACTION: BOOKING TYPES ---
  const bookingTypeOptions = useMemo(() => {
    if (!bookingTypeData) return [];
    let typesArray: any[] = [];
    if (bookingTypeData.data && Array.isArray(bookingTypeData.data)) {
      typesArray = bookingTypeData.data;
    } else if (Array.isArray(bookingTypeData)) {
      typesArray = bookingTypeData;
    }
    return typesArray.map((bt: any) => ({
      id: bt.id,
      name: `${bt.name} (${bt.durationInMinutes} mins)`,
    }));
  }, [bookingTypeData]);

  // --- Handlers ---
  const handleGuestChange = (field: string, value: string) => {
    setGuestDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSegmentChange = (index: number, field: string, value: string) => {
    setSegments((prev) =>
      prev.map((seg, i) => (i === index ? { ...seg, [field]: value } : seg))
    );
  };

  const addSegment = () => {
    setSegments((prev) => [
      ...prev,
      {
        bookingTypeId: "",
        startDate: "",
        startTime: "09:00",
        pickupLocation: "",
        dropoffLocation: "",
      },
    ]);
  };

  const removeSegment = (index: number) => {
    if (segments.length > 1) {
      setSegments((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVehicle) {
      toast.error("Please select a vehicle.");
      return;
    }
    if (!guestDetails.bookedAtDate || !guestDetails.totalPrice) {
      toast.error("Please fill in all booking details.");
      return;
    }

    const bookedAtISO = `${guestDetails.bookedAtDate}T${guestDetails.bookedAtTime}:00`;
    const formattedSegments = segments.map((seg) => ({
      ...seg,
      startTime:
        seg.startTime.length === 5 ? `${seg.startTime}:00` : seg.startTime,
    }));

    createMutation.mutate(
      {
        vehicleId: selectedVehicle.id,
        userId: null,
        guestFullName: guestDetails.guestFullName,
        guestEmail: guestDetails.guestEmail,
        guestPhoneNumber: guestDetails.guestPhoneNumber,
        bookedAt: bookedAtISO,
        totalPrice: Number(guestDetails.totalPrice),
        paymentMethod: "OFFLINE",
        segments: formattedSegments,
      },
      {
        onSuccess: () => {
          toast.success("Booking Recorded!");
          setGuestDetails({
            guestFullName: "",
            guestEmail: "",
            guestPhoneNumber: "",
            bookedAtDate: "",
            bookedAtTime: "10:00",
            totalPrice: "",
          });
          setSegments([
            {
              bookingTypeId: "",
              startDate: "",
              startTime: "09:00",
              pickupLocation: "",
              dropoffLocation: "",
            },
          ]);
          setSelectedVehicle(null);
          setSearchTerm("");
        },
      }
    );
  };

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      <CustomBack />

      <main className="max-w-8xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Record Past Booking
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manually enter details for bookings that occurred outside the
            system.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Vehicle Selection */}
          <section className="">
            <div className="py-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-800">Vehicle Selection</h2>
            </div>
            <div className="py-6 space-y-4">
              {!selectedVehicle ? (
                <div className="space-y-4">
                  <TextInput
                    label="Search Vehicle"
                    id="vehicleSearch"
                    placeholder="Search by name, plate, or owner..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  {/* Vehicle List Result with Error Handling */}
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto py-2 min-h-[100px]">
                    {isLoadingVehicles ? (
                      <div className="flex flex-col items-center justify-center h-full py-8 text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin mb-2" />
                        <span>Loading vehicles...</span>
                      </div>
                    ) : isVehicleError ? (
                      <div className="flex flex-col items-center justify-center h-full py-8 text-red-500 text-sm">
                        <AlertCircle className="w-6 h-6 mb-2" />
                        <span>Failed to load vehicles.</span>
                        <button
                          type="button"
                          onClick={() => refetchVehicles()}
                          className="mt-2 text-blue-600 hover:underline flex items-center"
                        >
                          <RefreshCcw className="w-3 h-3 mr-1" /> Retry
                        </button>
                      </div>
                    ) : vehicles.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full py-8 text-gray-400">
                        <Car className="w-8 h-8 mb-2 opacity-50" />
                        <span>No vehicles found.</span>
                        {searchTerm && (
                          <span className="text-xs">
                            Try a different search term.
                          </span>
                        )}
                      </div>
                    ) : (
                      vehicles.map((vehicle: Vehicle) => (
                        <div
                          key={vehicle.id}
                          onClick={() => setSelectedVehicle(vehicle)}
                          className="p-3 bg-white border border-gray-200 cursor-pointer hover:border-blue-500 hover:ring-1 hover:ring-blue-500 transition-all flex justify-between items-center group"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {vehicle.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {vehicle.vehicleIdentifier} •{" "}
                              {vehicle.licensePlateNumber}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-blue-50 p-4 border border-blue-100">
                  <div>
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">
                      Selected Vehicle
                    </p>
                    <p className="font-bold text-lg text-gray-900">
                      {selectedVehicle.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedVehicle.licensePlateNumber} • Owned by{" "}
                      {selectedVehicle.ownerName}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedVehicle(null)}
                    className="bg-white"
                  >
                    Change
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Section 2: Guest & Financials */}
          <section className="">
            <div className="py-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-800">
                Guest & Payment Details
              </h2>
            </div>
            <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Guest Full Name"
                id="guestFullName"
                value={guestDetails.guestFullName}
                onChange={(e) =>
                  handleGuestChange("guestFullName", e.target.value)
                }
                required
              />
              <TextInput
                label="Guest Email"
                id="guestEmail"
                type="email"
                value={guestDetails.guestEmail}
                onChange={(e) =>
                  handleGuestChange("guestEmail", e.target.value)
                }
                required
              />
              <TextInput
                label="Guest Phone"
                id="guestPhoneNumber"
                value={guestDetails.guestPhoneNumber}
                onChange={(e) =>
                  handleGuestChange("guestPhoneNumber", e.target.value)
                }
                required
              />

              <div className="md:col-span-1 relative z-20">
                <ModernDateTimePicker
                  label="Booked Date & Time"
                  dateValue={guestDetails.bookedAtDate}
                  timeValue={guestDetails.bookedAtTime}
                  onDateChange={(val) => handleGuestChange("bookedAtDate", val)}
                  onTimeChange={(val) => handleGuestChange("bookedAtTime", val)}
                  required
                />
              </div>

              <TextInput
                label="Total Price"
                id="totalPrice"
                type="number"
                value={guestDetails.totalPrice}
                onChange={(e) =>
                  handleGuestChange("totalPrice", e.target.value)
                }
                required
              />
              <Select
                label="Payment Method"
                options={[{ id: "OFFLINE", name: "Offline / Cash / Transfer" }]}
                selected={{ id: "OFFLINE", name: "Offline / Cash / Transfer" }}
                disabled
              />
            </div>
          </section>

          {/* Section 3: Segments */}
          <section className="">
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <h2 className="font-semibold text-gray-800">Trip Segments</h2>
              </div>
            </div>

            <div className="py-6 space-y-6">
              {segments.map((segment, index) => (
                <div key={index} className="py-4 relative">
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Booking #{index + 1}
                    </span>
                    {segments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSegment(index)}
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="md:col-span-1">
                      <Select
                        label="Booking Type"
                        options={bookingTypeOptions}
                        selected={bookingTypeOptions.find(
                          (o) => o.id === segment.bookingTypeId
                        )}
                        onChange={(o) =>
                          handleSegmentChange(index, "bookingTypeId", o.id)
                        }
                        placeholder="Select Type"
                        disabled={isLoadingBookingTypes}
                      />
                    </div>

                    {/* ✅ CUSTOM DATE/TIME PICKER: Segment */}
                    <div className="md:col-span-2 relative z-10">
                      <ModernDateTimePicker
                        label="Trip Date & Time"
                        dateValue={segment.startDate}
                        timeValue={segment.startTime}
                        onDateChange={(val) =>
                          handleSegmentChange(index, "startDate", val)
                        }
                        onTimeChange={(val) =>
                          handleSegmentChange(index, "startTime", val)
                        }
                        required
                      />
                    </div>

                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        label="Pickup Location"
                        id={`pickup-${index}`}
                        value={segment.pickupLocation}
                        onChange={(e) =>
                          handleSegmentChange(
                            index,
                            "pickupLocation",
                            e.target.value
                          )
                        }
                        required
                      />
                      <TextInput
                        label="Dropoff Location"
                        id={`dropoff-${index}`}
                        value={segment.dropoffLocation}
                        onChange={(e) =>
                          handleSegmentChange(
                            index,
                            "dropoffLocation",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={addSegment}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Another Segment
              </Button>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending}
              className="w-full md:w-auto px-8"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Submit Past Booking
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
