import { useState, useEffect } from "react";
import { useSelectedUser } from "../../context/SelectedUserContext.jsx";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useAuth } from "../../context/AuthContext";
import {connectSocket, getSocket} from "../../../socket/socket.js";
import { fetchMessages } from "../../../services/api.js";
import "./ChatWindow.css";

const ChatWindow = ({isSidebarOpen, setIsSidebarOpen}) => {
  const { selectedUser, setUnreadCounts } = useSelectedUser();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");  
  const { accessToken, user } = useAuth();
  
  useEffect(() => {
    if(accessToken){
      connectSocket(accessToken);
    }
  }, []);

  useEffect(() => {
      const socket = getSocket();
      socket.on('receive_message', (data) => {
        if(data.sender === selectedUser?._id){
          setMessages(prev => [...prev, { _id: data._id, sender: data.sender, receiver: data.receiver, text: data.text, updatedAt: data.updatedAt, edited: data.edited}]);
          socket.emit('message_seen', selectedUser._id)
        }else {
          setUnreadCounts((prev) => ({
          ...prev,
          [data.sender]: (prev[data.sender] || 0) + 1
        }));
        }
      });

      socket.on('seen_acknowledged', ({receiverId}) => {
        if (receiverId === selectedUser?._id) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            !msg.read
              ? { ...msg, read: true }
              : msg
          ));
          }
        })

      socket.on('message-deleted', (msgId) => {
        setMessages(prev => (prev.filter(msg => msg._id !== msgId)))
      }) 
      socket.on('message-edited', ({msgId, text}) => {
        setMessages(prev => (prev.map(msg => msg._id === msgId ? {...msg, text, edited: true} : msg)))
      }) 
      return () => {
        socket.off('receive_message')
        socket.off('seen_acknowledged')
        socket.off('message-deleted') 
        socket.off('message-edited') 
      }
  }, [selectedUser])
  useEffect(() => {
    if (!selectedUser) return;

    const loadMessages = async () => {
      try {
        const data = await fetchMessages(accessToken, selectedUser._id)
        setMessages(data.messages);
      } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
          setError(error.response.data.message);
        } else {
          setError("Something went wrong while fetching messages.");
        }
      };
    };
    loadMessages();
  }, [selectedUser, accessToken]);

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
        <ChatHeader />
        <MessageList messages={messages} setMessages={setMessages} currentUserId={user.id} selectedUserId={selectedUser?._id}/>
        <ChatInput selectedUser={selectedUser} setMessages={setMessages} setIsSidebarOpen={setIsSidebarOpen}/>
      </>
      }
    </div>
  );
};

export default ChatWindow;
