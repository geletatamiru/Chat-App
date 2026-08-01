const logger = require("../../utils/logger");

function userHandler(socket, io, onlineUsers) {
  const broadcastOnlineUsers = () => {
    io.emit("online-users", Array.from(onlineUsers.keys()));
  };

  const markUserOnline = () => {
    onlineUsers.set(socket.userId, socket.id);
    broadcastOnlineUsers();
  };

  socket.on("add_user", () => {
    markUserOnline();
    
  });

  socket.on("disconnect", () => {
    logger.info(`Socket disconnected: ${socket.id}`);
    
    if (socket.userId && onlineUsers.get(socket.userId) === socket.id) {
      onlineUsers.delete(socket.userId);
    }
    
    broadcastOnlineUsers();
  });

  markUserOnline();
}

module.exports = { userHandler };
