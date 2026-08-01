import { useEffect, useState } from "react";
import { getSocket, connectSocket } from "../../socket/socket";
import { useSelectedUser } from "../context/SelectedUserContext";
import { useAuth } from "../context/AuthContext";
import SideBar from "../components/sidebar/SideBar";
import ChatWindow from "../components/chat/ChatWindow";
import "./ChatPage.css";

const ChatPage = () => {
  const {user, accessToken} = useAuth();
  const { setOnlineUsers} = useSelectedUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if(!accessToken || !user?.id) return;

    const socket = getSocket() || connectSocket(accessToken);

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    socket.on('online-users', handleOnlineUsers);
    socket.emit("add_user");

    const handleReconnect = () => {
      socket.emit("add_user");
    };

    socket.on("connect", handleReconnect);

    return () => {
      socket.off('online-users', handleOnlineUsers);
      socket.off('connect', handleReconnect);
    }
  }, [setOnlineUsers, user?.id, accessToken]);

  return (
    <div className="chat-page">
      <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen) }>
          ☰
      </button>
      <SideBar isSidebarOpen={isSidebarOpen}/>
      <ChatWindow isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
    </div>
  )
}

export default ChatPage;
