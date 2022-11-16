import { deepCopy } from "@firebase/util";
import { useEffect, useState } from "react";
import SimpleCard from "../../components/Card/SimpleCard";
import { SelectInput } from "../../components/FormInputs/LabeledInputs";
import { getThesisInstance } from "../../db/remote/thesis";
import { useAuth } from "../../utils/contexts/AuthContext";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";
import { pageLayoutStyles } from "../../utils/styles/styles";
import PendingApplication from "./components/PendingApplication";
import ThesisRegistrationStats from "./components/displayable/ThesisRegistrationStats";

const ThesisCoordination = () => {
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const { user } = useAuth();
    const [thesisSemester, setThesisSemester] = useState({ semester: null, year: null });
    const [thesisInstance, setThesisInstance] = useState([[null, null]]);
    const years = Array((new Date()).getUTCFullYear() - 2020 + 1).fill().map((_, idx) => `${2020 + idx}`);
    const semesters = ["Spring", "Summer", "Fall"];

    const getPendingApplications = () => {
        if (thesisSemester.semester && thesisSemester.year) {
            if (thesisInstance[0][1]) {
                return <PendingApplication user={user} coordinatorPending={true} thesis_instance={thesisInstance} />;
            } else {
                return <SimpleCard showTitle={false}><div className="p-5">No thesis data in selected semester</div></SimpleCard>;
            }
        } else {
            return <SimpleCard showTitle={false}><div className="p-5">Please select a semester first</div></SimpleCard>;
        }
    }

    useEffect(() => {
        (async () => {
            if (thesisSemester.year && thesisSemester.semester)
                await confirmSemester();
        })();
    }, [thesisSemester]);

    const updateThesisSemester = (event, target) => {
        const thesisSemesterClone = deepCopy(thesisSemester);
        thesisSemesterClone[target] = event.target.value;
        setThesisSemester(thesisSemesterClone);
    }

    const confirmSemester = async () => {
        showLoadingScreen("Loading thesis instance, please wait...");
        const thesisInst = await getThesisInstance(thesisSemester);
        setThesisInstance(thesisInst);
        hideLoadingScreen();
    }

    return <div className={`${pageLayoutStyles.scrollable} flex flex-col gap-5`}>
        <div className="flex flex-col md:flex-row gap-10">
            <div className="w-[100%] md:w-[40%] xl:w-[30%] flex flex-col gap-10">
                <SimpleCard title={"Thesis Semester"} customStyle={"w-[100%]"}>
                    <div className="p-5 flex flex-col gap-5">
                        <SelectInput onChangeFn={event => updateThesisSemester(event, "semester")} options={!thesisSemester.semester ? ["Select Semester", ...semesters] : semesters} label="Semester" value={thesisSemester.semester} />
                        <SelectInput onChangeFn={event => updateThesisSemester(event, "year")} options={!thesisSemester.year ? ["Select Year", ...years] : years} label="Year" value={thesisSemester.year} />
                    </div>
                </SimpleCard>
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