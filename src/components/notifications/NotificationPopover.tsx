"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useNotifications } from "@/context/NotificationContext";
import { NotificationItem } from "./types";
import {
  Bell,
  Inbox,
  MessageSquare,
  AlertTriangle,
  Settings,
} from "lucide-react"; // ✅ Added missing icons
import CustomLoader from "../generic/CustomLoader";
import clsx from "clsx";
import Button from "../generic/ui/Button";

// --- Helper: Notification Icon (Matches Full Page) ---
const NotificationIcon = ({ type }: { type?: string }) => {
  let icon;
  switch (type) {
    case "comment":
      icon = <MessageSquare className="h-5 w-5 text-gray-600" />;
      break;
    case "alert":
      icon = <AlertTriangle className="h-5 w-5 text-red-600" />;
      break;
    case "system":
      icon = <Settings className="h-5 w-5 text-gray-600" />;
      break;
    default:
      icon = <Bell className="h-5 w-5 text-blue-600" />;
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
      {icon}
    </div>
  );
};

// --- Helper: Relative Time ---
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

// --- Component: Notification Row ---
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
        "p-3 flex items-start gap-3 transition-colors cursor-pointer border-b border-slate-50 last:border-b-0",
        notification.isRead
          ? "hover:bg-slate-50"
          : "bg-blue-50/50 hover:bg-blue-50" // Matches full page theme
      )}
    >
      {/* Icon & Badge Container */}
      <div className="relative flex-shrink-0 pt-1">
        <NotificationIcon type={notification.type} />
        {!notification.isRead && (
          <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500"></span>
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4
            className={clsx(
              "text-sm font-medium truncate pr-2",
              notification.isRead ? "text-slate-700" : "text-slate-900"
            )}
          >
            {notification.title}
          </h4>
          <span className="text-[10px] text-slate-400 flex-shrink-0 whitespace-nowrap">
            {timeAgo(notification.createdAt)}
          </span>
        </div>
        <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
          {notification.message}
        </p>
      </div>
    </div>
  );
};

// --- Main Component ---
export function NotificationPopover() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } =
    useNotifications();

  // Get the first 5 notifications
  const recentNotifications = notifications.slice(0, 5);

  const handleNotificationClick = (notification: NotificationItem) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors outline-none focus:ring-2 focus:ring-blue-100">
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-white text-[10px] font-bold ring-2 ring-white shadow-sm">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <Bell size={24} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white">
          <h3 className="text-sm font-semibold text-slate-800">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline focus:outline-none transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          {isLoading && (
            <div className="p-8 flex justify-center items-center">
              <CustomLoader />
            </div>
          )}

          {!isLoading && recentNotifications.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
              <Inbox className="h-10 w-10 mb-3 stroke-1" />
              <p className="text-sm font-medium text-slate-600">
                All caught up!
              </p>
              <p className="text-xs text-slate-400 mt-1">
                No new notifications to show.
              </p>
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

        {/* Footer */}
        <div className="p-2 bg-slate-50 border-t border-slate-100">
          <Link href="/dashboard/notifications" className="block w-full">
            <Button
              variant="secondary"
              className="w-full text-xs h-9 font-medium"
            >
              View All Activity
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
