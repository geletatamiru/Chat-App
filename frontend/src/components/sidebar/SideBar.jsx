import UserList from "./UserList";
import "./SideBar.css";

const SideBar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">QuickChat</h2>
      <UserList />
    </div>
  )
}
export default SideBar;