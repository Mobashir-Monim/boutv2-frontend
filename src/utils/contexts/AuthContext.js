import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setStoredUser, getStoredUser } from "../../db/local/user";

export const AuthContext = createContext(undefined);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getStoredUser());
    const navigate = useNavigate();

    const login = user => {
        setStoredUser(user);
        setUser(user);
        navigate("/");
    }

    const logout = () => {
        setStoredUser(null);
        setUser(null);
        navigate("/login", { replace: true });
    }

    const value = {
        user: user,
        login: login,
        logout: logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}