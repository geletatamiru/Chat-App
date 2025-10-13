import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserList from "./UserList";
import profile from "../../assets/default-profile.jpg";
import { useAuth } from "../../context/AuthContext";
import Input from "../Input";
import { disconnectSocket } from "../../../socket/socket";
import { useSelectedUser } from "../../context/SelectedUserContext";
import logo from "../../assets/logo.png";
import "./SideBar.css";


const SideBar = ({isSidebarOpen}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {setSelectedUser, setUnreadCounts, setOnlineUsers} = useSelectedUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const  handleLogout = async () => {
    try {
      await logout();
      setSelectedUser(null);
      setUnreadCounts({});
      setOnlineUsers([])
      disconnectSocket();
      navigate("/login");
    } catch (error) {
      if(error.response && error.response.status >= 400 && error.response.status < 500){
        setError(error.response.data.message);
      }else {
        setError("Something went Wrong.")
      }
    }

  }
  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" />
      </div>
        <div className="user current-user">
            <div className="profile-container">
              <img src={profile} alt="profile"  className="profile-img"/>
            </div>
            <div className="user-info">
              <h4 className="name">{user.username}</h4>
              <p className="status status-online pulse">
                <span className="status-dot status-dot-online"></span>
                Online
              </p>
            </div>
          </div>
          <Input 
            type="text" 
            placeholder="Search User..." 
            className="sidebar-search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
      <UserList searchQuery={searchQuery}/>
      {error && <p style={{color: "red"}}>{error}</p>}
      <div className="logout" onClick={handleLogout}>Logout</div>
    </div>
  )
}
export default SideBar;