import { getAuth } from "firebase/auth";
import { useAuth } from "../../utils/contexts/AuthContext";
import { pageLayoutStyles } from "../../utils/styles/styles";
import FacultyDashboard from "./components/FacultyDashboard";
import NonMemberDashboard from "./components/NonMemberDashboard";
import StudentDashboard from "./components/StudentDashboard";

const auth = getAuth();

const Dashboard = () => {
    const { user } = useAuth();
    let content = null;

    if (auth.currentUser.email.endsWith("@bracu.ac.bd")) {
        content = <FacultyDashboard user={user} />
    } else if (auth.currentUser.email.endsWith("@g.bracu.ac.bd")) {
        content = <StudentDashboard user={user} />
    } else {
        content = <NonMemberDashboard user={user} />
    }

    return <div className={`${pageLayoutStyles.scrollable} flex flex-col justify-center`}>
        {content}
    </div>
}

export default Dashboard;