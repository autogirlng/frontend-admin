// components/notifications/NotificationPopover.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover"; // Use Radix
import { useNotifications } from "@/context/NotificationContext";
import { NotificationItem } from "./types";
import { Bell, Inbox } from "lucide-react"; // Removed unused Circle/Check
import CustomLoader from "../generic/CustomLoader";
import clsx from "clsx";
import Button from "../generic/ui/Button"; // Use your button

// Helper for relative time (unchanged)
function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// Single notification item renderer
const NotificationRow = ({
  notification,
  onNotificationClick,
}: {
  notification: NotificationItem;
  onNotificationClick: (notification: NotificationItem) => void;
}) => {
  return (
    <div
      onClick={() => onNotificationClick(notification)}
      className={clsx(
        "p-4 flex items-start gap-4 transition-colors cursor-pointer",
        notification.isRead
          ? "hover:bg-slate-50"
          : "bg-indigo-50 hover:bg-indigo-100"
      )}
    >
      {/* Unread indicator */}
      <div className="mt-1.5">
        {!notification.isRead ? (
          <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
        ) : (
          <div className="h-2.5 w-2.5" /> // Placeholder for alignment
        )}
      </div>
      {/* Content */}
      <div className="flex-1">
        <h4 className="font-medium text-sm text-slate-900">
          {notification.title}
        </h4>
        <p className="text-sm text-slate-600 line-clamp-2">
          {notification.message}
        </p>
        <span className="text-xs text-slate-500 mt-1 block">
          {timeAgo(notification.createdAt)}
        </span>
      </div>
    </div>
  );
};

// The main popover component
export function NotificationPopover() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } =
    useNotifications();

  // Get the first 5 notifications
  const recentNotifications = notifications.slice(0, 5);

  const handleNotificationClick = (notification: NotificationItem) => {
    // Mark as read first
    markAsRead(notification.id);
    // Then navigate if URL exists
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors">
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-white text-[11px] font-bold ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <Bell size={24} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-100"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="p-10 flex justify-center items-center">
              <CustomLoader />
            </div>
          )}
          {!isLoading && recentNotifications.length === 0 && (
            <div className="flex flex-col items-center justify-center p-10 text-slate-500">
              <Inbox className="h-12 w-12 text-slate-400" />
              <p className="font-medium mt-3 text-slate-700">
                No Notifications
              </p>
              <p className="text-sm">You're all caught up.</p>
            </div>
          )}
          {!isLoading && recentNotifications.length > 0 && (
            <div className="divide-y divide-slate-100">
              {recentNotifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onNotificationClick={handleNotificationClick}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 rounded-b-xl">
          <Link
            href="/dashboard/notifications" // Link to your full notifications page
            className="w-full"
          >
            <Button variant="secondary" className="w-full">
              View All Notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
