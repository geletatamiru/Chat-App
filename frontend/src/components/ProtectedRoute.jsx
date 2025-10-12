import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import {ThreeDot} from "react-loading-indicators"
const ProtectedRoute = ({children}) => {
  const {user, accessToken, isLoading, } = useAuth();
  
  
  if(isLoading) return <div style={{width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center"}}><ThreeDot  color="#32cd32" size="medium" text="" textColor="" /></div>

   if (!user || !accessToken) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;