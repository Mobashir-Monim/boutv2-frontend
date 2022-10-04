import { auth } from "../../db/remote/firebase";
import { useAuth } from "../../utils/contexts/AuthContext";
import { pageLayoutStyles } from "../../utils/styles/styles";
import FacultyDashboard from "./components/FacultyDashboard";
import NonMemberDashboard from "./components/NonMemberDashboard";
import StudentDashboard from "./components/StudentDashboard";
import { domainKey, studentDomainValue, staffDomainValue } from "../../utils/contants";

const Dashboard = () => {
    const { user } = useAuth();
    let content = null;

    if (user[domainKey] === staffDomainValue) {
        content = <FacultyDashboard user={user} />
    } else if (user[domainKey] === studentDomainValue) {
        content = <StudentDashboard user={user} />
    } else {
        content = <NonMemberDashboard user={user} />
    }

    return <div className={`${pageLayoutStyles.scrollable} flex flex-col justify-center`}>
        {content}
    </div>
}

export default Dashboard;