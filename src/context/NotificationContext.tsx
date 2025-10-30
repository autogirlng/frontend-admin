"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo, // Import useMemo
} from "react";
import { useSession } from "next-auth/react";
import {
  notificationService,
  Notification,
} from "@/lib/NotificationWebSocketService"; // Adjust path
import { toast } from "react-hot-toast";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  isConnected: boolean; // Add connection status
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  // Track connection status locally if needed, though service manages internal state
  const [isConnected, setIsConnected] = useState(false);

  // Callback function for the WebSocket service
  const handleNewNotification = useCallback((notification: Notification) => {
    toast.success(
      <div className="text-sm">
        <p className="font-semibold">{notification.title}</p>
        <p>{notification.message}</p>
      </div>,
      { icon: "🔔", duration: 5000 }
    );
    setNotifications((prev) => [notification, ...prev]);
    // Only increment if not already marked read (if backend sends 'read' status)
    if (!notification.read) {
      setUnreadCount((prev) => prev + 1);
    }
    // Play sound (optional)
    const audio = new Audio("/notification/autogirl_notification_sound.mp3");
    audio
      .play()
      .catch((e) => console.warn("Could not play notification sound:", e));
  }, []);

  // Effect to connect/disconnect based on session status
  useEffect(() => {
    let isActive = true; // Flag to prevent state updates on unmounted component

    if (status === "authenticated" && session?.user?.accessToken) {
      console.log("Session authenticated, activating WebSocket...");
      // Pass a callback to update local connection status (optional)
      notificationService.activate(session.user.accessToken, (notification) => {
        if (isActive) handleNewNotification(notification);
      });
      // Simple status update - note: this doesn't track library's internal reconnects precisely
      if (isActive) setIsConnected(true);
    } else if (status === "unauthenticated" || status === "loading") {
      // Deactivate if loading or unauthenticated
      console.log(`Session status: ${status}. Deactivating WebSocket...`);
      notificationService.deactivate();
      if (isActive) {
        setNotifications([]);
        setUnreadCount(0);
        setIsConnected(false);
      }
    }

    return () => {
      isActive = false;
      // Only deactivate explicitly if status is NOT authenticated on cleanup
      // This prevents unnecessary disconnects during development hot-reloads
      if (status !== "authenticated") {
        console.log(
          "Cleanup: Deactivating WebSocket due to status change from authenticated."
        );
        notificationService.deactivate();
        setIsConnected(false); // Update local state on cleanup too
      } else {
        console.log(
          "Cleanup: Status still authenticated, leaving WebSocket active."
        );
      }
    };
    // Use only accessToken and status as stable dependencies
  }, [status, session?.user?.accessToken, handleNewNotification]);

  // Function to mark a notification as read
  const markAsRead = useCallback(
    (id: string) => {
      // Wrap in useCallback
      // Find the notification first to check if it's already read
      const notificationToMark = notifications.find((n) => n.id === id);
      let shouldDecrement = false;

      setNotifications((prev) =>
        prev.map((n) => {
          if (n.id === id && !n.read) {
            shouldDecrement = true; // Mark that we should decrement count
            return { ...n, read: true };
          }
          return n;
        })
      );

      if (shouldDecrement) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
        notificationService.markAsRead(id); // Tell backend
      }
    },
    [notifications]
  ); // Dependency: notifications

  // Use useMemo for context value
  const contextValue = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      isConnected, // Expose connection status
    }),
    [notifications, unreadCount, markAsRead, isConnected]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook to use the context
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
