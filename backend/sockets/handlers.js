const { Message, validateMessage } = require('../models/message');
const logger = require('../utils/logger');

function handleSocketConnection(socket, io, onlineUsers) {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on("add_user", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('user-online', socket.userId);
  });

  socket.on("send_message", async ({ receiverId, text }) => {
    const senderId = socket.userId;
    const {error} = validateMessage({ receiver: receiverId, text: text});
    if (error) {
      return socket.emit("error_message", { error: error.details[0].message });
    }
    try {
      const message = new Message({ sender: senderId, receiver: receiverId, text: text });
      await message.save();

      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", { senderId, text });
      }
    } catch (error) {
      logger.error(`Error saving message: ${error.message}`);
      socket.emit("error_message", { error: "Failed to send message." });
    }
  });

  socket.on("disconnect", () => {
    logger.info(`Socket disconnected: ${socket.id}`);
    io.emit('user-offline', socket.userId);
    for (let [userId, sId] of onlineUsers.entries()) {
      if (sId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
}

module.exports = { handleSocketConnection };
