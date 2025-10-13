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
    if (accessToken) {
      connectSocket(accessToken);
    }
    const socket = getSocket();
    if(user.id){
       socket.emit("add_user", user.id);
    }
    socket.on('online-users', (users) => {
      setOnlineUsers(users);
    }) 
    return () => {
      socket.off('online-users')
      socket.off('add_user')
    }
  }, [user]);
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