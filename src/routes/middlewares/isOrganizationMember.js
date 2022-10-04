import { Navigate } from "react-router-dom";
import { domainKey, staffDomainValue, studentDomainValue } from "../../utils/contants";
import { getStoredUser } from "../../db/local/user";

export const isOrganizationMember = () => {
    const user = getStoredUser();

    return {
        evaluation: user[domainKey] === staffDomainValue || user[domainKey] === studentDomainValue,
        onFail: <Navigate to="/" />
    };
}