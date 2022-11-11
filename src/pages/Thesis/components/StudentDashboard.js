import { useEffect, useState } from "react";
import SimpleCard from "../../../components/Card/SimpleCard";
import { getThesisInstance, getThesisRegistrations } from "../../../db/remote/thesis";
import { useAuth } from "../../../utils/contexts/AuthContext";
import { useLoadingScreen } from "../../../utils/contexts/LoadingScreenContext";
import { pageLayoutStyles } from "../../../utils/styles/styles";
import ThesisAbstract from "./displayable/ThesisAbstract";
import ThesisApprovalStatus from "./displayable/ThesisApprovalStatus";
import ThesisMembers from "./displayable/ThesisMembers";
import ThesisRegistrationInfo from "./displayable/ThesisRegistrationInfo";
import ThesisTitle from "./displayable/ThesisTitle";

const StudentDashboard = () => {
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const { user } = useAuth();
    const [thesisReg, setThesisReg] = useState([]);
    const [thesisInstance, setThesisInstance] = useState([]);

    useEffect(() => {
        (async () => {
            if (thesisReg.length !== 2)
                await fetchThesisData();
        })();
    }, []);

    const displayRegistrationInformation = () => {
        if (thesisReg.length > 0) {
            if (thesisReg[0][1] && thesisInstance[0][1]) {
                return <SimpleCard title={"CSE400 Registration Information"}>
                    <div className="p-5 flex flex-col gap-10">
                        <ThesisRegistrationInfo thesis_instance={thesisInstance[0][0]} registration_instance={thesisReg[0][0]} />
                        <ThesisTitle application={thesisReg[0][0]} />
                        <ThesisAbstract application={thesisReg[0][0]} />
                        <ThesisMembers application={thesisReg[0][0]} />
                        <ThesisApprovalStatus application={thesisReg[0][0]} />
                    </div>
                </SimpleCard>
            }
        }

        return <div className="flex flex-col">
            <SimpleCard showTitle={false} customStyle={"w-[80%] md:w-[50%] mx-auto my-32"}>
                <div className="p-5 text-center">
                    No registered thesis found.
                </div>
            </SimpleCard>
        </div>
    }

    const fetchThesisData = async () => {
        showLoadingScreen("Fetching data, please wait...");
        const thesisRegInst = await getThesisRegistrations({ member_email: user.email });

        if (thesisRegInst[0][1]) {
            const thesisInst = await getThesisInstance({ instance_id: thesisRegInst[0][0].instance_id });
            setThesisReg(thesisRegInst);
            setThesisInstance(thesisInst);
        }

        hideLoadingScreen();
    }

    return <div className={`${pageLayoutStyles.scrollable}`}>
        {displayRegistrationInformation()}
    </div>
}

export default StudentDashboard;