const userSocketMap = new Map(); 
const mongoose = require('mongoose');
const register = require('./routes/register');
const auth = require('./routes/auth');
const messages = require('./routes/messages')
const users = require('./routes/users');
const http = require("http");
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Server } = require("socket.io");
require('dotenv').config();
const app = express();

mongoose.connect('mongodb://localhost:27017/chat')
  .then(() => console.log('Connected to mongoDB'))
  .catch(err => console.log(err.message));

app.use(express.json());
app.use(cors());

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})
app.use('/register', register);
app.use('/auth', auth)
app.use('/api/messages', messages);
app.use('/api/users', users);

io.on('connection', (socket) => {
  console.log("Socket connected", socket.id);

  socket.on('authenticate', (token) => {
    try {
      const decoded = jwt.verify(token, process.env.jwt_PrivateKey);
      const userId = decoded.id;

      userSocketMap.set(userId, socket.id);

      console.log(`User ${userId} authenticated as socket ${socket.id}`);
    }catch(error){
      console.log("Invalid token:", err.message);
      socket.disconnect(true);
    }
  })
  socket.on("disconnect", () => {
    console.log("Scoket disconnected:", socket.id);
    for (let [userId, sId] of userSocketMap.entries()) {
      if (sId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  });
  
})
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})