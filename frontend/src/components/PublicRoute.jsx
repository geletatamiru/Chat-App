import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { ThreeDot } from "react-loading-indicators";

const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ThreeDot color="#32cd32" size="medium" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
