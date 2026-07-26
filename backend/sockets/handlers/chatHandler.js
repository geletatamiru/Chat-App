const { z } = require('zod');
const messageSchema = require("../../validation/messageValidation");
const { Message } = require('../../models/message');
const logger = require('../../utils/logger');

function chatHandler(socket, io, onlineUsers) {
  socket.on("send_message", async ({ receiver, text }, callback) => {
    try {
      const validation = messageSchema.safeParse({ receiver, text });

      if (!validation.success) {
        const errorMessage = validation.error.issues[0].message;
        logger.error(`Validation failed: ${errorMessage}`);
        return callback({
          success: false,
          message: "Error sending message",
          data: errorMessage
        });
      }
      const parsedMessage = validation.data;

      const message = new Message({ 
        sender: socket.userId, 
        receiver: parsedMessage.receiver, 
        text: parsedMessage.text 
      });
      await message.save();

      const receiverSocketId = onlineUsers.get(parsedMessage.receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", message);
      }

      callback({ success: true, message: "message sent", data: message });

    } catch (error) {
      logger.error(`Error saving message: ${error.message}`);
      callback({ 
        success: false, 
        message: "Error sending message", 
        data: "Server error. Failed to send message" 
      });
    }
  });


  

  socket.on("delete-message", async ({ msgId, receiverId}, callback) => {
    try {
      const deletedMessage = await Message.findOneAndDelete({
        _id: msgId,
        sender: socket.userId,
      });

      if(deletedMessage){
        callback({success: true, message: "Message deleted successfully"});
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("message-deleted", msgId);
        }
      }else {
        callback({success: false, message: "No message found or Unauthorized action."});
      }
      
    } catch (error) {
      logger.error(`Error deleting message: ${error.message}`);
      callback({success: false, message: "Server error. Failed to delete message"}); 
    }
  });

  socket.on("edit-message", async ({ msgId, text, receiverId}, callback) => {
    try {
      const editedMessage = await Message.findOneAndUpdate(
        { _id: msgId, sender: socket.userId}, 
        { $set: {text, edited: true} },
        { new: true }
      );

      if(editedMessage){
        callback({success: true, message: "Message edited successfully"});
        const receiverSocketId = onlineUsers.get(receiverId);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("message-edited", {msgId, text});
        }

      }else {
        callback({success: false, message: "No message found or Unauthorized action."});
      }
      
    } catch (error) {
      logger.error(`Error editing message: ${error.message}`);
      callback({success: false, message: "Server error. Failed to edit message"}); 
    }
  });

  
  }

module.exports = { chatHandler };
