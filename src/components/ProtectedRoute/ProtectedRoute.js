import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../utils/contexts/AuthContext";

const ProtectedRoute = () => {
    const { user } = useAuth();

    return user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;