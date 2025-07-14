import { useEffect } from "react";
import { socket } from "../../socket/socket";
import { useAuth } from "../context/AuthContext";
import SideBar from "../components/sidebar/SideBar";
import ChatWindow from "../components/chat/ChatWindow";
import "./ChatPage.css";
const ChatPage = () => {
  const {currentUserId} = useAuth();

  useEffect(() => {
    if(currentUserId){
       socket.emit("add_user", currentUserId);
    } 
   
  }, [currentUserId]);
  return (
    <div className="chat-page">
      <SideBar />
      <ChatWindow />
    </div>
  )
}

export default ChatPage;