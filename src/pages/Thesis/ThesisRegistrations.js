import { useState, useEffect } from "react";
import { deepCopy } from "@firebase/util";
import SimpleCard from "../../components/Card/SimpleCard";
import { pageLayoutStyles, thesisStyles, } from "../../utils/styles/styles";
import { applicationTypeIcons } from "../../utils/styles/icons";
import { CheckboxInput, LineInput, SelectInput } from "../../components/FormInputs/LabeledInputs";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";
import { getThesisInstance, getThesisRegistrations } from "../../db/remote/thesis";
import ThesisRegistrationStats from "./components/displayable/ThesisRegistrationStats";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import { useModal } from "../../utils/contexts/ModalContext";
import { useAuth } from "../../utils/contexts/AuthContext";
import ThesisApplicationDetails from "./components/ThesisApplicationDetails";
import { deepClone } from "../../utils/functions/deepClone";

const ThesisRegistrations = () => {
    const { user } = useAuth();
    const { showModal } = useModal()
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const [thesisSemester, setThesisSemester] = useState({ semester: null, year: null });
    const [thesisInstance, setThesisInstance] = useState([[null, null]]);
    const [thesisApplications, setThesisApplications] = useState([[null, null]]);
    const [filteredApplications, setFilteredApplications] = useState([[null, null]]);
    const [filterSettings, setFilterSettings] = useState({
        supervisor_approval: ["0", "1", "2", "3"],
        coordinator_approval: ["0", "1", "2", "3"],
        type: ["project", "internship", "thesis"],
        supervisor: "",
    });
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
        setFilteredApplications(applications);
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
                application={filteredApplications[index]}
                isThesisCoordinator={false}
                user={user}
                updatePendingApplicationList={() => { }}
                thesis_instance={thesisInstance}
            />
        )
    }

    const updateFilterCheckboxes = (target, opt) => {
        const filterSettingsClone = deepClone(filterSettings);
        const optIndex = filterSettingsClone[target].indexOf(opt);

        if (optIndex > -1) {
            filterSettingsClone[target].splice(optIndex, 1);
        } else {
            filterSettingsClone[target].push(opt);
        }

        setFilterSettings(filterSettingsClone);
        updateFilteredApplications();
    }

    const updateFilterSupervisor = event => {
        const filterSettingsClone = deepClone(filterSettings);
        filterSettingsClone.supervisor = event.target.value;
        setFilterSettings(filterSettingsClone);
        updateFilteredApplications(event.target.value);
    }

    const updateFilteredApplications = (email = "") => {
        console.log("calling");
        let filteredApplicationsClone = deepCopy(thesisApplications.filter(app => filterSettings.supervisor_approval.includes(`${app[0].supervisor_approval}`)));
        filteredApplicationsClone = filteredApplicationsClone.filter(app => filterSettings.coordinator_approval.includes(`${app[0].coordinator_approval}`));
        filteredApplicationsClone = filteredApplicationsClone.filter(app => filterSettings.type.includes(app[0].type));

        if (email !== "")
            filteredApplicationsClone = filteredApplicationsClone.filter(app => app[0].supervisor[0].startsWith(email));

        if (filteredApplicationsClone.length === 0)
            filteredApplicationsClone = [[]];

        setFilteredApplications(filteredApplicationsClone);
    }

    const getApplications = () => {
        if (filteredApplications[0][1]) {
            return filteredApplications.map((application, index) => <div className={`flex flex-row min-w-[1150px] w-[100%] ${index % 2 === 0 ? "" : "bg-[#ccc] dark:bg-[#333]"} py-5 px-10 text-[0.8rem]`} key={application[1]}>
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
                    <div className="p-5 flex flex-col gap-5">
                        <SelectInput onChangeFn={event => updateThesisSemester(event, "semester")} options={!thesisSemester.semester ? ["Select Semester", ...semesters] : semesters} label="Semester" value={thesisSemester.semester} />
                        <SelectInput onChangeFn={event => updateThesisSemester(event, "year")} options={!thesisSemester.year ? ["Select Year", ...years] : years} label="Year" value={thesisSemester.year} />
                    </div>
                </SimpleCard>
            </div>
            <ThesisRegistrationStats thesisInstanceID={thesisInstance[0][1]} display={"row"} />
        </div>
        <div className={`${thesisApplications[0][0] ? "" : "hidden"}`}>
            <SimpleCard title={"CSE400 Registrations"}>
                <div>
                    <div className="p-5 flex flex-col md:flex-row flex-wrap gap-5">
                        <SimpleCard showTitle={false} customStyle={"w-[100%] md:w-[calc(50%-1.25rem)] drop-shadow-none !bg-[#ccc] dark:!bg-[#333]"}>
                            <div className="px-2 py-1">
                                <CheckboxInput
                                    name={"supervisor_approval"}
                                    customStyle={{
                                        labels_container: "!flex-row flex-wrap justify-between",
                                        container: "!flex-col !gap-2 !mt-0",
                                        label: "!text-left -order-1"
                                    }}
                                    label={"Supervisor approval"}
                                    options={{ "0": "Pending", "1": "Hard Rejected", "2": "Soft Rejected", "3": "Approved" }}
                                    values={filterSettings.supervisor_approval}
                                    onChangeFn={opt => updateFilterCheckboxes("supervisor_approval", opt)}
                                />
                            </div>
                        </SimpleCard>
                        <SimpleCard showTitle={false} customStyle={"w-[100%] md:w-[calc(50%-1.25rem)] drop-shadow-none !bg-[#ccc] dark:!bg-[#333]"}>
                            <div className="px-2 py-1">
                                <CheckboxInput
                                    name={"coordinator_approval"}
                                    customStyle={{
                                        labels_container: "!flex-row flex-wrap justify-between",
                                        container: "!flex-col !gap-2 !mt-0",
                                        label: "!text-left -order-1"
                                    }}
                                    label={"Coordinator approval"}
                                    options={{ "0": "Pending", "1": "Hard Rejected", "2": "Soft Rejected", "3": "Approved" }}
                                    values={filterSettings.coordinator_approval}
                                    onChangeFn={opt => updateFilterCheckboxes("coordinator_approval", opt)}
                                />
                            </div>
                        </SimpleCard>
                        <SimpleCard showTitle={false} customStyle={"w-[100%] md:w-[calc(50%-1.25rem)] drop-shadow-none !bg-[#ccc] dark:!bg-[#333]"}>
                            <div className="px-2 py-1">
                                <CheckboxInput
                                    name={"type"}
                                    customStyle={{
                                        labels_container: "!flex-row flex-wrap justify-between",
                                        container: "!flex-col !gap-2 !mt-0",
                                        label: "!text-left -order-1"
                                    }}
                                    label={"Registration Type"}
                                    options={{ "internship": "Internship", "project": "Project", "thesis": "Thesis" }}
                                    values={filterSettings.type}
                                    onChangeFn={opt => updateFilterCheckboxes("type", opt)}
                                />
                            </div>
                        </SimpleCard>
                        <SimpleCard showTitle={false} customStyle={"w-[100%] md:w-[calc(50%-1.25rem)] drop-shadow-none"}>
                            <div className="px-2 py-1">
                                <LineInput label={"Supervisor Email"} onChangeFn={updateFilterSupervisor} value={filterSettings.supervisor} />
                            </div>
                        </SimpleCard>
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