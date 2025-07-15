import { useState, useEffect } from "react";
import { useSelectedUser } from "../../context/SelectedUserContext";
import { useAuth } from "../../context/AuthContext";
import User from "./User";
import axios from "axios";

const UserList = ({searchQuery}) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const {selectedUser, setSelectedUser} = useSelectedUser();
  const {token} = useAuth();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: {
            "x-auth-token": token,
          },
        });
        setUsers(res.data);
        setError("");
      } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
          setError(error.response.data);
        } else {
          setError("Something went wrong while fetching users.");
        }

      }
    };

    fetchUsers();
  }, []);
   const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="user-list">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {
        filteredUsers.map(user => (
          <User 
            key={user._id} 
            user={user} 
            name={user.username} 
            status="Online" 
            isSelected={selectedUser?._id === user._id}
            onClick={(user) => { setSelectedUser(user)}}/>)
        )
      }
    </div>
  )
}
export default UserList;