import { Navigate } from "react-router-dom";
import { getStoredUser } from "../../db/local/user";

import { userHasRole } from "../../db/remote/user";

export const hasRole = async (roles) => {
    const user = getStoredUser();
    let roleCheck = false;

    for (let r in roles)
        roleCheck = roleCheck || await userHasRole(user.email, roles[r]);

    return {
        evaluation: roleCheck,
        onFail: <Navigate to="/" />
    };
}