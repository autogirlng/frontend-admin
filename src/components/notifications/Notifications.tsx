"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useNotificationsList } from "@/lib/hooks/notifications/useNotificationsList";
import { NotificationItem } from "./types"; // Adjust path
import { PaginationControls } from "../generic/ui/PaginationControls";
import { AlertCircle, Inbox, Circle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import clsx from "clsx"; // For conditional classes
import CustomBack from "../generic/CustomBack";
import CustomLoader from "../generic/CustomLoader";

// Helper for relative time (optional, but nice UX)
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
  const pageSize = 15; // Number of notifications per page

  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useNotificationsList(currentPage, pageSize);

  const notifications = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  const renderNotificationItem = (notification: NotificationItem) => {
    const content = (
      <div
        className={clsx(
          "p-4 border-b last:border-b-0 flex items-start gap-3 transition-colors",
          !notification.isRead && "bg-indigo-50 hover:bg-indigo-100", // Highlight unread
          notification.isRead && "hover:bg-gray-50"
        )}
      >
        {/* Unread indicator */}
        <div className="mt-1">
          {!notification.isRead ? (
            <Circle className="h-2 w-2 text-indigo-500 fill-current" />
          ) : (
            <div className="h-2 w-2"></div> // Placeholder for alignment
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-semibold text-gray-800">
              {notification.title}
            </h3>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {timeAgo(notification.createdAt)}
            </span>
          </div>
          <p className="text-sm text-gray-600">{notification.message}</p>
          {/* Add priority/type indicators if desired */}
          {/* <span className="text-xs">{notification.priority} / {notification.type}</span> */}
        </div>
      </div>
    );

    // Wrap with Link if actionUrl exists
    if (notification.actionUrl) {
      return (
        <Link
          href={notification.actionUrl}
          key={notification.id}
          passHref
          className="block cursor-pointer"
        >
          {content}
        </Link>
      );
    }

    // Otherwise, just render the content
    return <div key={notification.id}>{content}</div>;
  };

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-lg text-gray-600 mt-1">
              Your recent alerts and updates.
            </p>
          </div>
          {/* Optional: Add "Mark all as read" button here */}
        </div>

        {/* --- Notification List --- */}
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          {isLoading && !paginatedData && <CustomLoader />}
          {isError && (
            <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border-t border-b border-red-200">
              <AlertCircle className="h-8 w-8" />
              <span className="font-semibold">
                Failed to load notifications.
              </span>
            </div>
          )}
          {!isLoading && !isError && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center p-20 text-gray-500">
              <Inbox className="h-16 w-16 mb-4 text-gray-400" />
              <p className="font-semibold">No Notifications Yet</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          )}

          {/* Render the list */}
          {!isError && (notifications.length > 0 || isLoading) && (
            <div className={clsx(isPlaceholderData && "opacity-60")}>
              {notifications.map(renderNotificationItem)}
            </div>
          )}
        </div>

        {/* --- Pagination --- */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isPlaceholderData}
        />
      </main>
    </>
  );
}
