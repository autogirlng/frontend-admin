"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
  useRef,
} from "react";
import { useSession } from "next-auth/react";
import {
  notificationService,
  NotificationCallback,
} from "@/lib/NotificationWebSocketService";
import {
  useNotificationsList,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/lib/hooks/notifications/useNotificationsList";
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

  // ✅ Audio Ref to control the HTML audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ✅ API Mutations for actions (ensures popover read works)
  const { mutate: apiMarkRead } = useMarkNotificationRead();
  const { mutate: apiMarkAllRead } = useMarkAllNotificationsRead();

  // Fetch the initial batch of notifications
  const { data: initialData, isLoading: isLoadingList } = useNotificationsList(
    0,
    20
  );

  // Sync state with initial fetch
  useEffect(() => {
    if (initialData?.content) {
      setNotifications(initialData.content);
      const initialUnread = initialData.content.filter((n) => !n.isRead).length;
      setUnreadCount(initialUnread);
    }
  }, [initialData]);

  // ✅ Sound Unlocker: Browsers block audio until user interaction.
  // This listens for the first click anywhere to "load" the audio.
  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current.load();
        // Optional: Play and immediately pause to "warm up" the engine
        // audioRef.current.play().catch(() => {}).then(() => audioRef.current?.pause());
      }
      document.removeEventListener("click", unlockAudio);
    };
    document.addEventListener("click", unlockAudio);
    return () => document.removeEventListener("click", unlockAudio);
  }, []);

  // Helper to play sound safely
  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      // Reset time to 0 so rapid notifications play correctly
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => {
        console.warn("Audio blocked or not loaded:", e);
      });
    }
  }, []);

  // Callback function for the WebSocket service
  const handleNewNotification: NotificationCallback = useCallback(
    (notification: NotificationItem) => {
      console.log("🔔 New Notification:", notification.title);

      // 1. Show toast
      toast.success(
        <div className="text-sm">
          <p className="font-semibold">{notification.title}</p>
          <p>{notification.message}</p>
        </div>,
        { icon: "🔔", duration: 5000 }
      );

      // 2. Update state
      setNotifications((prev) => [notification, ...prev]);
      if (!notification.isRead) {
        setUnreadCount((prev) => prev + 1);
      }

      // 3. Play Sound
      playNotificationSound();

      // 4. Refresh background cache
      queryClient.invalidateQueries({ queryKey: ["notificationsList"] });
    },
    [queryClient, playNotificationSound]
  );

  // WebSocket Connection Logic
  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.accessToken &&
      session?.user?.id
    ) {
      notificationService.activate(
        session.user.id,
        session.user.accessToken,
        handleNewNotification
      );
      setIsConnected(true);
    } else if (status === "unauthenticated") {
      notificationService.deactivate();
      setNotifications([]);
      setUnreadCount(0);
      setIsConnected(false);
    }

    return () => {
      if (status === "unauthenticated") {
        notificationService.deactivate();
      }
    };
  }, [
    status,
    session?.user?.accessToken,
    session?.user?.id,
    handleNewNotification,
  ]);

  // ✅ Mark as Read (Optimistic + API)
  const markAsRead = useCallback(
    (id: string) => {
      const notification = notifications.find((n) => n.id === id);

      if (notification && !notification.isRead) {
        // 1. Optimistic Update
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        // 2. Call API
        apiMarkRead(id);
      }
    },
    [notifications, apiMarkRead]
  );

  // ✅ Mark All as Read (Optimistic + API)
  const markAllAsRead = useCallback(() => {
    const hasUnread = notifications.some((n) => !n.isRead);

    if (hasUnread) {
      // 1. Optimistic Update
      setNotifications((prev) =>
        prev.map((n) => (n.isRead ? n : { ...n, isRead: true }))
      );
      setUnreadCount(0);

      // 2. Call API
      apiMarkAllRead();
    }
  }, [notifications, apiMarkAllRead]);

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

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {/* ✅ Hidden Audio Element */}
      <audio ref={audioRef} style={{ display: "none" }} preload="auto">
        <source
          src="/notification/autogirl_notification_sound.mp3"
          type="audio/mpeg"
        />
      </audio>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
