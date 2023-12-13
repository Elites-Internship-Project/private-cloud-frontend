import { Navigate } from "react-router-dom";
import { isAuthenticated } from ".";
import { Roles } from "../../utils/constants";

const AdminRoute = ({ children }) => {
  return isAuthenticated() && isAuthenticated().data.Role === Roles.ADMIN ? (
    children
  ) : (
    <Navigate to="/" />
  );
};

export default AdminRoute;
