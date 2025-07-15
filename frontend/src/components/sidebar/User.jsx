import profile from "../../assets/default-profile.jpg";
const User = ({name, status, user, onClick, isSelected}) => {
  return (
    <div className={`user ${isSelected ? "clicked" : ""}`} onClick={() => { onClick(user)}}>
      <div className="profile-container">
        <img src={profile} alt="profile"  className="profile-img"/>
      </div>
      <div className="user-info">
        <h4 className="name">{name}</h4>
        <p className="status">{status}</p>
      </div>
      <span className="message-indicator">2</span>
    </div>
  )
}
export default User;