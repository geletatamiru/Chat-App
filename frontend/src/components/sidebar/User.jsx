import { useSelectedUser } from "../../context/SelectedUserContext";
import { getSocket } from "../../../socket/socket";
import profile from "../../assets/default-profile.jpg";
const User = ({ user, onClick, isSelected}) => {
  const {onlineUsers, unreadCounts} = useSelectedUser();
  const status = onlineUsers.includes(user._id) ? "Online" : "Offline";
  const unreadCount = unreadCounts[user._id] || 0; 
  return (
    <div 
      className={`user ${isSelected ? "clicked" : ""}`} 
      onClick={() => onClick(user)}
    >
      <div className="profile-container">
        <img src={profile} alt="profile"  className="profile-img"/>
      </div>
      <div className="user-info">
        <h4 className="name">{user?.username || ""}</h4>
        <p className={`status ${status === "Online" ? "status-online pulse" : "status-offline"}`}>
          <span className={`status-dot ${status === "Online" ? "status-dot-online" : "status-dot-offline"}`}></span>
          {status}
        </p>
      </div>
      <span className="message-indicator">{unreadCount}</span>
    </div>
  )
}
export default User;