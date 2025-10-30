import SockJS from "sockjs-client";
// Use Client instead of CompatClient/Stomp
import { Client, IFrame, StompSubscription, IMessage } from "@stomp/stompjs";

// Define the shape of a notification
export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string; // Assuming ISO string
  read: boolean;
  // Add any other fields your backend sends
}

// Type for the callback function
export type NotificationCallback = (notification: Notification) => void;

class NotificationWebSocketService {
  private client: Client | null = null;
  private subscriptions: StompSubscription[] = [];
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
   * Activate the WebSocket connection
   */
  activate(jwtToken: string, onNotification: NotificationCallback) {
    // Prevent multiple activations if already active or connecting
    if (this.client?.active || !jwtToken) {
      console.log(
        `WebSocket already active or no token provided. State: ${this.client?.state}`
      );
      return;
    }

    this.token = jwtToken;
    this.onNotificationCallback = onNotification;
    this.isExplicitlyDisconnected = false; // Allow auto-reconnect

    console.log("🚀 Initializing WebSocket client...");

    this.client = new Client({
      // Provide a factory function for SockJS
      webSocketFactory: () => new SockJS(this.wsUrl),
      connectHeaders: {
        Authorization: `Bearer ${this.token}`,
      },
      // Configure reconnection delay (in ms)
      reconnectDelay: 5000,
      // Heartbeat (optional but recommended)
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // Debugging (optional)
      debug: (str) => {
        // console.log('STOMP DEBUG:', str);
      },

      onConnect: (frame: IFrame) => {
        console.log("✅ WebSocket Connected:", frame.command);
        // Subscribe to personal notification queue
        const subscription = this.client!.subscribe(
          "/user/queue/notifications",
          (message: IMessage) => {
            try {
              const notification: Notification = JSON.parse(message.body);
              console.log("📬 Received notification:", notification);
              if (this.onNotificationCallback) {
                this.onNotificationCallback(notification);
              }
            } catch (e) {
              console.error("Error parsing notification:", e);
            }
          },
          {
            /* Optional subscription headers */
          }
        );
        this.subscriptions.push(subscription);
      },

      onStompError: (frame: IFrame) => {
        console.error("❌ Broker reported error:", frame.headers["message"]);
        console.error("Additional details:", frame.body);
      },

      onWebSocketError: (event: Event) => {
        console.error("❌ WebSocket error:", event);
        // Reconnect will be attempted automatically by the library due to reconnectDelay
      },

      onDisconnect: (frame: IFrame) => {
        console.log("🔌 WebSocket disconnected.", frame.command);
        this.subscriptions = []; // Clear subscriptions on disconnect
        // Only log reconnect attempt if it wasn't an explicit disconnect
        if (!this.isExplicitlyDisconnected) {
          console.log("🔁 Will attempt to reconnect automatically...");
        }
      },

      // Handle issues during SockJS connection phase
      beforeConnect: () => {
        console.log("Attempting to connect SockJS...");
      },
    });

    // Activate the client
    this.client.activate();
  }

  /**
   * Deactivate the connection explicitly
   */
  deactivate() {
    console.log("Attempting explicit disconnect...");
    this.isExplicitlyDisconnected = true; // Prevent auto-reconnect attempts after this
    this.token = null;
    this.onNotificationCallback = null;

    if (this.client) {
      // Unsubscribe doesn't seem necessary with client.deactivate() but included for safety
      this.subscriptions.forEach((sub) => {
        try {
          sub.unsubscribe();
        } catch (e) {
          console.warn("Error unsubscribing:", e);
        }
      });
      this.subscriptions = [];

      try {
        this.client.deactivate(); // This handles closing the connection
        console.log("🚪 Deactivation initiated.");
      } catch (e) {
        console.error("Error during deactivation:", e);
      }
      this.client = null; // Clear the client instance
    } else {
      console.log("Client already null, no need to deactivate.");
    }
  }

  /**
   * Mark notification as read (optional)
   */
  markAsRead(notificationId: string) {
    if (this.client && this.client.active) {
      this.client.publish({
        destination: "/app/notification/read", // Your backend endpoint
        body: JSON.stringify({ id: notificationId }),
      });
    } else {
      console.warn("Cannot mark as read: WebSocket not connected/active.");
    }
  }
}

// Export a singleton instance
export const notificationService = new NotificationWebSocketService();
