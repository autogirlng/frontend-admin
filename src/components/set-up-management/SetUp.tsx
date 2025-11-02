"use client";

import Link from "next/link";
import {
  Palette,
  ListTodo,
  Truck,
  CarTaxiFront,
  Shapes,
  Percent,
  MapPin,
  Clock,
  Landmark,
  BookCopy,
  ChevronRight,
  Star,
} from "lucide-react";
import React from "react";
import CustomBack from "../generic/CustomBack";

interface SetupItem {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

const setupItems: SetupItem[] = [
  {
    title: "Booking Types",
    description: "Configure different types of bookings.",
    href: "/dashboard/set-up/booking-types",
    icon: BookCopy,
  },
  {
    title: "Company Bank Accounts",
    description: "Manage payout and company accounts.",
    href: "/dashboard/set-up/bank-accounts",
    icon: Landmark,
  },
  {
    title: "Platform Fee",
    description: "Set the platform commission percentage.",
    href: "/dashboard/set-up/platform-fee",
    icon: Percent,
  },
  {
    title: "Discount Durations",
    description: "Set durations for promotional discounts.",
    href: "/dashboard/set-up/discount-durations",
    icon: Clock,
  },
  {
    title: "Outskirts and Extreme Locations",
    description: "Define operational zones and boundaries.",
    href: "/dashboard/outskirts",
    icon: MapPin,
  },
  {
    title: "Vehicle Types",
    description: "Define categories like Sedan, SUV, etc.",
    href: "/dashboard/set-up/vehicle-types",
    icon: Shapes,
  },
  {
    title: "Vehicle Make",
    description: "Add or remove vehicle manufacturers.",
    href: "/dashboard/set-up/vehicle-make",
    icon: Truck,
  },
  {
    title: "Vehicle Models",
    description: "Add or remove vehicle Models.",
    href: "/dashboard/set-up/vehicle-models",
    icon: CarTaxiFront,
  },
  {
    title: "Vehicle Features",
    description: "Define features and amenities for vehicles.",
    href: "/dashboard/set-up/vehicle-features",
    icon: ListTodo,
  },
  {
    title: "Vehicle Colors",
    description: "Manage the available vehicle colors.",
    href: "/dashboard/set-up/vehicle-colors",
    icon: Palette,
  },
  {
    title: "Top rated Vehicles",
    description: "Manage the top rated vehicles.",
    href: "/dashboard/vehicle-onboarding/top-rated-vehicles",
    icon: Star,
  },
];

// 3. The Page Component
export default function SetupPage() {
  return (
    <main className="py-3 max-w-8xl mx-auto">
      <CustomBack />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Autogirl&apos;s Workspace Setup
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Configure and manage your platform's infrastructure and settings.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {setupItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              href={item.href}
              key={item.title}
              className="group flex items-center justify-between p-6
                         bg-white border border-gray-200 rounded-lg 
                         shadow-sm transition-all
                         hover:shadow-md hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 p-3 bg-indigo-50 rounded-full">
                  <Icon className="w-6 h-6 text-[#0096FF]" />
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>

              {/* Arrow Icon */}
              <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-hover:translate-x-1" />
            </Link>
          );
        })}
      </div>
    </main>
  );
}
