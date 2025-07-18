import { useSelectedUser } from "../../context/SelectedUserContext";
import profile from "../../assets/default-profile.jpg";
const ChatHeader = ({name}) => {
  const {onlineUsers, selectedUser} = useSelectedUser();
   const status = onlineUsers.includes(selectedUser._id) ? "Online" : "Offline";
  return (
    <div className="chat-header">
      <div className="profile-container">
        <img src={profile} alt="profile"  className="profile-img"/>
      </div>
      <div className="user-info">
        <h4 className="name">{name}</h4>
          <p className={`status ${status === "Online" ? "status-online pulse" : "status-offline"}`}>
            <span className={`status-dot ${status === "Online" ? "status-dot-online" : "status-dot-offline"}`}></span>
            {status}
          </p>
      </div>
    </div>
  );
};

export default ChatHeader;
