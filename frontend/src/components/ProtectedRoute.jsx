import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
  const {user, accessToken, isLoading} = useAuth();
  console.log(user, accessToken, isLoading);
  if(isLoading) return <p>Loading...</p>

   if (!user || !accessToken) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;