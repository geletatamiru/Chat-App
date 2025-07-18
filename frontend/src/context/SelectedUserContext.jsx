import { createContext, useState, useContext, Children } from "react";

const SelectedUserContext = createContext();

export const SelectedUserProvider = ({children}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  return (
    <SelectedUserContext.Provider value={{selectedUser, setSelectedUser, onlineUsers, setOnlineUsers}}>
      {children}
    </SelectedUserContext.Provider>
  )
}
export const useSelectedUser = () => useContext(SelectedUserContext);