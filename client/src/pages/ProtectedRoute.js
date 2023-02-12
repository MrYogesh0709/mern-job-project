import { Navigate } from "react-router-dom";
import { Loading } from "../components";
import { useAppContext } from "../context/appContext";

const ProtectedRoute = ({ children }) => {
  //this userLoading is for when refresh  loading
  const { user, userLoading } = useAppContext();
  if (userLoading) return <Loading />;
  //so this lines as refresh doesn't work after loading false we check for user and navigate without userLoading like there will be no user and we directly get to landing page
  if (!user) {
    return <Navigate to="/landing" />;
  }
  return children;
};
export default ProtectedRoute;
