import { useSelectedUser } from "../../context/SelectedUserContext";
import { getSocket } from "../../../socket/socket";
import profile from "../../assets/default-profile.jpg";
const User = ({name, user, onClick, isSelected}) => {
  const {onlineUsers, unreadCounts, setUnreadCounts} = useSelectedUser();
  const status = onlineUsers.includes(user._id) ? "Online" : "Offline";
  const unreadCount = unreadCounts[user._id] || 0; 
  return (
    <div 
      className={`user ${isSelected ? "clicked" : ""}`} 
      onClick={async () => { 
        const socket = getSocket();
        socket.emit('message_seen', user._id);
        onClick(user);
        setUnreadCounts((prev) => {
          return {
            ...prev,
            [user._id]: 0
          }
        })
        
      }}>
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
      <span className="message-indicator">{unreadCount}</span>
    </div>
  )
}
export default User;