"use client";
import React, { useState, ReactNode } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "./SideBar";
import IconButton from "../core/IconButton";
import { BiUser } from "react-icons/bi";
import { SvgAsset } from "@/app/utils/SvgAssets";
import cn from "classnames";

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
      <div className="flex-1 flex flex-col relative">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 sm:left-52 w-full sm:w-[calc(100%-13rem)] bg-white shadow-2xl px-4 py-3 flex justify-between items-center z-50">
          <button
            className="sm:hidden p-2"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FiMenu size={24} />
          </button>
          <h2 className="hidden">{title}</h2>
          <h2 className="text-sm hidden sm:block text-black">Hello Jeff</h2>

          <div className="flex items-center space-x-1 justify-between">
            <p className="rounded-full p-2 bg-slate-50">
              {SvgAsset.notification}
            </p>
            <p className="rounded-full p-2 bg-slate-50">{SvgAsset.setting}</p>
            <IconButton icon={<BiUser />} />
            <SvgIcon
              icon={SvgAsset.chevronDown}
              className={cn(
                "flex items-center gap-3 py-3 text-sm 2xl:text-base",
                "text-primary-500 "
              )}
            />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main
            className={`flex-1overflow-y-auto pt-16 px-4 bg-white  max-w-full `}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

interface SvgIconProps {
  icon: React.ReactNode;
  className?: string;
}

const SvgIcon: React.FC<SvgIconProps> = ({ icon, className = "" }) => {
  return <span className={className}>{icon}</span>;
};
