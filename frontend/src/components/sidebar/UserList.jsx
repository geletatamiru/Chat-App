import { useState, useEffect } from "react";
import { useSelectedUser } from "../../context/SelectedUserContext";
import { useAuth } from "../../context/AuthContext";
import { fetchUnreadCounts, fetchUsers } from "../../../services/api";
import { markMessageAsRead } from "../../../services/api";
import User from "./User";

const UserList = ({searchQuery}) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {selectedUser, setSelectedUser, setUnreadCounts} = useSelectedUser();
  const {accessToken} = useAuth();
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchUsers(accessToken);
        console.log(users);
        setUsers(data);
        setError("");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
          setError(error.response.data);
        } else {
          setError("Something went wrong while fetching users.");
        }
      }
    };

    loadUsers();
    const loadUnreadCounts = async () => {
        try {
            const data = await fetchUnreadCounts(accessToken);
            const countsArray = data;
            const countsObject = countsArray?.reduce((acc, curr) => {
                acc[curr.userId.toString()] = curr.count;
                return acc;
            }, {});

            setUnreadCounts(countsObject);
        } catch (error) {
            setError("Failed to fetch unread counts");
            console.log(error);
            setUnreadCounts({});
        }
    };
    loadUnreadCounts();
  }, [accessToken]);

  const filteredUsers = users?.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user-list">
      {loading && <p>Loading Users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {
        filteredUsers?.map(user => (
          <User 
            key={user._id} 
            user={user} 
            name={user.username} 
            isSelected={selectedUser?._id === user._id}
            onClick={async (user) => { 
              setSelectedUser(user)
              await markMessageAsRead(user._id, accessToken);
            }}/>
          )
        )
      }
    </div>
  )
}
export default UserList;