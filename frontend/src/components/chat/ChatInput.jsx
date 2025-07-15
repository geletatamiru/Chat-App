import { useState } from "react";
import send from "../../assets/send-message.png";
import { socket } from "../../../socket/socket";
import { useAuth } from "../../context/AuthContext";


const ChatInput = ({setMessages, selectedUser}) => {
  const [message, setMessage] = useState("");
  const { currentUserId } = useAuth();

  const handleSend = () => {
    if(!message.trim()) return;
    socket.emit("send_message", {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      text: message
    });

    setMessages((prev) => [...prev, { sender: currentUserId, text: message, receiver: selectedUser._id}])
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
