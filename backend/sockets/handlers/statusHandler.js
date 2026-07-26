const logger = require('../utils/logger');

function statusHandler(socket, io, onlineUsers) {

  socket.on("message_seen", (targetUserId) => {
    const receiverSocketId = onlineUsers.get(targetUserId);
    if(receiverSocketId){
        io.to(receiverSocketId).emit('seen_acknowledged', {
          senderId: socket.userId
        })
      }
  })
  socket.on("typing", (targetUserId) => {
    const receiverSocketId = onlineUsers.get(targetUserId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit('typing-acknowledged', {
        senderId: socket.userId
      })
    }
  })

  socket.on("stop_typing", (targetUserId) => {
    const receiverSocketId = onlineUsers.get(targetUserId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit('stop_typing-acknowledged', {
        senderId: socket.userId
      })
    }
  });

  
}

module.exports = { statusHandler };
