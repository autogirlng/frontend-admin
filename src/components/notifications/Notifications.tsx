// app/dashboard/notifications/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useNotificationsList,
  useMarkNotificationRead,
  useDeleteNotification,
  useMarkAllNotificationsRead,
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
  Trash2,
  Check,
  X,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import clsx from "clsx";
import CustomBack from "../generic/CustomBack";
import CustomLoader from "../generic/CustomLoader";
import Button from "../generic/ui/Button"; // Assuming you have a generic button, otherwise standard <button> works

// --- Helper Components ---

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
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
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

// --- NEW: Custom Delete Modal Component ---
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete Notification?
          </h3>
          <p className="text-sm text-gray-500">
            Are you sure you want to remove this notification? This action
            cannot be undone.
          </p>
        </div>
        <div className="flex border-t border-gray-100 bg-gray-50 p-4 gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 border border-transparent rounded-lg text-white font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center gap-2"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function NotificationsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 15;

  // --- NEW: State for Modal ---
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useNotificationsList(currentPage, pageSize);

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

  // Modified: Opens modal instead of confirm()
  const initiateDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setItemToDelete(id);
  };

  // Modified: Actually performs the delete
  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete, {
        onSettled: () => setItemToDelete(null), // Close modal after
      });
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
          "flex flex-col md:flex-row md:items-start gap-4 p-5 border-b border-gray-200 last:border-b-0 transition-colors group relative",
          !notification.isRead && "bg-blue-50/60", // Lighter blue for better contrast
          "hover:bg-gray-50"
        )}
      >
        <div className="flex gap-4 w-full">
          {/* --- Icon & Unread Badge --- */}
          <div className="relative flex-shrink-0">
            <NotificationIcon type={notification.type} />
            {!notification.isRead && (
              <span
                className="absolute -top-1 -right-1 flex h-3 w-3"
                aria-label="Unread"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
              </span>
            )}
          </div>

          {/* --- Content --- */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1 gap-2">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
                {notification.title}
              </h3>
              <span className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap pt-0.5">
                {timeAgo(notification.createdAt)}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed break-words">
              {notification.message}
            </p>
          </div>
        </div>

        {/* --- MOBILE ACTIONS (Visible below content on small screens) --- */}
        <div className="flex md:hidden items-center justify-end gap-3 pt-2 mt-2 border-t border-gray-100/50 w-full">
          {!notification.isRead && (
            <button
              onClick={(e) => handleMarkRead(e, notification.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-blue-700 bg-blue-100 active:bg-blue-200"
            >
              <Check className="h-3.5 w-3.5" /> Mark Read
            </button>
          )}
          <button
            onClick={(e) => initiateDelete(e, notification.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-red-700 bg-red-100 active:bg-red-200"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>

        {/* --- DESKTOP ACTIONS (Absolute positioned, visible on Hover) --- */}
        <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/80 backdrop-blur-[2px] p-1.5 rounded-lg shadow-sm border border-gray-100">
          {!notification.isRead && (
            <button
              onClick={(e) => handleMarkRead(e, notification.id)}
              className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Mark as read"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={(e) => initiateDelete(e, notification.id)}
            className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

      {/* --- RENDER MODAL --- */}
      <DeleteConfirmationModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />

      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="flex items-center justify-between mb-6 pb-5 border-b border-gray-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Notifications
            </h1>
            <p className="text-sm md:text-lg text-gray-600 mt-1">
              Your recent alerts and updates.
            </p>
          </div>
          {hasUnread && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markAllReadMutation.isPending}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {markAllReadMutation.isPending ? "Marking..." : "Mark all read"}
            </button>
          )}
        </div>

        {/* --- Notification List --- */}
        <div className="bg-white border border-gray-200 overflow-hidden min-h-[300px]">
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
