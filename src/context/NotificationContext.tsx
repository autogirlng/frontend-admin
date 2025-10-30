"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { useSession } from "next-auth/react";
import {
  notificationService,
  NotificationCallback,
} from "@/lib/NotificationWebSocketService";
import { useNotificationsList } from "@/lib/hooks/notifications/useNotificationsList";
import { NotificationItem } from "@/components/notifications/types";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  isConnected: boolean;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch the initial batch of notifications
  const { data: initialData, isLoading: isLoadingList } = useNotificationsList(
    0,
    20
  );

  // Effect to populate state from initial API fetch
  useEffect(() => {
    if (initialData?.content) {
      console.log(
        "📋 Loading initial notifications:",
        initialData.content.length
      );
      setNotifications(initialData.content);
      const initialUnread = initialData.content.filter((n) => !n.isRead).length;
      setUnreadCount(initialUnread);
    }
  }, [initialData]);

  // Play notification sound - simple approach that works
  const playNotificationSound = useCallback(() => {
    console.log("🔊 Attempting to play notification sound...");
    try {
      const audio = new Audio("/notification/autogirl_notification_sound.mp3");
      audio.volume = 0.7;
      audio
        .play()
        .then(() => {
          console.log("✅ Sound played successfully!");
        })
        .catch((error) => {
          console.error("❌ Could not play notification sound:", error);
        });
    } catch (error) {
      console.error("❌ Error creating audio:", error);
    }
  }, []);

  // Callback function for the WebSocket service - MUST be stable reference
  const handleNewNotification = useCallback(
    (notification: NotificationItem) => {
      console.log("🔔 NEW NOTIFICATION RECEIVED IN CONTEXT:", notification);
      console.log("📝 Notification details:", {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
      });

      // 1. Show toast notification
      toast.success(
        <div className="text-sm">
          <p className="font-semibold">{notification.title}</p>
          <p>{notification.message}</p>
        </div>,
        { icon: "🔔", duration: 5000 }
      );

      // 2. Update notifications state IMMEDIATELY using functional update
      setNotifications((prev) => {
        console.log(
          "📝 Adding notification to list. Previous count:",
          prev.length
        );
        const newList = [notification, ...prev];
        console.log("📝 New count:", newList.length);
        return newList;
      });

      // 3. Update unread count if the notification is unread
      if (!notification.isRead) {
        setUnreadCount((prev) => {
          const newCount = prev + 1;
          console.log("📊 Unread count updated:", prev, "→", newCount);
          return newCount;
        });
      }

      // 4. Play notification sound
      playNotificationSound();

      // 5. Invalidate React Query cache (optional, for consistency)
      queryClient.invalidateQueries({ queryKey: ["notificationsList"] });
    },
    [queryClient, playNotificationSound]
  );

  // Effect to connect/disconnect based on session status
  useEffect(() => {
    console.log("🔄 Session status changed:", status);

    if (
      status === "authenticated" &&
      session?.user?.accessToken &&
      session?.user?.id
    ) {
      console.log("🔗 Activating WebSocket...");
      console.log("👤 User ID:", session.user.id);
      console.log("🎯 Registering callback function...");

      // CRITICAL: Pass userId, token, and callback to the WebSocket service
      notificationService.activate(
        session.user.id as string, // userId
        session.user.accessToken, // JWT token
        handleNewNotification // callback
      );

      setIsConnected(true);
      console.log("✅ WebSocket activated with userId subscription");
    } else if (status === "unauthenticated") {
      console.log("🔌 Deactivating WebSocket...");
      notificationService.deactivate();
      setNotifications([]);
      setUnreadCount(0);
      setIsConnected(false);
    }

    // Don't cleanup on every render, only when status changes to unauthenticated
    return () => {
      if (status === "unauthenticated") {
        console.log("🧹 Cleaning up WebSocket due to unauthenticated status");
        notificationService.deactivate();
      }
    };
  }, [
    status,
    session?.user?.accessToken,
    session?.user?.id,
    handleNewNotification,
  ]);

  // Function to mark a notification as read
  const markAsRead = useCallback(
    (id: string) => {
      console.log("✓ Marking notification as read:", id);
      const notification = notifications.find((n) => n.id === id);

      if (notification && !notification.isRead) {
        // Update local state
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        // Send to backend
        notificationService.markAsRead(id);

        // Invalidate cache
        queryClient.invalidateQueries({ queryKey: ["notificationsList"] });
      }
    },
    [notifications, queryClient]
  );

  // Function to mark all as read
  const markAllAsRead = useCallback(() => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    console.log("✓✓ Marking all as read. Count:", unreadIds.length);

    if (unreadIds.length === 0) return;

    // Update local state
    setNotifications((prev) =>
      prev.map((n) => (n.isRead ? n : { ...n, isRead: true }))
    );
    setUnreadCount(0);

    // Send to backend
    unreadIds.forEach((id) => notificationService.markAsRead(id));

    // Invalidate cache
    queryClient.invalidateQueries({ queryKey: ["notificationsList"] });
  }, [notifications, queryClient]);

  // Memoize the context value
  const contextValue = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      isConnected,
      isLoading: isLoadingList && notifications.length === 0,
    }),
    [
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      isConnected,
      isLoadingList,
    ]
  );

  // Debug logging for state changes
  useEffect(() => {
    console.log("📊 State Update:", {
      notificationCount: notifications.length,
      unreadCount,
      isConnected,
      firstNotification: notifications[0]?.title || "none",
    });
  }, [notifications, unreadCount, isConnected]);

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
