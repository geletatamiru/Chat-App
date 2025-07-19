import { createContext, useState, useContext, Children } from "react";

const SelectedUserContext = createContext();

export const SelectedUserProvider = ({children}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  return (
    <SelectedUserContext.Provider value={{selectedUser, setSelectedUser, onlineUsers, setOnlineUsers, unreadCounts, setUnreadCounts}}>
      {children}
    </SelectedUserContext.Provider>
  )
}
export const useSelectedUser = () => useContext(SelectedUserContext);