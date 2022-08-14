import { useState, useEffect } from "react";
import { getUser } from "../../db/local/user";

export const useAuth = () => {
    const [auth, setAuth] = useState({});

    useEffect(() => {
        const checkAuthStatus = () => {
            let user = getUser();
            if (!user) user = {};

            setAuth(user);
        }

        window.addEventListener("storage", checkAuthStatus);

        return () => window.removeEventListener("storage", checkAuthStatus);
    }, []);

    return auth;
}