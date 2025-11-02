// app/dashboard/top-rated/VehicleCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Car, MapPin, Users, Trash2, Tag } from "lucide-react";
import { FeaturedVehicle } from "./types";
import { formatPrice } from "@/lib/utils/price-format"; // Assuming you have this

interface VehicleCardProps {
  vehicle: FeaturedVehicle;
  onRemove: (vehicle: FeaturedVehicle) => void;
}

export function VehicleCard({ vehicle, onRemove }: VehicleCardProps) {
  // Find the primary photo, or fallback to the first
  const primaryPhoto =
    vehicle.photos.find((p) => p.isPrimary)?.cloudinaryUrl ||
    vehicle.photos[0]?.cloudinaryUrl;

  // Find the lowest price
  const minPrice =
    vehicle.allPricingOptions.length > 0
      ? Math.min(...vehicle.allPricingOptions.map((p) => p.price))
      : 0;

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden group">
      <div className="relative">
        <Link href={`/dashboard/vehicle-onboarding/${vehicle.id}`}>
          {primaryPhoto ? (
            <img
              src={primaryPhoto}
              alt={vehicle.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
              <Car className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </Link>
        {/* Remove Button */}
        <button
          onClick={() => onRemove(vehicle)}
          className="absolute top-3 right-3 p-2 bg-black/40 text-white rounded-full
                     opacity-0 group-hover:opacity-100 transition-opacity
                     hover:bg-red-600"
          aria-label="Remove from featured"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <p className="text-sm text-gray-500">{vehicle.vehicleTypeName}</p>
        <Link href={`/dashboard/vehicle-onboarding/${vehicle.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 truncate hover:text-[#0096FF]">
            {vehicle.name}
          </h3>
        </Link>

        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-gray-400" />
            <span>{vehicle.numberOfSeats} Seats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{vehicle.city}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <span className="text-xs text-gray-500">Starts from</span>
          <p className="text-xl font-bold text-gray-900">
            {formatPrice(minPrice)}
          </p>
        </div>
      </div>
    </div>
  );
}
