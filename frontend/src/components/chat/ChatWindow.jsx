import { useState, useEffect } from "react";
import { useSelectedUser } from "../../context/SelectedUserContext.jsx";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useAuth } from "../../context/AuthContext";
import {connectSocket, getSocket} from "../../../socket/socket.js";
import { fetchMessages } from "../../../services/api.js";
import "./ChatWindow.css";

const ChatWindow = () => {
  const { selectedUser, setUnreadCounts } = useSelectedUser();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");  
  const { token, currentUserId } = useAuth();
  
  useEffect(() => {
    connectSocket(token);
  }, []);

  useEffect(() => {
      const socket = getSocket();
        
      socket.on('receive_message', (data) => {
        if(data.senderId === selectedUser?._id){
          setMessages(prev => [...prev, { sender: data.senderId, text: data.text, updatedAt: data.updatedAt}]);
        }else {
          setUnreadCounts((prev) => ({
          ...prev,
          [data.senderId]: (prev[data.senderId] || 0) + 1
        }));
        }
      });
  }, [selectedUser])
  useEffect(() => {
    const socket = getSocket();
    if (!selectedUser) return;

    const loadMessages = async () => {
      try {
        const res = await fetchMessages(token, selectedUser._id)
        setMessages(res.data);
      } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
          setError(error.response.data);
        } else {
          setError("Something went wrong while fetching messages.");
        }
      };
    };
    loadMessages();
    return () => {
      socket.off('receive_message');
    };
  }, [selectedUser, token]);

  if (!selectedUser) {
    return (
      <div className="chat-window empty">
        <p className="select-user">
          👋 Select a user to start chatting.
        </p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {error ? <p style={{ color: "red" }}>{error}</p> : 
      <>
        <ChatHeader name={selectedUser.username} />
        <MessageList messages={messages} currentUserId={currentUserId}/>
        <ChatInput selectedUser={selectedUser} setMessages={setMessages} />
      </>
      }
    </div>
  );
};

export default ChatWindow;
