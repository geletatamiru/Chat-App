import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
  if (!socket) {
    socket = io("https://chat-app-0l35.onrender.com", {
      withCredentials: true,
      transports: ["websocket"],
      query: { token },
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
