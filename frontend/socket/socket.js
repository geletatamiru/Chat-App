import { io } from "socket.io-client";

let socket;
const baseUrl = import.meta.env.VITE_BASE_URL;

export const connectSocket = (token) => {
  if (!socket) {
    socket = io(baseUrl, {
      withCredentials: true,
      transports: ["websocket"],
      auth: { token }, 
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });
  } else {
    socket.auth = { token };

    if (!socket.connected) {
      socket.connect();
    }
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🚪 Socket disconnected");
  }
};

export const getSocket = () => socket;
