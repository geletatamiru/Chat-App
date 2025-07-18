import { useEffect } from "react";
import { getSocket, connectSocket } from "../../socket/socket";
import { useSelectedUser } from "../context/SelectedUserContext";
import { useAuth } from "../context/AuthContext";
import SideBar from "../components/sidebar/SideBar";
import ChatWindow from "../components/chat/ChatWindow";
import "./ChatPage.css";
const ChatPage = () => {
  const {currentUserId, token} = useAuth();
  const { setOnlineUsers, onlineUsers} = useSelectedUser();
  useEffect(() => {
    if (token) {
      connectSocket(token);
    }
    const socket = getSocket();
    if(currentUserId){
       socket.emit("add_user", currentUserId);
    }
    socket.on('online-users', (users) => {
      setOnlineUsers(users);
    }) 
  }, [currentUserId]);
  return (
    <div className="chat-page">
      <SideBar />
      <ChatWindow/>
    </div>
  )
}

export default ChatPage;