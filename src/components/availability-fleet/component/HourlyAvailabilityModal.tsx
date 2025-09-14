"use client";

import { X, Clock, AlertTriangle, Car } from "lucide-react";
import { Vehicle, HourlyAvailability } from "../types/vehicle";

interface HourlyAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  date: string;
  hourlyData: HourlyAvailability[];
  loading: boolean;
  error: string | null;
}

const HourlyAvailabilityModal: React.FC<HourlyAvailabilityModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  date,
  hourlyData,
  loading,
  error,
}) => {
  if (!isOpen) return null;

  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-95 animate-modal-enter">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Hourly Availability
              </h2>
              <p className="text-sm text-gray-500">
                {vehicle?.listingName} on {formattedDate}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 animate-pulse">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          )}
          {error && (
            <div className="text-center py-10">
              <AlertTriangle className="mx-auto w-12 h-12 text-red-400 mb-3" />
              <p className="font-semibold text-red-600">Failed to load data</p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          )}
          {!loading && !error && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {hourlyData.map(({ time, status }) => (
                <div
                  key={time}
                  className={`p-2 rounded-md text-center text-sm font-medium border ${
                    status === "available"
                      ? "bg-[#8f8] text-[#000] border border-[#0f0]"
                      : "bg-[#f88] text-[#000] border border-[#f00]"
                  }`}
                >
                  <p className="font-bold">{time.toUpperCase()}</p>
                  <p className="text-xs capitalize">
                    {status.replace("-", " ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HourlyAvailabilityModal;
