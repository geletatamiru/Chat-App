import { useState, useEffect } from "react";
import { useSelectedUser } from "../../context/SelectedUserContext";
import { useAuth } from "../../context/AuthContext";
import { fetchUsers } from "../../../services/api";
import User from "./User";

const UserList = ({searchQuery}) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const {selectedUser, setSelectedUser} = useSelectedUser();
  const {token} = useAuth();
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetchUsers(token);
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

    loadUsers();
    const fetchUnreadCounts = async () => {
        const res = await axios.get('http://localhost:5000/api/messages/unread/count', {
            headers: { 'x-auth-token': token }
        });
        const countsMap = {};
        res.data.forEach(item => {
            countsMap[item._id] = item.count;
        });
        setUnreadCounts(countsMap);
    };
    fetchUnreadCounts();
  }, [token]);

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
            isSelected={selectedUser?._id === user._id}
            unreadCount={unreadCounts[user._id] || 0}
            onClick={(user) => { setSelectedUser(user)}}/>
          )
        )
      }
    </div>
  )
}
export default UserList;