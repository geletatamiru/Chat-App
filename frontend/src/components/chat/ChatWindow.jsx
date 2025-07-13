import { useState, useEffect } from "react";
import { useSelectedUser } from "../../context/SelectedUserContext";
import axios from "axios";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useAuth } from "../../context/AuthContext";
import "./ChatWindow.css";


const ChatWindow = () => {
  const { selectedUser } = useSelectedUser();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const { token, currentUserId } = useAuth();
  
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
        setMessages(res.data);
      }catch(error){
         if (error.response && error.response.status >= 400 && error.response.status < 500) {
          setError(error.response.data);
        } else {
          setError("Something went wrong while sending message.");
        }
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


  const handleSend = async (message) => {
      try {
        const res = await axios.post("http://localhost:5000/api/messages", {
            receiver: selectedUser._id,
            text: message
          },
          {
            headers: {
              "x-auth-token": token,
            },
        });
        setError("");
        setMessages(prev => [...prev, { sender: currentUserId, text: message }])
      } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
          setError(error.response.data);
        } else {
          setError("Something went wrong while sending message.");
        }

      }
  }
  return (
    <div className="chat-window">
      <ChatHeader name={selectedUser.username} />
      <MessageList messages={messages} currentUserId={currentUserId}/>
      <ChatInput onClick={handleSend} />
    </div>
  );
};

export default ChatWindow;
