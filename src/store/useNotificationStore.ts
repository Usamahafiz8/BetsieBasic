import { create } from "zustand";
import { useApiRequest } from "../api/useApiRequest";
import { END_POINTS } from "../api/END_POINTS";
import { io, socket } from "socket.io-client";
import Sound from "react-native-sound";
import { Platform } from "react-native";

type Notification = {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
};

type NotificationState = {
  list: Notification[];
  socket: socket | null;
  fetchNotifications: () => Promise<void>;
  connectsocket: (token: string) => void;
  disconnectsocket: () => void;
  handleIncoming: (notif: Notification) => void;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  list: [],
  socket: null,

  fetchNotifications: async () => {
    const apiRequest = useApiRequest();
    try {
      console.log("📡 Fetching notifications...");
      const res = await apiRequest(END_POINTS.GET_NOTIFICATIONS);
      console.log("✅ Notifications fetched:", res?.length || 0);
      if (Array.isArray(res)) set({ list: res });
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
    }
  },

  connectsocket: (token) => {
    console.log("⚙️ Initializing socket.IO connection...");
    console.log("🔑 Using token:", token?.slice(0, 20) + "...");

    const socket = io("http://13.61.183.201:3002", {
      transports: ["websocket"],
      query: { token },
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 10,
    });

    socket.on("connect", () => {
      console.log("✅ [socket] Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("❌ [socket] Connection Error:", err.message);
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log("♻️ [socket] Reconnect Attempt:", attempt);
    });

    socket.on("reconnect_failed", () => {
      console.log("🚫 [socket] Reconnect Failed");
    });

    socket.on("notification", (notif) => {
      console.log("📩 [socket] New Notification Received:", notif);
      get().handleIncoming(notif);
    });

    socket.on("disconnect", (reason) => {
      console.log("⚠️ [socket] Disconnected:", reason);
    });

    console.log("🚀 [socket] Connection setup complete, waiting for events...");
    set({ socket });
  },

  disconnectsocket: () => {
    const { socket } = get();
    if (socket) {
      console.log("🔌 [socket] Disconnecting...");
      socket.disconnect();
    }
    set({ socket: null });
    console.log("✅ [socket] Disconnected cleanly");
  },

  handleIncoming: (notif) => {
    console.log("🆕 [Handler] Handling incoming notification:", notif);
    set((state) => ({ list: [notif, ...state.list] }));
    playNotificationSound();
    showBanner(notif);
  },
}));

// 🔔 Sound setup
function playNotificationSound() {
  console.log("🎵 Playing notification sound...");
  const sound = new Sound(
    Platform.OS === "ios" ? "notification.mp3" : "notification.mp3",
    Sound.MAIN_BUNDLE,
    (error) => {
      if (error) console.log("🔇 Sound error:", error);
      else sound.play();
    }
  );
}

// 🪧 Local banner (foreground)
function showBanner(notif: any) {
  console.log("🪧 [Banner] Title:", notif.title);
  console.log("🪧 [Banner] Message:", notif.message);
}
