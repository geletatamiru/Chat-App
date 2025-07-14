import { useState } from "react";
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
        placeholder="Send a message" 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatInput;
