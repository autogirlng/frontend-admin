// app/dashboard/notifications/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useNotificationsList,
  useMarkNotificationRead, // ✅ Import
  useDeleteNotification, // ✅ Import
  useMarkAllNotificationsRead, // ✅ Import
} from "@/lib/hooks/notifications/useNotificationsList";
import { NotificationItem } from "./types";
import { PaginationControls } from "../generic/ui/PaginationControls";
import {
  AlertCircle,
  Inbox,
  Bell,
  MessageSquare,
  AlertTriangle,
  Settings,
  Trash2, // ✅ Import Trash2
  Check, // ✅ Import Check
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import clsx from "clsx";
import CustomBack from "../generic/CustomBack";
import CustomLoader from "../generic/CustomLoader";

// ... (NotificationIcon and timeAgo helpers remain unchanged) ...
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

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const months = Math.round(days / 30);
  const years = Math.round(days / 365);

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
  } = useNotificationsList(currentPage, pageSize);

  // ✅ Instantiate mutations
  const markReadMutation = useMarkNotificationRead();
  const deleteMutation = useDeleteNotification();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const notifications = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;
  const hasUnread = notifications.some((n) => !n.isRead);

  // --- Handlers ---

  const handleMarkAllAsRead = () => {
    if (markAllReadMutation.isPending) return;
    markAllReadMutation.mutate();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent link navigation if wrapped
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this notification?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleMarkRead = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    markReadMutation.mutate(id);
  };

  const renderNotificationItem = (notification: NotificationItem) => {
    const content = (
      <div
        className={clsx(
          "flex items-start gap-4 p-5 border-b border-gray-200 last:border-b-0 transition-colors group relative",
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
        <div className="flex-1 pr-8">
          {" "}
          {/* Add padding-right for buttons */}
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

        {/* --- Actions (Visible on Hover) --- */}
        <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!notification.isRead && (
            <button
              onClick={(e) => handleMarkRead(e, notification.id)}
              className="p-1.5 rounded-full bg-white text-blue-600 hover:bg-blue-100 border border-gray-200 shadow-sm"
              title="Mark as read"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={(e) => handleDelete(e, notification.id)}
            className="p-1.5 rounded-full bg-white text-red-600 hover:bg-red-100 border border-gray-200 shadow-sm"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
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
          // ✅ If user clicks the whole row (link), mark as read automatically?
          // Usually better handled by the page load or explicitly.
          // For now, let's just navigate.
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
              disabled={markAllReadMutation.isPending}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
            >
              {markAllReadMutation.isPending
                ? "Marking..."
                : "Mark all as read"}
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
