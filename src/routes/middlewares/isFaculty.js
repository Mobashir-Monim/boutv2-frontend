import { Navigate } from "react-router-dom";
import { domainKey, staffDomainValue } from "../../utils/contants";
import { getStoredUser } from "../../db/local/user";

export const isFaculty = () => {
    const user = getStoredUser();

    return {
        evaluation: user[domainKey] === staffDomainValue,
        onFail: <Navigate to="/" />
    };
}