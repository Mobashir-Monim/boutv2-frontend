import { pageLayoutStyles } from "../../utils/styles/styles";
import { useAuth } from "../../utils/contexts/AuthContext";

import { domainKey, studentDomainValue, staffDomainValue } from "../../utils/contants";
import UnderDevelopment from "../UnderDevelopment/UnderDevelopment";
import FacultyDashboard from "./components/FacultyDashboard";
import StudentDashboard from "./components/StudentDashboard";

const Thesis = () => {
    const { user } = useAuth();

    if (user[domainKey] === staffDomainValue) {
        return <FacultyDashboard user={user} />
    } else {
        return <StudentDashboard />
    }

};

export default Thesis;
