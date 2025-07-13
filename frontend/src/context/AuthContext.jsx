import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.id); 
    } else {
      localStorage.removeItem("token");
      setCurrentUserId(null);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, currentUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
