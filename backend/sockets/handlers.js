const { z } = require('zod');
const { Message } = require('../models/message');
const logger = require('../utils/logger');
const messageSchema = require("../validation/messageValidation");

function handleSocketConnection(socket, io, onlineUsers) {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on("add_user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(onlineUsers);
    io.emit('online-users', Array.from(onlineUsers.keys()))
  });

  socket.on("send_message", async ({ receiver, text }, callback) => {
    
    try {
      const parsedMessage = messageSchema.parse({receiver, text});
      const message = new Message({ sender: socket.userId, receiver: parsedMessage.receiver, text: parsedMessage.text });
      await message.save();

      const receiverSocketId = onlineUsers.get(parsedMessage.receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", message);
      }
      callback({success: true, message: "message sent", data: message});
    } catch (error) {
      if(error instanceof z.ZodError){
        logger.error(error.issues[0].message);
        callback({success: false, message: "Error sending message", data: error.issues[0].message});
      }else {
        logger.error(`Error saving message: ${error.message}`);
        callback({success: false, message: "Error sending message", data: "Server error. Failed to send message"});
      }
      
    }
  });

  socket.on("message_seen", (senderId) => {
    const senderSocketId = onlineUsers.get(senderId);
    if(senderSocketId){
        io.to(senderSocketId).emit('seen_acknowledged', {
          receiverId: socket.userId
        })
      }
  })

  socket.on("disconnect", () => {
    logger.info(`Socket disconnected: ${socket.id}`);
    
    for (let [userId, sId] of onlineUsers.entries()) {
      if (sId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('online-users', Array.from(onlineUsers.keys()));
  });
}

module.exports = { handleSocketConnection };
