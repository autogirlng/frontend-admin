"use client";

import Header from "@/components/generic/Header";
import Sidebar from "@/components/generic/Sidebar";
import { NotificationProvider } from "@/context/NotificationContext";
import { useIdleTimer } from "@/lib/hooks/useIdleTimer";
import { signOut } from "next-auth/react";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const handleIdle = useCallback(() => {
    toast.error("You have been logged out due to inactivity.");

    signOut({ callbackUrl: "/login" });
  }, []);

  useIdleTimer({ onIdle: handleIdle, idleTime: 6000 });

  return (
    <div className="flex h-screen">
      <NotificationProvider>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 flex flex-col">
          <Header setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </NotificationProvider>
    </div>
  );
}
