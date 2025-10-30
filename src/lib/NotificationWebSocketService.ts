import SockJS from "sockjs-client";
import { Client, IFrame, StompSubscription, IMessage } from "@stomp/stompjs";
import { NotificationItem } from "@/components/notifications/types";

export type NotificationCallback = (notification: NotificationItem) => void;

class NotificationWebSocketService {
  private client: Client | null = null;
  private subscriptions: StompSubscription[] = [];
  private userId: string | null = null;
  private token: string | null = null;
  private onNotificationCallback: NotificationCallback | null = null;
  private wsUrl: string;
  private isExplicitlyDisconnected: boolean = false;

  constructor() {
    this.wsUrl =
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:8080/api/ws";
    if (!this.wsUrl) {
      console.error("Error: NEXT_PUBLIC_WEBSOCKET_URL is not defined.");
    }
  }

  /**
   * Activate the WebSocket connection with userId
   */
  activate(
    userId: string,
    jwtToken: string,
    onNotification: NotificationCallback
  ) {
    console.log("🎯 activate() called");
    console.log("👤 userId:", userId);
    console.log("🔑 token:", jwtToken ? "present" : "missing");

    // ✅ Store userId and callback
    this.userId = userId;
    this.onNotificationCallback = onNotification;
    console.log("✅ Callback registered:", !!this.onNotificationCallback);

    // If client is already active with same user, just update callback
    if (this.client?.active && this.userId === userId) {
      console.log("ℹ️ Client already active for same user, callback updated");
      return;
    }

    // If we need to reconnect for different user, disconnect first
    if (this.client?.active && this.userId !== userId) {
      console.log("🔄 Different user detected, reconnecting...");
      this.deactivate();
    }

    if (!jwtToken || !userId) {
      console.log("❌ Missing token or userId, cannot activate.");
      return;
    }

    this.token = jwtToken;
    this.isExplicitlyDisconnected = false;

    console.log("🚀 Initializing WebSocket client...");

    this.client = new Client({
      webSocketFactory: () => new SockJS(this.wsUrl),
      connectHeaders: {
        Authorization: `Bearer ${this.token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        // console.log('STOMP DEBUG:', str);
      },

      onConnect: (frame: IFrame) => {
        console.log("✅ WebSocket Connected:", frame.command);

        // ✅ Subscribe using userId in the path
        const destination = `/user/${this.userId}/queue/notifications`;
        console.log("📡 Subscribing to:", destination);

        const subscription = this.client!.subscribe(
          destination,
          (message: IMessage) => {
            console.log("📬 RAW MESSAGE RECEIVED FROM WEBSOCKET!");
            console.log("📬 Message body:", message.body);

            try {
              const notification: NotificationItem = JSON.parse(message.body);
              console.log("📬 Parsed notification:", notification);

              // ✅ Call the callback
              if (this.onNotificationCallback) {
                console.log("✅ Calling notification callback NOW!");
                this.onNotificationCallback(notification);
                console.log("✅ Callback executed successfully");
              } else {
                console.error("❌ NO CALLBACK REGISTERED!");
              }
            } catch (e) {
              console.error("❌ Error parsing notification:", e);
              console.error("❌ Raw message was:", message.body);
            }
          }
        );

        this.subscriptions.push(subscription);
        console.log(
          "✅ Subscription established successfully to:",
          destination
        );
      },

      onStompError: (frame: IFrame) => {
        console.error("❌ Broker reported error:", frame.headers["message"]);
        console.error("Additional details:", frame.body);
      },

      onWebSocketError: (event: Event) => {
        console.error("❌ WebSocket error:", event);
      },

      onDisconnect: (frame: IFrame) => {
        console.log("🔌 WebSocket disconnected.", frame.command);
        this.subscriptions = [];
        if (!this.isExplicitlyDisconnected) {
          console.log("🔁 Will attempt to reconnect automatically...");
        }
      },

      beforeConnect: () => {
        console.log("⏳ Attempting to connect SockJS...");
      },
    });

    this.client.activate();
  }

  /**
   * Deactivate the connection explicitly
   */
  deactivate() {
    console.log("🛑 Attempting explicit disconnect...");
    this.isExplicitlyDisconnected = true;
    this.userId = null;
    this.token = null;
    this.onNotificationCallback = null;

    if (this.client) {
      this.subscriptions.forEach((sub) => {
        try {
          sub.unsubscribe();
        } catch (e) {
          console.warn("⚠️ Error unsubscribing:", e);
        }
      });
      this.subscriptions = [];

      try {
        this.client.deactivate();
        console.log("🚪 Deactivation initiated.");
      } catch (e) {
        console.error("❌ Error during deactivation:", e);
      }
      this.client = null;
    } else {
      console.log("ℹ️ Client already null, no need to deactivate.");
    }
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string) {
    if (this.client && this.client.active) {
      this.client.publish({
        destination: "/app/notification/read",
        body: notificationId,
      });
      console.log("✓ Sent mark as read for:", notificationId);
    } else {
      console.warn("⚠️ Cannot mark as read: WebSocket not connected/active.");
    }
  }
}

// Export a singleton instance
export const notificationService = new NotificationWebSocketService();
