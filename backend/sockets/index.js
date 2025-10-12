const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
const { handleSocketConnection } = require('./handlers');

const onlineUsers = new Map();

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    console.log(token);
    if (!token) {
      console.log("❌ No token provided");
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.jwt_PrivateKey);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      console.log("❌ Invalid token:", err.message);
      next(new Error("Authentication error"));
    }
  });

  io.on('connection', (socket) => {
    handleSocketConnection(socket, io, onlineUsers)
});
}

module.exports = { setupSocket };
