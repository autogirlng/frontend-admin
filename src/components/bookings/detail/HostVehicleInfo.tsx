"use client";

import React, { useState } from "react";
import { Users, MoreVertical, CarFront, X } from "lucide-react";
import DottedLines from "@/components/shared/DottedLines";

interface Trip {
  id: number;
  date: string;
  pickupTime: string;
  pickupLocation: string;
  status: "Pending" | "Completed" | "Cancelled";
}

interface HostVehicleInfoProps {
  hostName?: string;
  hostEmail?: string;
  hostPhone?: string;
  vehicleRequested?: string;
  vehicleMake?: string;
  vehicleColor?: string;
  seatingCapacity?: number;
  trips?: Trip[];
  additionalRequests?: string[];
}

interface VehicleInfo {
  name: string;
  phone: string;
  location: string;
  image: string;
}

interface DriverInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
}

const HostVehicleInfo: React.FC<HostVehicleInfoProps> = ({
  hostName = "Oluwaseun Ojo",
  hostEmail = "chidubem3@gmail.com",
  hostPhone = "+234 901 7330 902",
  vehicleRequested = "Toyota Camry 2021",
  vehicleMake = "Toyota",
  vehicleColor = "Black",
  seatingCapacity = 4,
  trips = [
    {
      id: 1,
      date: "20th June 2025",
      pickupTime: "6:00AM",
      pickupLocation: "Toyota Camry 2021",
      status: "Pending",
    },
    {
      id: 2,
      date: "21st June 2025",
      pickupTime: "6:00AM",
      pickupLocation: "Toyota Camry 2021",
      status: "Pending",
    },
    {
      id: 3,
      date: "22nd June 2025",
      pickupTime: "8:00AM",
      pickupLocation: "Toyota Camry 2021",
      status: "Pending",
    },
    {
      id: 4,
      date: "23rd June 2025",
      pickupTime: "10:00AM",
      pickupLocation: "Toyota Camry 2021",
      status: "Pending",
    },
  ],
  additionalRequests = [
    "I want a child seat to be provided with the vehicle.",
    "There is no need for a GPS navigation system.",
    "No additional driver will be needed in this booking.",
  ],
}) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showVehicleInfo, setShowVehicleInfo] = useState<number | null>(null);
  const [showDriverInfo, setShowDriverInfo] = useState<number | null>(null);

  const vehicleInfo: VehicleInfo = {
    name: "Toyota Camry 2012",
    phone: "09017330902",
    location: "Lagos,Nigeria",
    image: "/images/vehicle-detail.png",
  };

  const driverInfo: DriverInfo = {
    name: "Christian Madu",
    email: "christianmadu43@gmail.com",
    phone: "09017330902",
    location: "Lagos,Nigeria",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-[#F98007]";
      case "Completed":
        return "text-success-500";
      case "Cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const handleDropdownToggle = (tripId: number) => {
    setActiveDropdown(activeDropdown === tripId ? null : tripId);
  };

  const handleVehicleInfoToggle = (tripId: number) => {
    setShowVehicleInfo(showVehicleInfo === tripId ? null : tripId);
    setActiveDropdown(null);
  };

  const handleDriverInfoToggle = (tripId: number) => {
    setShowDriverInfo(showDriverInfo === tripId ? null : tripId);
    setActiveDropdown(null);
  };

  const closeAllModals = () => {
    setActiveDropdown(null);
    setShowVehicleInfo(null);
    setShowDriverInfo(null);
  };

  React.useEffect(() => {
    if (activeDropdown || showVehicleInfo || showDriverInfo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeDropdown, showVehicleInfo, showDriverInfo]);

  // console.log("HostVehicleInfo rendered");

  return (
    <div className="pb-8 text-sm relative">
      {/* Overlay */}
      {(activeDropdown || showVehicleInfo || showDriverInfo) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={closeAllModals}
        ></div>
      )}

      <DottedLines />
      {/* Host Information */}
      <div className="mb-12 pt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs text-gray-500 font-medium tracking-wide">
            HOST INFORMATION
          </h2>
          <button className="text-blue-600 text-sm hover:underline font-medium">
            View Host
          </button>
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-2">Host Name</p>
          <p className="text-base font-semibold text-gray-900">{hostName}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-4">Contact Information</p>
          <div className="flex flex-wrap gap-8">
            <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
              <span className="text-sm text-gray-900 font-medium">Email: </span>
              <span className="text-sm text-gray-900">{hostEmail}</span>
            </div>
            <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
              <span className="text-sm text-gray-900 font-medium">
                Phone Number:{" "}
              </span>
              <span className="text-sm text-gray-900">{hostPhone}</span>
            </div>
          </div>
        </div>
      </div>

      <DottedLines />

      {/* Vehicle Information */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs text-gray-500 font-medium tracking-wide">
            VEHICLE INFORMATION
          </h2>
          <button className="text-blue-600 text-sm hover:underline font-medium">
            View Vehicle
          </button>
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-2">Vehicle Requested</p>
          <p className="text-base font-semibold text-gray-900">
            {vehicleRequested}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-4">Vehicle Details</p>
          <div className="flex flex-wrap gap-8">
            <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
              <span className="text-sm text-gray-900 font-medium">Make: </span>
              <span className="text-sm text-gray-900">{vehicleMake}</span>
            </div>
            <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
              <span className="text-sm text-gray-900 font-medium">
                Colour:{" "}
              </span>
              <span className="text-sm text-gray-900">{vehicleColor}</span>
            </div>
            <div className="min-w-0 bg-[#F7F9FC] p-3 rounded-md shadow-sm">
              <span className="text-sm text-gray-900 font-medium">
                Seating Capacity:{" "}
              </span>
              <span className="text-sm text-gray-900">{seatingCapacity}</span>
            </div>
          </div>
        </div>
      </div>

      <DottedLines />

      {/* Trips */}
      <div className="mb-12">
        <h2 className="text-xs text-gray-500 font-medium tracking-wide mb-6">
          TRIPS
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-none">
            <thead>
              <tr className="border-none border-gray-100">
                <th className="text-left text-xs text-[#667185] font-medium pb-3 w-12"></th>
                <th className="text-left text-xs text-[#667185] font-medium pb-3">
                  Date
                </th>
                <th className="text-left text-xs text-[#667185] font-medium pb-3">
                  Pickup Time
                </th>
                <th className="text-left text-xs text-[#667185] font-medium pb-3">
                  Pickup Location
                </th>
                <th className="text-left text-xs text-[#667185] font-medium pb-3">
                  Ride Status
                </th>
                <th className="text-left text-xs text-gray-500 font-medium pb-3 w-20"></th>
                <th className="text-left text-xs text-gray-500 font-medium pb-3 w-20"></th>
                <th className="text-left text-xs text-gray-500 font-medium pb-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr
                  key={trip.id}
                  className="border-none border-gray-50 relative"
                >
                  <td className="py-4 text-sm text-gray-900 font-medium">
                    {trip.id}
                  </td>
                  <td className="py-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Date</div>
                      <div className="text-sm text-gray-900">{trip.date}</div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Pickup Time
                      </div>
                      <div className="text-sm text-gray-900">
                        {trip.pickupTime}
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Pickup Location
                      </div>
                      <div className="text-sm text-gray-900">
                        {trip.pickupLocation}
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        Ride Status
                      </div>
                      <div
                        className={`text-sm font-medium ${getStatusColor(
                          trip.status
                        )}`}
                      >
                        {trip.status}
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <button
                      className={`p-2 rounded-lg border ${
                        showDriverInfo === trip.id
                          ? "bg-blue-50 border-blue-200"
                          : "hover:bg-gray-100 border-gray-200"
                      }`}
                      onClick={() => handleDriverInfoToggle(trip.id)}
                    >
                      <Users
                        className={`w-4 h-4 ${
                          showDriverInfo === trip.id
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-4">
                    <button
                      className={`p-2 rounded-lg border ${
                        showVehicleInfo === trip.id
                          ? "bg-blue-50 border-blue-200"
                          : "hover:bg-gray-100 border-gray-200"
                      }`}
                      onClick={() => handleVehicleInfoToggle(trip.id)}
                    >
                      <CarFront
                        className={`w-4 h-4 ${
                          showVehicleInfo === trip.id
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-4 relative">
                    <button
                      id={`dropdown-button-${trip.id}`}
                      className={`p-2 rounded-lg border ${
                        activeDropdown === trip.id
                          ? "bg-blue-50 border-blue-200"
                          : "hover:bg-gray-100 border-gray-200"
                      }`}
                      onClick={() => handleDropdownToggle(trip.id)}
                    >
                      <MoreVertical
                        className={`w-4 h-4 ${
                          activeDropdown === trip.id
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  </td>

                  {/* Actions Dropdown */}
                  {activeDropdown === trip.id && (
                    <div
                      className="fixed inset-0 z-40"
                      onClick={closeAllModals}
                    >
                      <div
                        className="absolute right-4 w-48 bg-white border border-gray-200 rounded-xl shadow-lg"
                        style={{
                          top: Math.min(
                            // Get button position
                            document
                              .getElementById(`dropdown-button-${trip.id}`)
                              ?.getBoundingClientRect().bottom || 0,
                            // Don't go below viewport minus dropdown height
                            window.innerHeight - 200
                          ),
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-4">
                          <h3 className="text-sm font-medium text-gray-900 mb-3">
                            Actions
                          </h3>
                          <div className="space-y-2">
                            <button className="w-full text-left text-sm text-gray-700 hover:text-gray-900 py-2">
                              Update Trip
                            </button>
                            <button className="w-full text-left text-sm text-gray-700 hover:text-gray-900 py-2">
                              Cancel Trip
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vehicle Information Modal - Centered */}
                  {showVehicleInfo === trip.id && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                      <div
                        className="bg-white border-2 border-blue-300 rounded-2xl p-6 shadow-lg w-full max-w-md relative"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                      >
                        <button
                          onClick={() => setShowVehicleInfo(null)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <div className="text-xs text-gray-500 tracking-wide mb-3">
                          VEHICLE INFORMATION
                        </div>
                        <div className="flex items-center gap-4">
                          <img
                            src="/images/vehicle-detail.png"
                            alt="Vehicle"
                            className="w-20 h-15 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {vehicleInfo.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {vehicleInfo.phone} • {vehicleInfo.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Driver Information Modal - Centered */}
                  {showDriverInfo === trip.id && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                      <div
                        className="bg-white border-2 border-blue-300 rounded-2xl p-6 shadow-lg w-full max-w-md relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setShowDriverInfo(null)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <div className="text-xs text-gray-500 tracking-wide mb-3">
                          DRIVER'S INFORMATION
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-gray-500" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {driverInfo.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                              {driverInfo.email}
                            </p>
                            <p className="text-sm text-gray-600">
                              {driverInfo.phone} • {driverInfo.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              Ride Status
                            </div>
                            <div className="text-orange-500 font-medium">
                              Pending
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DottedLines />

      {/* Additional Requests */}
      <div>
        <h2 className="text-xs text-[#344054] font-medium tracking-wide mb-4">
          ADDITIONAL REQUESTS
        </h2>
        <ul className="space-y-2">
          {additionalRequests.map((request, index) => (
            <li key={index} className="flex items-start">
              <span className="text-sm text-[#667185] mr-2">•</span>
              <span className="text-sm text-[#667185]">{request}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HostVehicleInfo;
