import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // check token instead of authUser

  if (!token) {
    return <Navigate to="/auth?state=login" replace />;
  }

  return children;
};

export default ProtectedRoute;
