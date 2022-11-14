import { useState, useEffect } from "react";
import { deepCopy } from "@firebase/util";
import SimpleCard from "../../components/Card/SimpleCard";
import { pageLayoutStyles, thesisStyles, } from "../../utils/styles/styles";
import { applicationTypeIcons } from "../../utils/styles/icons";
import { SelectInput } from "../../components/FormInputs/LabeledInputs";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";
import { getThesisInstance, getThesisRegistrations } from "../../db/remote/thesis";
import ThesisRegistrationStats from "./components/displayable/ThesisRegistrationStats";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import { useModal } from "../../utils/contexts/ModalContext";
import { useAuth } from "../../utils/contexts/AuthContext";
import ThesisApplicationDetails from "./components/ThesisApplicationDetails";

const ThesisRegistrations = () => {
    const { user } = useAuth();
    const { showModal } = useModal()
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const [thesisSemester, setThesisSemester] = useState({ semester: null, year: null });
    const [thesisInstance, setThesisInstance] = useState([[null, null]]);
    const [thesisApplications, setThesisApplications] = useState([[null, null]]);
    const years = Array((new Date()).getUTCFullYear() - 2020 + 1).fill().map((_, idx) => `${2020 + idx}`);
    const semesters = ["Spring", "Summer", "Fall"];
    const statusMap = [
        { display: "Pending", color: "text-orange-600" },
        { display: "Hard Reject", color: "text-rose-600" },
        { display: "Soft Reject", color: "text-orange-600" },
        { display: "Approved", color: "text-teal-600" },
    ]

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
        const applications = await getThesisRegistrations({ instance_id: thesisInst[0][1] });
        setThesisInstance(thesisInst);
        setThesisApplications(applications);
        hideLoadingScreen();
    }
    const getModalHeading = index => <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between">
            <p className="text-orange-500 font-bold font-mono my-auto text-[0.9rem]">[ PENDING {thesisApplications[index][0].type.toUpperCase()} ]</p>
            <span className={`${thesisStyles.cardIcon}`}>{applicationTypeIcons[thesisApplications[index][0].type]}</span>
        </div>
        <div className="">{thesisApplications[index][0].title}</div>
    </div>

    const showApplicationDetails = (index) => {
        showModal(
            getModalHeading(index),
            <ThesisApplicationDetails
                application={thesisApplications[index]}
                isThesisCoordinator={false}
                user={user}
                updatePendingApplicationList={() => { }}
                thesis_instance={thesisInstance}
            />
        )
    }

    const getApplications = () => {
        if (thesisApplications[0][1]) {
            return thesisApplications.map((application, index) => <div className={`flex flex-row min-w-[1150px] w-[100%] ${index % 2 === 0 ? "" : "bg-[#ccc] dark:bg-[#333]"} py-5 px-10 text-[0.8rem]`} key={application[1]}>
                <span className="inline-block min-w-[100px] max-w-[100px] my-auto">{application[0].type.slice(0, 1).toUpperCase()}{application[0].type.slice(1)}</span>
                <span className="inline-block min-w-[300px] max-w-[300px] my-auto">{application[0].supervisor[0]}</span>
                <span className="inline-block min-w-[300px] max-w-[300px] text-justify my-auto">{application[0].title}</span>
                <span className="inline-block min-w-[150px] max-w-[150px] my-auto text-center">{application[0].member_emails.length}</span>
                <span className="inline-block min-w-[150px] max-w-[150px] text-center my-auto text-[0.8rem]">
                    <div className={`${statusMap[application[0].supervisor_approval].color} font-mono`}>
                        [ {statusMap[application[0].supervisor_approval].display} ]
                    </div>
                    <div className={`${statusMap[application[0].coordinator_approval].color} font-mono`}>
                        [ {statusMap[application[0].coordinator_approval].display} ]
                    </div>
                </span>
                <span className="flex flex-row flex-wrap gap-2 min-w-[100px] max-w-[100px] justify-center my-auto">
                    <PrimaryButton text={"visibility"} customStyle={"material-icons-round !p-1"} clickFunction={() => showApplicationDetails(index)} />
                    <SecondaryButton text={"delete"} customStyle={"material-icons-round !p-1"} />
                </span>
            </div>)
        }

        return <></>
    }

    return <div className={`${pageLayoutStyles.scrollable} flex flex-col gap-10`}>
        <div className="w-[100%] flex flex-col md:flex-row gap-10">
            <div className="w-[100%] md:w-[50%]">
                <SimpleCard title={"Thesis Semester"}>
                    <div className="p-5 overflow-scroll flex flex-col gap-5">
                        <SelectInput onChangeFn={event => updateThesisSemester(event, "semester")} options={!thesisSemester.semester ? ["Select Semester", ...semesters] : semesters} label="Semester" value={thesisSemester.semester} />
                        <SelectInput onChangeFn={event => updateThesisSemester(event, "year")} options={!thesisSemester.year ? ["Select Year", ...years] : years} label="Year" value={thesisSemester.year} />
                    </div>
                </SimpleCard>
            </div>
            <ThesisRegistrationStats thesisInstanceID={thesisInstance[0][1]} display={"row"} />
        </div>
        <div className="">
            <SimpleCard title={"CSE400 Registrations"}>
                <div>
                    <div className="p-5">
                        afafas
                    </div>
                    <div className="overflow-scroll h-[40vh] relative no-scroll-bar">
                        <div className="flex flex-row min-w-[1150px] w-[100%] bg-[#aaa] dark:bg-[#222] py-2 px-10 text-[0.8rem] sticky top-0 z-10 font-bold">
                            <span className="inline-block min-w-[100px] max-w-[100px]">Type</span>
                            <span className="inline-block min-w-[300px] max-w-[300px]">Supervisor</span>
                            <span className="inline-block min-w-[300px] max-w-[300px] text-center">Title</span>
                            <span className="inline-block min-w-[150px] max-w-[150px] text-center">Members</span>
                            <span className="inline-block min-w-[150px] max-w-[150px] text-center">Status</span>
                            <span className="inline-block min-w-[100px] max-w-[100px] text-center">Action</span>
                        </div>
                        {getApplications()}
                    </div>
                </div>
            </SimpleCard>
        </div>
    </div>
}

export default ThesisRegistrations;