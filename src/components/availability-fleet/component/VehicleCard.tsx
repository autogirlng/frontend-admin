// VehicleCard.tsx

import { Vehicle } from "../types/vehicle";
import { Info } from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
  onDayClick: (date: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onDayClick }) => {
  const getVehicleIcon = (type: string) => {
    if (type.toLowerCase().includes("electric")) return "⚡️";
    if (type.toLowerCase().includes("suv")) return "🚙";
    if (type.toLowerCase().includes("sedan")) return "🚗";
    if (type.toLowerCase().includes("truck")) return "🚚";
    if (type.toLowerCase().includes("bus")) return "🚌";
    return "🚗";
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">
              {getVehicleIcon(vehicle.vehicleType)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {vehicle.listingName}
              </h3>
              <p className="text-sm text-gray-500">
                {vehicle.make} {vehicle.model}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {vehicle.yearOfRelease}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-xs text-primary-600 font-medium mb-4">
          <Info className="w-3 h-3" />
          <span>Click on a day to see hourly availability</span>
        </div>
      </div>

      <div className="bg-gray-50 p-6 flex-grow">
        <div className="grid grid-cols-7 gap-1">
          {vehicle.availability.map((day, index) => {
            const dateObj = new Date(day.date + "T00:00:00");
            return (
              <button
                key={index}
                onClick={() => onDayClick(day.date)}
                className={`w-full h-10 rounded-lg flex items-center justify-center text-xs font-semibold transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  day.status === "available"
                    ? "bg-[#8f8] text-[#000] border border-[#0f0]"
                    : "bg-[#f88] text-[#000] border border-[#f00]"
                }`}
                title={`View hourly for ${day.date}`}
              >
                {dateObj.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
