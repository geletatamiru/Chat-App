import { useState, useEffect } from "react";
import { useSelectedUser } from "../../context/SelectedUserContext.jsx";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useAuth } from "../../context/AuthContext";
import {connectSocket, getSocket} from "../../../socket/socket.js";
import { fetchMessages } from "../../../services/api.js";
import "./ChatWindow.css";

const ChatWindow = ({isSidebarOpen}) => {
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
          socket.emit('message_seen', selectedUser._id)
        }else {
          setUnreadCounts((prev) => ({
          ...prev,
          [data.senderId]: (prev[data.senderId] || 0) + 1
        }));
        }
      });

      socket.on('seen_acknowledged', ({receiverId}) => {
        console.log(receiverId);
        if (receiverId === selectedUser?._id) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            !msg.read
              ? { ...msg, read: true }
              : msg
          ));
          }
        })
      return () => {
        socket.off('receive_message')
        socket.off('seen_acknowledged')
      }
  }, [selectedUser])
  useEffect(() => {
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
  }, [selectedUser, token]);

  if (!selectedUser) {
    return (
      <div className={`chat-window empty ${isSidebarOpen ? 'with-sidebar' : 'full-width'}`}>
        <p className="select-user">
          👋 Select a user to start chatting.
        </p>
      </div>
    );
  }

  return (
    <div className={`chat-window ${isSidebarOpen ? 'with-sidebar' : 'full-width'}`}>
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
