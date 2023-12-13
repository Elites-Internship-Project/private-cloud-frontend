import { Navigate } from "react-router-dom";
import { isAuthenticated } from ".";

const ClientRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

export default ClientRoute;
