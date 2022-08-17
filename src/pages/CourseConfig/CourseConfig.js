import { useNavigate } from "react-router-dom";
import SimpleCard from "../../components/Card/SimpleCard";
import { useAuth } from "../../utils/contexts/AuthContext";
import { pageLayoutStyles } from "../../utils/styles/styles";

const CourseConfig = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (user.email !== "mobashir.monim@bracu.ac.bd") navigate("/");

    return <div className={`${pageLayoutStyles.scrollable}`}>
        <SimpleCard title={"Course Config Admin"}>
            <div>
                bas
            </div>
        </SimpleCard>
    </div>
}

export default CourseConfig;