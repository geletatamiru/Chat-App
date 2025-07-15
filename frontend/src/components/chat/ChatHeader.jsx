import profile from "../../assets/default-profile.jpg";
const ChatHeader = ({name}) => {
  return (
    <div className="chat-header">
      <div className="profile-container">
        <img src={profile} alt="profile"  className="profile-img"/>
      </div>
      <div className="user-info">
        <h4 className="name">{name}</h4>
        <p className="status">Online</p>
      </div>
    </div>
  );
};

export default ChatHeader;
