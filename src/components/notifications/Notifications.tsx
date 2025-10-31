"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useNotificationsList } from "@/lib/hooks/notifications/useNotificationsList";
// Assume 'type' is part of the NotificationItem
import { NotificationItem } from "./types";
import { PaginationControls } from "../generic/ui/PaginationControls";
import {
  AlertCircle,
  Inbox,
  Bell,
  MessageSquare,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import clsx from "clsx";
import CustomBack from "../generic/CustomBack";
import CustomLoader from "../generic/CustomLoader";

// This is a new helper component to render icons based on type
// You would customize this based on your app's notification types
const NotificationIcon = ({ type }: { type?: string }) => {
  let icon;
  switch (type) {
    case "comment":
      icon = <MessageSquare className="h-6 w-6 text-gray-600" />;
      break;
    case "alert":
      icon = <AlertTriangle className="h-6 w-6 text-red-600" />;
      break;
    case "system":
      icon = <Settings className="h-6 w-6 text-gray-600" />;
      break;
    default:
      icon = <Bell className="h-6 w-6 text-blue-600" />;
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
      {icon}
    </div>
  );
};

// Helper for relative time (Unchanged)
function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const months = Math.round(days / 30); // Approximate
  const years = Math.round(days / 365); // Approximate

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

export default function NotificationsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 15;

  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
    // You would likely need to refetch or invalidate queries here
    // queryClient.invalidateQueries(...)
  } = useNotificationsList(currentPage, pageSize);

  const notifications = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;
  const hasUnread = notifications.some((n) => !n.isRead);

  // --- Placeholder for 'Mark all as read' ---
  // You would replace this with a useMutation hook from react-query
  const handleMarkAllAsRead = () => {
    // Show a toast immediately for better UX
    toast.promise(
      // This promise would be your actual mutation
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: "Marking all as read...",
        success: () => {
          // On success, you'd invalidate the notifications list
          // to trigger a refetch
          // e.g., queryClient.invalidateQueries(['notifications']);
          return "Notifications marked as read!";
        },
        error: "Could not mark as read.",
      }
    );
    console.warn(
      "handleMarkAllAsRead() is a placeholder. Implement your mutation here."
    );
  };
  // --- End Placeholder ---

  const renderNotificationItem = (notification: NotificationItem) => {
    const content = (
      <div
        className={clsx(
          "flex items-start gap-4 p-5 border-b border-gray-200 last:border-b-0 transition-colors",
          !notification.isRead && "bg-blue-50",
          "hover:bg-gray-100"
        )}
      >
        {/* --- Icon & Unread Badge --- */}
        <div className="relative flex-shrink-0">
          <NotificationIcon type={notification.type} />
          {!notification.isRead && (
            <span
              className="absolute -top-0 -right-0 flex h-3 w-3"
              aria-label="Unread"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
            </span>
          )}
        </div>

        {/* --- Content --- */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-semibold text-gray-900">
              {notification.title}
            </h3>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {timeAgo(notification.createdAt)}
            </span>
          </div>
          <p className="text-sm text-gray-700">{notification.message}</p>
        </div>
      </div>
    );

    if (notification.actionUrl) {
      return (
        <Link
          href={notification.actionUrl}
          key={notification.id}
          passHref
          className="block"
        >
          {content}
        </Link>
      );
    }

    return (
      <div key={notification.id} className="block">
        {content}
      </div>
    );
  };

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      {/* Use a more focused max-width for readability */}
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="flex items-center justify-between mb-6 pb-5 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-lg text-gray-600 mt-1">
              Your recent alerts and updates.
            </p>
          </div>
          {/* --- "Mark all as read" Button --- */}
          {hasUnread && (
            <button
              onClick={handleMarkAllAsRead}
              // You would add a loading/disabled state from your mutation
              // disabled={isMarkingAsRead}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* --- Notification List --- */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {isLoading && !paginatedData && (
            <div className="p-16">
              <CustomLoader />
            </div>
          )}
          {isError && (
            <div className="flex flex-col items-center gap-3 p-16 text-red-700 bg-red-50">
              <AlertCircle className="h-10 w-10" />
              <span className="font-semibold text-lg">
                Failed to load notifications.
              </span>
              <p className="text-sm">Please try again later.</p>
            </div>
          )}
          {!isLoading && !isError && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center p-16 text-gray-500">
              <Inbox className="h-16 w-16 mb-4 text-gray-400" />
              <p className="font-semibold text-lg">No Notifications Yet</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          )}

          {/* --- Render the list --- */}
          {!isError && (notifications.length > 0 || isLoading) && (
            <div
              className={clsx(
                isPlaceholderData && "opacity-60 transition-opacity"
              )}
            >
              {notifications.map(renderNotificationItem)}
            </div>
          )}
        </div>

        {/* --- Pagination --- */}
        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isPlaceholderData}
          />
        )}
      </main>
    </>
  );
}
