import React, { useState, ReactNode } from "react";
import { FiMenu, FiSettings } from "react-icons/fi";
import Sidebar from "./SideBar";
import IconButton from "../core/IconButton";
import { BiBell, BiUser } from "react-icons/bi";

interface DashboardLayoutProps {
  title: string | "";
  children: ReactNode;
  currentPage: string | "";
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  children,
  currentPage,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 flex-col sm:flex-row">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        isOpen={isSidebarOpen}
        toggle={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col  relative">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 sm:left-64 w-full sm:w-[calc(100%-16rem)] bg-white shadow px-4 py-3 flex justify-between items-center z-50">
          <button
            className="sm:hidden p-2"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FiMenu size={24} />
          </button>
          <h2 className="hidden">{title}</h2>
          <h2 className="text-sm hidden sm:block">Hello Jeff</h2>

          <div className="flex items-center space-x-1 justify-between">
            <IconButton icon={<BiBell />} />
            <IconButton icon={<FiSettings />} />
            <IconButton icon={<BiUser />} />
          </div>
        </header>

        {/* Page Content */}
        <main
          className={`flex-1 sm:ml-4 overflow-y-auto overflow-x-hidden bg-slate-50 p-3 max-w-full mt-16`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
