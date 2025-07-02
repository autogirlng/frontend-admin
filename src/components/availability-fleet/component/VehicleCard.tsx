import Link from "next/link";
import { Vehicle } from "../types/vehicle";
import { Calendar, MapPin, Car, Clock } from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const getVehicleIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "suv":
        return "🚙";
      case "sedan":
        return "🚗";
      case "truck":
        return "🚚";
      case "bus":
        return "🚌";
      default:
        return "🚗";
    }
  };

  const availableDays = vehicle.availability.filter(
    (day) => day.status === "available"
  ).length;
  const totalDays = vehicle.availability.length;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">
              {getVehicleIcon(vehicle.vehicleType)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {vehicle.listingName}
              </h3>
              <p className="text-gray-600">
                {vehicle.make} {vehicle.model} ({vehicle.yearOfRelease})
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-primary-50 px-3 py-1 rounded-full">
            <Car className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700 capitalize">
              {vehicle.vehicleType}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{vehicle.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>
              {availableDays}/{totalDays} days available
            </span>
          </div>
        </div>

        <div className="mb-4 mt-4 flex items-center justify-between">
          <Link
            href={`/vehicle/${vehicle.vehicleId}`}
            className=" text-primary-600 hover:underline text-xs font-medium"
            title="View vehicle details"
            rel="noopener noreferrer"
          >
            View Vehicle
          </Link>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-secondary-700">
              Availability Calendar
            </span>
            <div className="flex items-center space-x-2 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-[#8f8] rounded-full"></div>
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-[#f88] rounded-full"></div>
                <span className="text-gray-600">Booked</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {vehicle.availability.map((day, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                  day.status === "available"
                    ? "bg-[#8f8] text-[#000] border border-[#0f0]"
                    : "bg-[#f88] text-[#000] border border-[#f00]"
                }`}
                title={`${day.date} - ${day.status}`}
              >
                {new Date(day.date).getDate()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
