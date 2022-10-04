import { Navigate } from "react-router-dom";
import { domainKey, staffDomainValue } from "../../utils/contants";
import { getStoredUser } from "../../db/local/user";

const user = getStoredUser();
export const isFaculty = () => ({
    evaluation: user[domainKey] === staffDomainValue,
    onFail: <Navigate to="/" />
});