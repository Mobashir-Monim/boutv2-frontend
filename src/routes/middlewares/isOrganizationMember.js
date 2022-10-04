import { Navigate } from "react-router-dom";
import { domainKey, staffDomainValue, studentDomainValue } from "../../utils/contants";
import { getStoredUser } from "../../db/local/user";

const user = getStoredUser();
export const isOrganizationMember = () => ({
    evaluation: user[domainKey] === staffDomainValue || user[domainKey] === studentDomainValue,
    onFail: <Navigate to="/" />
})