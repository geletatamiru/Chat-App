import { createContext, useState, useEffect, useContext } from "react";
import { loginApi, logoutApi, refreshApi } from "../../services/authApi";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [emailForVerfication, setEmailForVerification] = useState(null);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (data) => {
    try {
      const {accessToken, user} = await loginApi(data);
      setUser(user);
      setAccessToken(accessToken);
      return user;
    } catch (error) {
      throw error;
    }
  }

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
    } finally {
      setUser(null);
      setAccessToken(null);
      
    }
  };
  const refreshAccessToken = async () => {
    try {
      const { accessToken, user } = await refreshApi();
      setAccessToken(accessToken);
      if (user) setUser(user);
      return accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error.response?.data || error.message);
      setUser(null);
      setAccessToken(null);
      return null;
    }
  }

  useEffect(() => {
    refreshAccessToken().finally(() => setIsLoading(false));
  }, []);
  return  (
    <AuthContext.Provider value={{ user, accessToken, login, logout, isLoading, setEmailForVerification, emailForVerfication }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
