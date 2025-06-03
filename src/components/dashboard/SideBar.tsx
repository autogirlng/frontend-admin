import React from "react";
import { FiX } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

import { SvgAsset } from "@/utils/SvgAssets";
import { LocalRoute } from "@/utils/LocalRoutes";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle, currentPage }) => {
  return (
    <div
      className={`sm:relative sm:w-52 sm:h-full sm:bg-white sm:text-gray-700 sm:shadow-2xl fixed inset-0 bg-white
         bg-opacity-90 z-100 transition-opacity ${
           isOpen
             ? "opacity-100"
             : "opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto"
         }`}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white text-gray-700 py-4 px-6 rounded-t-2xl transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } transition-transform duration-300 ease-in-out sm:translate-y-0 sm:static sm:h-full`}
      >
        {/* Logo and Close Button */}
        <div className="flex justify-between items-center sm:mb-8">
          <Image src="/images/logo.png" width={130} height={130} alt="Logo" />
          <button onClick={toggle} className="text-gray-800 sm:hidden">
            <FiX size={26} className="text-black" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map(({ href, icon: Icon, label }) => (
              <li
                key={href}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-300 cursor-pointer text-sm font-medium
                  ${
                    currentPage.toLowerCase() === label.toLowerCase()
                      ? "bg-[#EDF8FF] text-[#0673FF] font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                <p className="text-[#0673FF]">{Icon}</p>
                <Link href={href} className="w-full">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

// Sidebar Navigation Items
const menuItems = [
  { href: "/", icon: SvgAsset.dashboard, label: "Dashboard" },
  { href: "/dashboard/booking", icon: SvgAsset.booking, label: "Bookings" },
  { href: LocalRoute.fleetPage, icon: SvgAsset.fleet, label: "Fleet" },
  {
    href: LocalRoute.vehiclesOnboardedPage,
    icon: SvgAsset.onboarding,
    label: "Onboarding",
  },
  { href: LocalRoute.hostPage, icon: SvgAsset.host, label: "Hosts" },
  { href: "/customers", icon: SvgAsset.customers, label: "Customers" },
  { href: "/finance", icon: SvgAsset.finance, label: "Finance" },
  { href: "/support", icon: SvgAsset.support, label: "Support" },
  { href: LocalRoute.login, icon: SvgAsset.toolTip, label: "Logout" },
];

export default Sidebar;
