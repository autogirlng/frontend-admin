"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  User,
  Settings,
  X,
  Ellipsis,
  LogOut,
  CarFront,
  PanelLeft,
  Users,
  Car,
  Ticket,
  Plane,
  UserStar,
  GalleryHorizontal,
  CirclePoundSterling,
} from "lucide-react";

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const getInitials = (name = "") => {
  const nameParts = name.split(" ").filter(Boolean);
  if (nameParts.length > 1) {
    return `${nameParts[0][0]}${
      nameParts[nameParts.length - 1][0]
    }`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const Sidebar = ({ isSidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // New state to control desktop minimization
  const [isMinimized, setIsMinimized] = useState(false);

  const mainNavLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Bookings", href: "/dashboard/bookings", icon: Ticket },
    { name: "Trips", href: "/dashboard/trips", icon: Plane },
    {
      name: "Vehicle Availability",
      href: "/dashboard/availability",
      icon: GalleryHorizontal,
    },
    {
      name: "Vehicle Onboarding",
      href: "/dashboard/vehicle-onboarding",
      icon: Car,
    },
    { name: "Hosts", href: "/dashboard/host", icon: CarFront },
    { name: "Customers", href: "/dashboard/customers", icon: Users },
    { name: "Drivers", href: "/dashboard/drivers", icon: UserStar },
    { name: "Finance", href: "/dashboard/finance", icon: CirclePoundSterling },
  ];

  const settingsLink = {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full flex-shrink-0 bg-white text-gray-800 flex flex-col z-40 transition-transform duration-300 ease-in-out md:transition-width md:relative md:translate-x-0 border-r border-gray-200 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isMinimized ? "w-20" : "w-64" // Apply dynamic width on desktop
        }`}
      >
        <div className="h-16 flex items-center justify-between p-4">
          <div className="flex items-center justify-center">
            <Image
              src="/images/muvment.png"
              alt="Muvment"
              width={152}
              height={152}
              className={isMinimized ? "hidden" : "block"} // Hide logo when minimized
            />
          </div>
          {/* Group toggle buttons */}
          <div>
            {/* Desktop Toggle Button */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hidden md:block text-gray-600 hover:text-green-600"
            >
              <PanelLeft
                size={24}
                className={`transition-transform ${
                  isMinimized ? "rotate-180" : ""
                }`}
              />
            </button>
            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-600 hover:text-green-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <nav className="flex-grow p-4">
          <ul>
            {mainNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name} className="mb-2">
                  <Link
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#0096FF] text-white"
                        : "text-gray-700 hover:bg-[#7393B3] hover:text-white"
                    } ${
                      isMinimized ? "justify-center" : "" // Center icon
                    }`}
                  >
                    <link.icon
                      className={`h-5 w-5 ${
                        isMinimized ? "mr-0" : "mr-3" // Remove margin
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        isMinimized ? "hidden" : "block" // Hide text
                      }`}
                    >
                      {link.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <ul>
            <li className="mb-2">
              <Link
                href={settingsLink.href}
                onClick={() => setSidebarOpen(false)}
                className={` group flex items-center p-3 rounded-lg transition-colors ${
                  pathname === settingsLink.href
                    ? "bg-[#0096FF] text-white"
                    : "text-gray-700 hover:bg-[#7393B3] hover:text-white"
                } ${
                  isMinimized ? "justify-center" : "" // Center icon
                }`}
              >
                <settingsLink.icon
                  className={`h-5 w-5 ${
                    isMinimized ? "mr-0" : "mr-3" // Remove margin
                  }`}
                />
                <span
                  className={`font-medium ${
                    isMinimized ? "hidden" : "block" // Hide text
                  }`}
                >
                  {settingsLink.name}
                </span>
              </Link>
            </li>
          </ul>
          {session?.user && (
            <div className="relative" ref={dropdownRef}>
              {/* Dropdown Menu */}
              <div
                className={`absolute bottom-full mb-2 w-full transition-opacity duration-200 ${
                  isDropdownOpen ? "opacity-100 block" : "opacity-0 hidden"
                } ${isMinimized ? "w-48 -left-1/2" : "w-full"}`} // Adjust dropdown when minimized
              >
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="mr-3 h-4 w-4" /> View Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-3 h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
              <div
                className={`mt-4 flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer ${
                  isMinimized ? "justify-center" : "" // Center avatar
                }`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600 flex-shrink-0">
                  {getInitials(session.user.name ?? "")}
                </div>
                <div
                  className={`ml-3 flex-1 ${
                    isMinimized ? "hidden" : "block" // Hide text block
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session.user.email}
                  </p>
                </div>
                <Ellipsis
                  className={`text-gray-500 ${
                    isMinimized ? "hidden" : "block"
                  }`}
                  size={20}
                />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
