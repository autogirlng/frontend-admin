import React, { useState, ReactNode } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "./SideBar";

interface DashboardLayoutProps {
  title: string;
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 flex-col sm:flex-row">
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 overflow-hidden flex flex-col sm:ml-4 ">
        <header className="mb-3 px-2 flex justify-between items-center">
          <button
            className="sm:hidden p-2"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FiMenu size={24} />
          </button>
          <h1 className="text-lg sm:text-xl  sm:py-2 font-semibold">{title}</h1>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 p-3  max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
