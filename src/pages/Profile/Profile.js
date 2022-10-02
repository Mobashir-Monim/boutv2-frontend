import { useAuth } from "../../utils/contexts/AuthContext";
import StudentProfile from "./components/StudentProfile";

const Profile = () => {
    const { user } = useAuth();

    return <StudentProfile user={user} />
}

export default Profile;