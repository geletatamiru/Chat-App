import { useState, useEffect } from "react";
import { useSelectedUser } from "../../context/SelectedUserContext";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useAuth } from "../../context/AuthContext";
import {connectSocket, getSocket} from "../../../socket/socket.js";
import { fetchMessages } from "../../../services/api.js";
import "./ChatWindow.css";

const ChatWindow = () => {
  const { selectedUser } = useSelectedUser();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const { token, currentUserId } = useAuth();
  
  useEffect(() => {
    connectSocket(token);
    const socket = getSocket();

    socket.on('receive_message', (data) => {
      setMessages(prev => [...prev, { sender: data.senderId, text: data.text, updatedAt: data.updatedAt}]);
    });
    return () => {
        socket.off('receive_message');
    };
}, []);


  useEffect(() => {
    if (!selectedUser) return;
      const socket = getSocket();
      socket.emit('is-read', selectedUser._id)
      
      // socket.on("messages_read", ( receiverId) => {
      // if (selectedUser._id === receiverId) {
      //   setMessages(prev =>
      //     prev.map(msg => ({
      //       ...msg,
      //       read: true,
      //     }))
      // );
    // }
  // });
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
        <MessageList messages={messages} currentUserId={currentUserId} />
        <ChatInput selectedUser={selectedUser} setMessages={setMessages} />
      </>
      }
    </div>
  );
};

export default ChatWindow;
