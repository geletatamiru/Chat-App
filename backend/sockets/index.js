const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
const { userHandler } = require("./handlers/userHandler");
const { chatHandler } = require("./handlers/chatHandler");
const { statusHandler } = require("./handlers/statusHandler");

const onlineUsers = new Map();

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
      credentials: true,
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication error.No token provided."));
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error. Invalid or expired token"));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);
    userHandler(socket, io, onlineUsers);
    chatHandler(socket, io, onlineUsers);
    statusHandler(socket, io, onlineUsers);
});
}

module.exports = { setupSocket };
