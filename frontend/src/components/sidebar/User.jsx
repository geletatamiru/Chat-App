import profile from "../../assets/default-profile.jpg";
const User = ({name, status, user, onClick}) => {
  return (
    <div className="user" onClick={ () => {onClick(user)}}>
      <div className="profile-container">
        <img src={profile} alt="profile"  className="profile-img"/>
      </div>
      <div className="user-info">
        <h4 className="name">{name}</h4>
        <p className="status">{status}</p>
      </div>
    </div>
  )
}
export default User;