import { useState, useRef, useEffect } from "react";
import send from "../../assets/send-message.png";
import { getSocket } from "../../../socket/socket";


const ChatInput = ({setMessages, selectedUser, setIsSidebarOpen}) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [error, setError] = useState("");
  const socket = getSocket();

  const handleSend = () => {
    if(!message.trim()) return;
    socket.emit("send_message", {
      receiver: selectedUser._id,
      text: message
    }, (response) => {
      setError("");
      if(response.success){
        const filteredMessage = {
          sender: response.data.sender,
          text: response.data.text,
          receiver: response.data.receiver,
          updatedAt: response.data.updatedAt,
          read: response.data.read
        }
        setMessages((prev) => [...prev, filteredMessage]);
        setMessage("");
      }else {
        setError(response.data);
      }
    });
    socket.emit("stop_typing", selectedUser._id);
  }
  const handleChange = (e) => {
    setMessage(e.target.value);
    if(e.target.value === ""){
      socket.emit("stop_typing", selectedUser._id);
    }
    if(!isTyping){
      setIsTyping(true);
      socket.emit("typing", selectedUser._id);
    }
    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", selectedUser._id)
      setIsTyping(false);
    }, 2000);
    
  }

  useEffect(() => {
    return () => clearTimeout(typingTimeoutRef.current);
  }, []);

  return (
    <div className="chat-input">
      {error && <p className="error" style={{color: "red"}}>{error}</p>}
      <div className="input-container">
        <input 
          type="text" 
          placeholder="Write a message" 
          onFocus={() => {setIsSidebarOpen(false)}}
          value={message}
          onChange={handleChange}
        />
        <button className="send-button" onClick={handleSend}>
          <img className="send-icon" src={send} alt="send-icon" />
        </button>
      </div>
    
    </div>
  );
};

export default ChatInput;
