const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
const { handleSocketConnection } = require('./handlers');

const onlineUsers = new Map();

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    try {
      const decoded = jwt.verify(token, process.env.jwt_PrivateKey);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on('connection', (socket) => handleSocketConnection(socket, io, onlineUsers));
}

module.exports = { setupSocket };
