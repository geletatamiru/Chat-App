const logger = require('../utils/logger');

function userHandler(socket, io, onlineUsers) {

  socket.on("add_user", () => {
    onlineUsers.set(socket.userId, socket.id);
    io.emit('online-users', Array.from(onlineUsers.keys()))
  });

  socket.on("disconnect", () => {
    logger.info(`Socket disconnected: ${socket.id}`);
    
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
    }
    
    io.emit('online-users', Array.from(onlineUsers.keys()));
  });    
}

module.exports = { userHandler };
