import { useState } from "react";
import UserList from "./UserList";
import profile from "../../assets/default-profile.jpg";
import {jwtDecode} from "jwt-decode";
import { useAuth } from "../../context/AuthContext";
import "./SideBar.css";


const SideBar = () => {
  const { token } = useAuth();
  const user = jwtDecode(token);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">QuickChat</h2>
        <div className="user current-user">
            <div className="profile-container">
              <img src={profile} alt="profile"  className="profile-img"/>
            </div>
            <div className="user-info">
              <h4 className="name">{user.username}</h4>
              <p className="status">Online</p>
            </div>
          </div>
          <input 
            type="text" 
            placeholder="Search User..." 
            className="sidebar-search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
      <UserList searchQuery={searchQuery}/>
    </div>
  )
}
export default SideBar;