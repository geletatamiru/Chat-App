import { useState, useEffect } from "react";
import { useSelectedUser } from "../../context/SelectedUserContext";
import axios from "axios";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import "./ChatWindow.css";
import { useAuth } from "../../context/AuthContext";

const ChatWindow = () => {
  const { selectedUser } = useSelectedUser();
  const [messages, setMessages] = useState([]);
  const { token } = useAuth();
  console.log(selectedUser);
  useEffect(() => {
    if(!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/${selectedUser._id}`,
          {
            headers: { "x-auth-token": token },
          }
        );
        console.log(res.data);
        setMessages(res.data);
      }catch(error){
         console.error("Failed to fetch messages:", error);
      } 
    }
    fetchMessages();
  }, [selectedUser])
  if (!selectedUser) {
    return (
      <div className="chat-window empty">
        <p style={{ textAlign: "center", marginTop: "50%" }}>
          👋 Select a user to start chatting.
        </p>
      </div>
    );
}
  return (
    <div className="chat-window">
      <ChatHeader name={selectedUser.username} />
      <MessageList messages={messages} />
      <ChatInput />
    </div>
  );
};

export default ChatWindow;
