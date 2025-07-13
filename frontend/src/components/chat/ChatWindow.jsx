import { useSelectedUser } from "../../context/SelectedUserContext";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import "./ChatWindow.css";

const ChatWindow = () => {
  const { selectedUser } = useSelectedUser();
  if (!selectedUser) {
  return (
    <div className="chat-window empty">
      <p style={{ textAlign: "center", marginTop: "50%" }}>
        👋 Select a user to start chatting.
      </p>
    </div>
  );
}
  console.log(selectedUser);
  return (
    <div className="chat-window">
      <ChatHeader />
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatWindow;
