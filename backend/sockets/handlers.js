const { Message, validateMessage } = require('../models/message');
const logger = require('../utils/logger');

function handleSocketConnection(socket, io, onlineUsers) {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on("add_user", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('online-users', Array.from(onlineUsers.keys()))
  });

  socket.on("send_message", async ({ receiverId, text }) => {
    const {error} = validateMessage({ receiver: receiverId, text: text});
    if (error) {
      return socket.emit("error_message", { error: error.details[0].message });
    }
    try {
      const message = new Message({ sender: socket.userId, receiver: receiverId, text: text });
      await message.save();

      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", { senderId: socket.userId, text, read:  message.read, updatedAt: message.updatedAt});
      }
    } catch (error) {
      logger.error(`Error saving message: ${error.message}`);
      socket.emit("error_message", { error: "Failed to send message." });
    }
  });
  socket.on("is-read",async (id) => {
    try{
      await Message.updateMany(
        {sender: id,receiver: socket.userId, read: false},
        { $set: { read: true }}
      )
    }catch(error){
      logger.error(`Error updating message: ${error.message}`);
    }
    // socket.emit("messages_read", id);
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
