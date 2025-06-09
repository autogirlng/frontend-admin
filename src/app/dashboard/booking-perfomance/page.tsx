"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import VehicleSelector from "@/components/dashboard/booking-perfomance/VehicleSelector";
import BookingCalendar from "@/components/dashboard/booking-perfomance/BookingCalender";
import { vehiclesData } from "@/utils/data";
import BookingHeader from "@/components/dashboard/booking-perfomance/BookingHeader";
import { useRouter } from "next/navigation";
import { LocalRoute } from "@/utils/LocalRoutes";

type Props = {};

function BookingPerfomance({}: Props) {
  const router = useRouter();
  const [selectedVehicle, setSelectedVehicle] = useState("all-vehicles");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    console.log("Selected vehicle:", vehicleId);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);

    if (date) {
      const formatted = date.toISOString().split("T")[0];
      router.push(`/${LocalRoute.bookingPage}/${formatted}`);
    }

    console.log("Selected date:", date);
  };

  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeSlot(slotId);
    console.log("Selected time slot:", slotId);
  };

  return (
    <DashboardLayout title="Booking Perfomance" currentPage="Dashboard">
      <div className=" flex flex-col gap-6 mx-auto">
        <BookingHeader />
        <div className=" w-full bg-[#F7F9FC] rounded-lg shadow-sm p-6">
          <VehicleSelector
            onSelect={setSelectedVehicle}
            selectedVehicle={selectedVehicle}
            vehicles={vehiclesData}
          />
        </div>
        <BookingCalendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </div>
    </DashboardLayout>
  );
}

export default BookingPerfomance;
