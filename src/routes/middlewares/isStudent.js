import { Navigate } from "react-router-dom";
import { domainKey, studentDomainValue } from "../../utils/contants";
import { getStoredUser } from "../../db/local/user";

export const isStudent = () => {
    const user = getStoredUser();

    return {
        evaluation: user[domainKey] === studentDomainValue,
        onFail: <Navigate to="/" />
    };
}