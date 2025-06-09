"use client";

import React, { useState } from "react";
import DateRangeCalendar from "@/components/shared/calendar";
import DottedLines from "@/components/shared/DottedLines";

// Mock Icons component - replace with your actual icons
const Icons = {
  ic_calendar: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  ic_chevron_down: (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  ),
  ic_user: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
};

interface Customer {
  customerId: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  location: string;
  hostName: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
}

interface OutskirtLocation {
  name: string;
  selected: boolean;
}

interface DailyRentalProps {
  steps: string[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  selectedCustomer: Customer | null;
  onBack: () => void;
}

const DailyRental: React.FC<DailyRentalProps> = ({
  steps,
  currentStep,
  setCurrentStep,
  selectedCustomer,
  onBack,
}) => {
  // State management
  const [pickupLocation, setPickupLocation] = useState(
    "123 Ozumba Mbadiwe avenue, Lagos state, Nigeria"
  );
  const [pickupDate, setPickupDate] = useState<Date | null>(
    new Date(2024, 7, 13)
  ); // 08/13/24
  const [pickupTime, setPickupTime] = useState("12:30PM");
  const [dropoffLocation, setDropoffLocation] = useState(
    "123 Ozumba Mbadiwe avenue, Lagos state, Nigeria"
  );
  const [areaOfUse, setAreaOfUse] = useState("Mainland,Island");
  const [purposeOfRide, setPurposeOfRide] = useState("");
  const [extraHours, setExtraHours] = useState(1);
  const [needsExtraTime, setNeedsExtraTime] = useState<boolean | null>(null);
  const [extraDetails, setExtraDetails] = useState("");

  // Calendar state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Customer info - use selected customer or default
  const customerInfo: CustomerInfo = selectedCustomer
    ? {
        name: selectedCustomer.customerName,
        email: selectedCustomer.email,
        phoneNumber: selectedCustomer.phoneNumber,
      }
    : {
        name: "Mamudu Jeffrey",
        email: "jeffmamudu@gmail.com",
        phoneNumber: "09039032585",
      };

  // Outskirt locations
  const [outskirtLocations, setOutskirtLocations] = useState<
    OutskirtLocation[]
  >([
    { name: "Ikorodu", selected: false },
    { name: "Bagagry", selected: false },
    { name: "Epe", selected: false },
    { name: "Ibeju-Lekki", selected: false },
    { name: "Ojo", selected: false },
    { name: "Alimosho", selected: false },
    { name: "Agege", selected: false },
    { name: "Ajah", selected: true },
    { name: "Agbara", selected: false },
    { name: "Sango", selected: true },
    { name: "Ijede", selected: false },
    { name: "Ikotun", selected: false },
    { name: "Egbeda", selected: false },
  ]);

  const handleOutskirtLocationChange = (locationName: string) => {
    setOutskirtLocations((prev) =>
      prev.map((location) =>
        location.name === locationName
          ? { ...location, selected: !location.selected }
          : location
      )
    );
  };

  // Import the Value type from the calendar component if it's exported, or define it here
  // import type { Value } from '@/components/shared/calendar';
  type ValuePiece = Date | null;
  type Value = ValuePiece | [ValuePiece, ValuePiece];

  const handleDateChange = (value: Value) => {
    // If selectRange is false, value is a single Date or null
    if (value instanceof Date || value === null) {
      setPickupDate(value);
    } else if (Array.isArray(value)) {
      // If selectRange is true, value is [start, end]
      setPickupDate(value[0]);
    }
  };

  const setCalendarValues = (value: Value) => {
    if (value instanceof Date || value === null) {
      setPickupDate(value);
    } else if (Array.isArray(value)) {
      setPickupDate(value[0]);
    }
  };

  const handleSaveDraft = () => {
    console.log("Save draft clicked");
  };

  const handleSubmitBooking = () => {
    console.log("Moving to next step");
    console.log("Selected customer:", selectedCustomer);
    console.log("Booking details:", {
      pickupLocation,
      pickupDate,
      pickupTime,
      dropoffLocation,
      areaOfUse,
      purposeOfRide,
      extraHours,
      needsExtraTime,
      extraDetails,
      outskirtLocations: outskirtLocations.filter((loc) => loc.selected),
    });

    // Move to next step
    setCurrentStep(currentStep + 1);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div style={{ marginTop: 100 }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Daily Rental
          </h1>

          {/* Pickup Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup location
            </label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Pickup Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pick-up date
              </label>
              <div className="relative">
                <DateRangeCalendar
                  title="Select Date"
                  buttonClass="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between text-left"
                  selectRange={false}
                  value={pickupDate}
                  onChange={handleDateChange}
                  setCalendarValues={setCalendarValues}
                  isOpen={isCalendarOpen}
                  handleIsOpen={setIsCalendarOpen}
                />
                <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                  <span className="text-gray-900">
                    {pickupDate?.toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                    })}
                  </span>
                  {Icons.ic_calendar}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pick-up time
              </label>
              <input
                type="text"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Drop-off Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Drop-off location
            </label>
            <input
              type="text"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Area of Use */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area of use
            </label>
            <div className="relative">
              <select
                value={areaOfUse}
                onChange={(e) => setAreaOfUse(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="Mainland,Island">Mainland,Island</option>
                <option value="Mainland">Mainland</option>
                <option value="Island">Island</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                {Icons.ic_chevron_down}
              </div>
            </div>
          </div>

          {/* Outskirt Locations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Outskirt locations
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Stops here will incur an additional cost of{" "}
              <span className="text-blue-600 font-semibold">₦6,500</span> set by
              the host of your vehicle
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {outskirtLocations.map((location) => (
                <label
                  key={location.name}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={location.selected}
                    onChange={() => handleOutskirtLocationChange(location.name)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{location.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Extra Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extra details (optional)
            </label>
            <textarea
              value={extraDetails}
              onChange={(e) => setExtraDetails(e.target.value)}
              placeholder="Add extra trip details you would like to share"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Purpose of Ride */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose of ride (optional)
            </label>
            <div className="relative">
              <select
                value={purposeOfRide}
                onChange={(e) => setPurposeOfRide(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="">Select</option>
                <option value="business">Business</option>
                <option value="personal">Personal</option>
                <option value="tourism">Tourism</option>
                <option value="airport">Airport Transfer</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                {Icons.ic_chevron_down}
              </div>
            </div>
          </div>

          {/* Extra Time Section */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Will 12 hours be sufficient for you?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setNeedsExtraTime(false)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    needsExtraTime === false
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  No
                </button>
                <button
                  onClick={() => setNeedsExtraTime(true)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    needsExtraTime === true
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Yes
                </button>
              </div>
            </div>

            {needsExtraTime && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How much more time do you need in hours
                </label>
                <div className="relative w-32">
                  <input
                    type="number"
                    value={extraHours}
                    onChange={(e) =>
                      setExtraHours(parseInt(e.target.value) || 1)
                    }
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Please note that enabling extra time will incur a fee of{" "}
                  <span className="text-blue-600 font-semibold">₦2,700</span>{" "}
                  per hour.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Info Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Customer Info
            </h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {getInitials(customerInfo.name)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {customerInfo.name}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
                <p className="text-sm text-gray-800">{customerInfo.email}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Phone Number
                </p>
                <p className="text-sm text-gray-800">
                  {customerInfo.phoneNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DottedLines />

      {/* Fixed Footer */}
      <div className="mt-6 py-4 border-none border-[#ccc] sticky bottom-0">
        <div className="flex justify-between space-x-4">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-full text-[#333] hover:bg-gray-50 transition-colors font-medium"
          >
            Back
          </button>
          <div className="flex space-x-4">
            <button
              onClick={handleSaveDraft}
              className="px-6 py-2 border border-gray-300 rounded-full text-[#333] hover:bg-gray-50 transition-colors font-medium"
            >
              Save Draft
            </button>
            <button
              onClick={handleSubmitBooking}
              className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyRental;
