import { Navigate } from "react-router-dom";
import { domainKey, studentDomainValue } from "../../utils/contants";
import { getStoredUser } from "../../db/local/user";

const user = getStoredUser();
export const isStudent = () => ({
    evaluation: user[domainKey] === studentDomainValue,
    onFail: <Navigate to="/" />
});