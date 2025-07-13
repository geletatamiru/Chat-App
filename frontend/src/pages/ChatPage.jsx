import SideBar from "../components/sidebar/SideBar";
import ChatWindow from "../components/chat/ChatWindow";
import "./ChatPage.css";
const ChatPage = () => {
  return (
    <div className="chat-page">
      <SideBar />
      <ChatWindow />
    </div>
  )
}

export default ChatPage;