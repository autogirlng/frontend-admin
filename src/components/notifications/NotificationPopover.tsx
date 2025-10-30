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
import { Bell, Inbox, Circle, Check } from "lucide-react";
import CustomLoader from "../generic/CustomLoader";
import clsx from "clsx";
import Button from "../generic/ui/Button"; // Use your button

// Helper for relative time
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
        "p-3 flex items-start gap-3 transition-colors cursor-pointer",
        !notification.isRead && "bg-indigo-50 hover:bg-indigo-100",
        notification.isRead && "hover:bg-gray-50"
      )}
    >
      {/* Unread indicator */}
      <div className="mt-1.5">
        {!notification.isRead ? (
          <Circle className="h-2.5 w-2.5 text-indigo-500 fill-current" />
        ) : (
          <div className="h-2.5 w-2.5"></div> // Placeholder
        )}
      </div>
      {/* Content */}
      <div className="flex-1">
        <h4 className="font-semibold text-sm text-gray-800">
          {notification.title}
        </h4>
        <p className="text-sm text-gray-600 line-clamp-2">
          {notification.message}
        </p>
        <span className="text-xs text-gray-500">
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
        <button className="relative p-2 text-gray-600 hover:text-[#0096FF] hover:bg-gray-100 rounded-full">
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <Bell size={24} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="z-50 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="text-lg font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="text-xs text-[#0096FF] hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="p-10">
              <CustomLoader />
            </div>
          )}
          {!isLoading && recentNotifications.length === 0 && (
            <div className="flex flex-col items-center justify-center p-10 text-gray-500">
              <Inbox className="h-12 w-12 text-gray-400" />
              <p className="font-semibold mt-2">No Notifications</p>
              <p className="text-sm">You're all caught up.</p>
            </div>
          )}
          {!isLoading &&
            recentNotifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onNotificationClick={handleNotificationClick}
              />
            ))}
        </div>

        <div className="p-2 bg-gray-50 border-t text-center">
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
