import { useEffect, useState } from "react";
import { useSelectedUser } from "../../context/SelectedUserContext";
import profile from "../../assets/default-profile.jpg";
import { getSocket } from "../../../socket/socket";

const ChatHeader = () => {
  const {onlineUsers, selectedUser} = useSelectedUser();
  const [isTyping, setIsTyping] = useState(false);
  const socket = getSocket();
  const status = onlineUsers.includes(selectedUser._id) ? "Online" : "Offline";

  useEffect(() => {
    socket.on("typing-acknowledged", (data) => {
      setIsTyping(true);
    })
    socket.on("stop_typing-acknowledged", (data) => {
      setIsTyping(false);
    })
  }, [selectedUser])

  return (
    <div className="chat-header">
      <div className="profile-container">
        <img src={profile} alt="profile"  className="profile-img"/>
      </div>
      <div className="user-info">
        <h4 className="name">{selectedUser.username}</h4>
          <p className={`status ${status === "Online" ? "status-online pulse" : "status-offline"}`}>
            <span className={`status-dot ${status === "Online" ? "status-dot-online" : "status-dot-offline"}`}></span>
            {status}
            {isTyping && <span style={{color: "white"}}>Typing...</span>}
          </p>
          
      </div>
    </div>
  );
};

export default ChatHeader;
