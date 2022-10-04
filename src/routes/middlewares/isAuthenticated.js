import { Navigate } from "react-router-dom";
import { getStoredUser } from "../../db/local/user";
import { auth } from "../../db/remote/firebase";

export const isAuthenticated = () => ({
    evaluation: Boolean(getStoredUser()),
    onFail: <Navigate to="/login" />
});