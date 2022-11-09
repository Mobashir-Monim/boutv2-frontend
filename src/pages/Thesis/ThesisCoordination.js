import { deepCopy } from "@firebase/util";
import { useEffect, useState } from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SimpleCard from "../../components/Card/SimpleCard";
import { SelectInput } from "../../components/FormInputs/LabeledInputs";
import { getThesisInstance, getThesisInstanceStats } from "../../db/remote/thesis";
import { useAuth } from "../../utils/contexts/AuthContext";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";
import { useModal } from "../../utils/contexts/ModalContext";
import { applicationTypeColors, bgColorStyles, pageLayoutStyles } from "../../utils/styles/styles";
import PendingApplication from "./components/PendingApplication";
import { applicationTypeIcons } from "../../utils/styles/icons";

const ThesisCoordination = () => {
    const { showModal } = useModal();
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const { user } = useAuth();
    const [thesisSemester, setThesisSemester] = useState({ semester: null, year: null });
    const [thesisInstance, setThesisInstance] = useState([[null, null]]);
    const [thesisStats, setThesisStats] = useState(null);
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
        const stats = await getThesisInstanceStats(thesisInst[0][1])
        setThesisStats(stats);
        hideLoadingScreen();
    }

    const getRegStats = () => {
        if (thesisStats) {
            return <div className="p-5 overflow-scroll flex flex-col gap-5 h-[]">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-center gap-5 lg:gap-10">
                        <span className={`flex gap-2 ${applicationTypeColors.internship} py-1 px-3 rounded-full text-[0.8rem]`}>
                            <span className="material-icons-round my-auto text-[1.2rem]">{applicationTypeIcons.internship}</span>
                            <span className="my-auto">{thesisStats.reg_stats.internships}</span>
                        </span>
                        <span className={`flex gap-2 ${applicationTypeColors.project} py-1 px-3 rounded-full text-[0.8rem]`}>
                            <span className="material-icons-round my-auto text-[1.2rem]">{applicationTypeIcons.project}</span>
                            <span className="my-auto">{thesisStats.reg_stats.projects}</span>
                        </span>
                        <span className={`flex gap-2 ${applicationTypeColors.thesis} py-1 px-3 rounded-full text-[0.8rem]`}>
                            <span className="material-icons-round my-auto text-[1.2rem]">{applicationTypeIcons.thesis}</span>
                            <span className="my-auto">{thesisStats.reg_stats.theses}</span>
                        </span>
                    </div>
                    <div className="text-center">
                        Total Registrations: {thesisStats.reg_stats.total}
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className={`flex flex-row justify-between bg-[#ccc] dark:bg-[#333] py-2 px-2`}>
                        <span className="w-[80px] text-[0.8rem]"></span>
                        <span className="w-[80px] text-[0.8rem] text-center">Supervisor</span>
                        <span className="w-[80px] text-[0.8rem] text-center">Coordinator</span>
                    </div>
                    <div className={`flex flex-row justify-between py-2 px-2`}>
                        <span className="w-[80px] text-[0.8rem]">Approved</span>
                        <span className="w-[80px] text-[0.8rem] text-center">{thesisStats.approval_stats.supervisor}</span>
                        <span className="w-[80px] text-[0.8rem] text-center">{thesisStats.approval_stats.coordinator}</span>
                    </div>
                    <div className={`flex flex-row justify-between bg-[#ccc] dark:bg-[#333] py-2 px-2`}>
                        <span className="w-[80px] text-[0.8rem]">Soft Reject</span>
                        <span className="w-[80px] text-[0.8rem] text-center">{thesisStats.soft_reject_stats.supervisor}</span>
                        <span className="w-[80px] text-[0.8rem] text-center">{thesisStats.soft_reject_stats.coordinator}</span>
                    </div>
                    <div className={`flex flex-row justify-between py-2 px-2`}>
                        <span className="w-[80px] text-[0.8rem]">Hard Reject</span>
                        <span className="w-[80px] text-[0.8rem] text-center">{thesisStats.hard_reject_stats.supervisor}</span>
                        <span className="w-[80px] text-[0.8rem] text-center">{thesisStats.hard_reject_stats.coordinator}</span>
                    </div>
                    <div className={`flex flex-row justify-between bg-[#ccc] dark:bg-[#333] py-2 px-2`}>
                        <span className="w-[80px] text-[0.8rem]">Unprocessed</span>
                        <span className="w-[80px] text-[0.8rem] text-center">{thesisStats.unprocessed_stats.supervisor}</span>
                        <span className="w-[80px] text-[0.8rem] text-center">{thesisStats.unprocessed_stats.coordinator}</span>
                    </div>
                </div>
            </div>
        }

        return <div className="p-5 overflow-scroll flex flex-col gap-5 h-[]"></div>;
    }

    return <div className={`${pageLayoutStyles.scrollable} flex flex-col gap-5`}>
        <div className="flex flex-col md:flex-row gap-10">
            <div className="w-[100%] md:w-[40%] xl:w-[30%] flex flex-col gap-10">
                <SimpleCard title={"Thesis Semester"} customStyle={"w-[100%]"}>
                    <div className="p-5 overflow-scroll flex flex-col gap-5">
                        <SelectInput onChangeFn={event => updateThesisSemester(event, "semester")} options={!thesisSemester.semester ? ["Select Semester", ...semesters] : semesters} label="Semester" value={thesisSemester.semester} />
                        <SelectInput onChangeFn={event => updateThesisSemester(event, "year")} options={!thesisSemester.year ? ["Select Year", ...years] : years} label="Year" value={thesisSemester.year} />
                    </div>
                </SimpleCard>
                <SimpleCard title={"Registration Stats"} customStyle={"w-[100%]"}>
                    {getRegStats()}
                </SimpleCard>
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