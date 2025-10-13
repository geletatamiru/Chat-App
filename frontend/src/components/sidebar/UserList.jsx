import { useState, useEffect } from "react";
import { useSelectedUser } from "../../context/SelectedUserContext";
import { useAuth } from "../../context/AuthContext";
import { fetchUnreadCounts, fetchUsers } from "../../../services/api";
import { markMessageAsRead } from "../../../services/api";
import { ThreeDot } from "react-loading-indicators";
import { getSocket } from "../../../socket/socket";
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
        setUsers(data?.users || []);
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
            const countsArray = data?.counts || [];
            const countsObject = countsArray?.reduce((acc, curr) => {
                acc[curr.userId.toString()] = curr.count;
                return acc;
            }, {});

            setUnreadCounts(countsObject);
        } catch (error) {
          if(error.response && error.response.status >= 400 && error.response.status < 500){
            setError(error.response.data.message);
          }else {
            setError("Failed to fetch unread counts");
          }
            setUnreadCounts({});
        }
    };
    loadUnreadCounts();
  }, [accessToken]);


  const filteredUsers = users?.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleClick = async (user) => {
    const socket = getSocket();
    socket.emit('message_seen', user._id);
    setSelectedUser(user)
    
    setUnreadCounts((prev) => (
      {
        ...prev,
        [user._id]: 0
      }
    ))
    try {
      await markMessageAsRead(user._id, accessToken);
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        setError(error.response.data);
      } else {
        setError("Something went wrong while fetching users.");
      }
    }
             
  }
  return (
    <div className="user-list">
      {loading && <ThreeDot color="green" size="medium" text="" textColor="" />}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {
        filteredUsers?.map(user => (
          <User 
            key={user._id} 
            user={user} 
            isSelected={selectedUser?._id === user._id}
            onClick={handleClick}
            />
          )
        )
      }
    </div>
  )
}
export default UserList;