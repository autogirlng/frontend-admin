import React from "react";
import { FiX } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { FaHome, FaUsers, FaTruck, FaUserAstronaut } from "react-icons/fa";

const Sidebar: React.FC<{ isOpen: boolean; toggle: () => void }> = ({
  isOpen,
  toggle,
}) => {
  return (
    <div
      className={`sm:relative sm:w-48 sm:h-full sm:bg-[#0673FF] sm:text-white fixed inset-0 bg-[#0673FF] bg-opacity-50 z-50 transition-opacity ${
        isOpen
          ? "opacity-100"
          : "opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto"
      }`}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 bg-[#0673FF] text-white py-2 px-4 rounded-t-2xl transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } transition-transform duration-300 ease-in-out sm:translate-y-0 sm:static sm:h-full`}
      >
        {/* Logo and Close Button */}
        <div className="flex justify-between items-center sm:mb-6">
          <Image src="/images/logo.png" width={100} height={100} alt="Logo" />
          <button onClick={toggle} className="text-white sm:hidden">
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            <li className="flex items-center gap-4 cursor-pointer hover:bg-gray-700 p-2 rounded">
              <FaHome size={20} />
              <Link href="/home" className="w-full">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-4 cursor-pointer hover:bg-gray-700 p-2 rounded">
              <FaUserAstronaut size={20} />
              <Link href="/rider" className="w-full">
                Riders
              </Link>
            </li>
            <li className="flex items-center gap-4 cursor-pointer hover:bg-gray-700 p-2 rounded">
              <FaUsers size={20} />
              <Link href="/user" className="w-full">
                Users
              </Link>
            </li>
            <li className="flex items-center gap-4 cursor-pointer hover:bg-gray-700 p-2 rounded">
              <FaTruck size={20} />
              <Link href="/orders" className="w-full">
                Orders
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-1 border-t border-gray-700">
          <Link href="/">
            <button className="bg-red-600 px-4 py-2 rounded w-full">
              Logout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
