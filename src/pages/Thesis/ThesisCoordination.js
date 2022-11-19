import { useEffect, useState } from "react";
import SimpleCard from "../../components/Card/SimpleCard";
import { getThesisInstance } from "../../db/remote/thesis";
import { useAuth } from "../../utils/contexts/AuthContext";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";
import { pageLayoutStyles } from "../../utils/styles/styles";
import PendingApplication from "./components/PendingApplication";
import ThesisRegistrationStats from "./components/displayable/ThesisRegistrationStats";
import { useSemesterSelect } from "../../utils/hooks/useSemesterSelect";
import { useModal } from "../../utils/contexts/ModalContext";

const ThesisCoordination = () => {
    const { showModal } = useModal();
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const { user } = useAuth();
    const [thesisInstance, setThesisInstance] = useState([[null, null]]);

    const getPendingApplications = () => {
        if (semesterSelection.isValidSelection()) {
            if (thesisInstance[0][1]) {
                return <PendingApplication user={user} coordinatorPending={true} thesis_instance={thesisInstance} />;
            } else {
                return <SimpleCard showTitle={false}><div className="p-5">No thesis data in selected semester</div></SimpleCard>;
            }
        } else {
            return <SimpleCard showTitle={false}><div className="p-5">Please select a semester first</div></SimpleCard>;
        }
    }

    const confirmSemester = async () => {
        if (semesterSelection.isValidSelection()) {
            showLoadingScreen("Loading thesis instance, please wait...");
            const thesisInst = await getThesisInstance(semesterSelection.values);
            setThesisInstance(thesisInst);
            hideLoadingScreen();
        } else {
            showModal("INVALID SEMESTER", "Please select a valid semester and year");
        }
    }

    const semesterSelection = useSemesterSelect(confirmSemester);

    return <div className={`${pageLayoutStyles.scrollable} flex flex-col gap-5`}>
        <div className="flex flex-col md:flex-row gap-10">
            <div className="w-[100%] md:w-[40%] xl:w-[30%] flex flex-col gap-10">
                <div className="w-[100%]">
                    {semesterSelection.semesterSelect}
                </div>
                <ThesisRegistrationStats thesisInstanceID={thesisInstance[0][1]} />
            </div>
            <SimpleCard title={"Pending Thesis Approval"} customStyle={"w-[100%] md:w-[60%] xl:w-[70%]"}>
                <div className="p-5 h-[40vh] md:h-[70vh] overflow-y-scroll no-scroll-bar">
                    {getPendingApplications()}
                </div>
            </SimpleCard>
        </div>
    </div>
}

export default ThesisCoordination;