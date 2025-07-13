import { useState, useEffect } from "react";
import { useSelectedUser } from "../../context/SelectedUserContext";
import { useAuth } from "../../context/AuthContext";
import User from "./User";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const {setSelectedUser} = useSelectedUser();
  const {token} = useAuth();

  // const users = [
  //   {
  //     _id: "1",
  //     username: "Geleta",
  //   },
  //   {
  //     _id: "2",
  //     username: "Tamiru",
  //   },
  //   {
  //     _id: "3",
  //     username: "Abdissa",
  //   },
  //   {
  //     _id: "4",
  //     username: "Buze",
  //   }
  // ]
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
  return (
    <div className="user-list">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {
        users.map(user => {
          return (<User key={user._id} name={user.username} status="Online" onClick={(name) => { setSelectedUser(name)}}/>)
        })
      }
    </div>
  )
}
export default UserList;