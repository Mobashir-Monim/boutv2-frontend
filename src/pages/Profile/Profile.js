import { useAuth } from "../../utils/contexts/AuthContext";
import StudentProfile from "./components/StudentProfile";
import { domainKey, studentDomainValue, staffDomainValue } from "../../utils/contants";
import UnderDevelopment from "../UnderDevelopment/UnderDevelopment";
import FacultyProfile from "./components/FacultyProfile";

const Profile = () => {
    const { user } = useAuth();

    if (user[domainKey] === studentDomainValue) {
        return <StudentProfile user={user} />;
    } else if (user[domainKey] === staffDomainValue) {
        return <FacultyProfile />;
    }
}

export default Profile;