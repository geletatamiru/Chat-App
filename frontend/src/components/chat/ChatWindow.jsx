import { useState, useEffect } from "react";
import { useSelectedUser } from "../../context/SelectedUserContext";
import axios from "axios";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useAuth } from "../../context/AuthContext";
import "./ChatWindow.css";
import { socket } from "../../../socket/socket";

const ChatWindow = () => {
  const { selectedUser } = useSelectedUser();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const { token, currentUserId } = useAuth();
  useEffect(() => {
    socket.on('receive_message', (data) => {
        setMessages(prev => [...prev, { sender: data.senderId, text: data.text }]);
    });

    return () => {
        socket.off('receive_message');
    };
}, []);
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/${selectedUser._id}`,
          {
            headers: { "x-auth-token": token },
          }
        );
        setMessages(res.data);
      } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
          setError(error.response.data);
        } else {
          setError("Something went wrong while fetching messages.");
        }
      };
    };
    fetchMessages();

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
      <ChatHeader name={selectedUser.username} />
      <MessageList messages={messages} currentUserId={currentUserId} />
      <ChatInput selectedUser={selectedUser} setMessages={setMessages} />
    </div>
  );
};

export default ChatWindow;
