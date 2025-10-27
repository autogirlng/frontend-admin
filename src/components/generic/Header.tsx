"use client";

import { useSession, signOut } from "next-auth/react";
import { Menu, Bell, Search, LogOut, MessageCircle } from "lucide-react";

interface HeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

const Header = ({ setSidebarOpen }: HeaderProps) => {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-green-600 md:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={28} />
          </button>
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-gray-800">
              Welcome back, {session?.user?.name?.split(" ")[0] || "Admin"}!
            </h1>
            <p className="text-sm text-gray-500">
              Here's what's happening today.
            </p>
          </div>
        </div>
        <div className="flex-1 flex justify-center px-4">
          <div className="hidden sm:flex items-center relative w-full max-w-md">
            <Search className="absolute left-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0096FF]"
            />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-end gap-4">
          <button className="relative p-2 text-gray-600 hover:text-[#0096FF] hover:bg-gray-100 rounded-full">
            <MessageCircle size={24} />
          </button>
          <button className="relative p-2 text-gray-600 hover:text-[#0096FF] hover:bg-gray-100 rounded-full">
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            <Bell size={24} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Logout"
          >
            <LogOut size={22} />
            <span className="hidden md:block font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
