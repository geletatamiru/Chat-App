const onlineUsers = new Map(); 
const mongoose = require('mongoose');
const register = require('./routes/register');
const auth = require('./routes/auth');
const messages = require('./routes/messages')
const users = require('./routes/users');
const http = require("http");
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Message, validateMessage} = require('./models/message');
const { Server } = require("socket.io");
require('dotenv').config();
const app = express();

mongoose.connect('mongodb://localhost:27017/chat')
  .then(() => console.log('Connected to mongoDB'))
  .catch(err => console.log(err.message));

app.use(express.json());
app.use(cors({
  exposedHeaders: ['x-auth-token']
}));

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})
app.use('/api/register', register);
app.use('/api/auth', auth)
app.use('/api/messages', messages);
app.use('/api/users', users);

io.on('connection', (socket) => {
  console.log("Socket connected", socket.id);

  socket.on("add_user", (userId) => {
    onlineUsers.set(userId, socket.id);
  })
  
  socket.on("send_message", async ({senderId, receiverId, text}) => {
    try{
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        text,
      });
      await message.save();

      const receiverSocketId = onlineUsers.get(receiverId);
      console.log(receiverSocketId)
      if(receiverSocketId){
        io.to(receiverSocketId).emit("receive_message", {
          senderId,
          text
        });
      }
    }catch(error){
      console.error("Error saving message: ", error.message);
    }
  })

  socket.on("disconnect", () => {
    console.log("Scoket disconnected:", socket.id);
    for (let [userId, sId] of onlineUsers.entries()) {
      if (sId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
  
})
const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
})