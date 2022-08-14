import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../../db/local/user";

const ProtectedRoute = () => {
    return getUser() ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;