import { useState } from "react";
import send from "../../assets/send-message.png";
import { getSocket } from "../../../socket/socket";
import { useAuth } from "../../context/AuthContext";


const ChatInput = ({setMessages, selectedUser}) => {
  const [message, setMessage] = useState("");
  const { currentUserId } = useAuth();
  const socket = getSocket();
  
  const handleSend = () => {
    if(!message.trim()) return;
    socket.emit("send_message", {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      text: message
    });
    setMessages((prev) => [...prev, { sender: currentUserId, text: message, receiver: selectedUser._id, updatedAt: new Date().toISOString(), read: false}])
    setMessage("");
  }
  return (
    <div className="chat-input">
      <input 
        type="text" 
        placeholder="Write a message" 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="send-button" onClick={handleSend}>
        <img className="send-icon" src={send} alt="send-icon" />
      </button>
    </div>
  );
};

export default ChatInput;
