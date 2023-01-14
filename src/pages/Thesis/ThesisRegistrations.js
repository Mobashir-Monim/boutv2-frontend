import { useState, useEffect } from "react";
import { deepCopy } from "@firebase/util";
import SimpleCard from "../../components/Card/SimpleCard";
import { pageLayoutStyles, thesisStyles, } from "../../utils/styles/styles";
import { applicationTypeIcons } from "../../utils/styles/icons";
import { CheckboxInput, LineInput } from "../../components/FormInputs/LabeledInputs";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";
import { getThesisInstance, getThesisRegistrations } from "../../db/remote/thesis";
import ThesisRegistrationStats from "./components/displayable/ThesisRegistrationStats";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import { useModal } from "../../utils/contexts/ModalContext";
import { useAuth } from "../../utils/contexts/AuthContext";
import ThesisApplicationDetails from "./components/ThesisApplicationDetails";
import { deepClone } from "../../utils/functions/deepClone";
import { useSemesterSelect } from "../../utils/hooks/useSemesterSelect";
import { getStudents } from "../../db/remote/student";

const ThesisRegistrations = () => {
    const { user } = useAuth();
    const { showModal } = useModal()
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const [thesisInstance, setThesisInstance] = useState([[null, null]]);
    const [thesisApplications, setThesisApplications] = useState([[null, null]]);
    const [filteredApplications, setFilteredApplications] = useState([[null, null]]);
    const [studentInfo, setStudentInfo] = useState({});
    const [filterSettings, setFilterSettings] = useState({
        supervisor_approval: ["0", "1", "2", "3"],
        coordinator_approval: ["0", "1", "2", "3"],
        type: ["project", "internship", "thesis"],
        supervisor: "",
    });
    const statusMap = [
        { display: "Pending", color: "text-orange-600" },
        { display: "Hard Reject", color: "text-rose-600" },
        { display: "Soft Reject", color: "text-orange-600" },
        { display: "Approved", color: "text-teal-600" },
    ];

    const confirmSemester = async () => {
        if (semesterSelection.isValidSelection()) {
            showLoadingScreen("Loading thesis instance, please wait...");
            const thesisInst = await getThesisInstance(semesterSelection.values);
            const applications = await getThesisRegistrations({ instance_id: thesisInst[0][1] });
            setThesisInstance(thesisInst);
            setThesisApplications(applications);
            setFilteredApplications(applications);
            await fetchStudentInfo(applications);
            hideLoadingScreen();
        } else {
            showModal("INVALID SEMESTER", "Please select a valid semester and year");
        }
    }

    const semesterSelection = useSemesterSelect(confirmSemester);

    const fetchStudentInfo = async applications => {
        let emails = [];

        for (let app of applications)
            emails = [...emails, ...app[0].member_emails]

        const studentInstances = await getStudents({ official_emails: emails });
        let info = {};

        for (let student of studentInstances)
            info[student[0].official_email] = {
                name: student[0].name,
                student_id: student[0].student_id,
                discord_id: student[0].discord_id,
                phone: student[0].phone,
            }

        setStudentInfo(info);
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

    const copySupervisorEmails = () => {
        let emails = [];

        for (let app of filteredApplications) {
            if (!emails.includes(app[0].supervisor[0]))
                emails.push(app[0].supervisor[0])
        }

        navigator.clipboard.writeText(emails.join(","));
    }

    const copyStudentEmails = () => {
        let emails = [];

        for (let app of filteredApplications) {
            for (let student of app[0].member_emails) {
                if (!emails.includes(student))
                    emails.push(student)
            }
        }

        navigator.clipboard.writeText(emails.join(","));
    }

    return <div className={`${pageLayoutStyles.scrollable} flex flex-col gap-10`}>
        <div className="w-[100%] flex flex-col md:flex-row gap-10">
            <div className="w-[100%] md:w-[50%]">
                {semesterSelection.semesterSelect}
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
                        <div className="w-[100%] flex flex-col md:flex-row gap-10">
                            <PrimaryButton customStyle={"w-[100%] md:w-[calc(50%-1.25rem)]"} clickFunction={copySupervisorEmails} text={"Copy supervisor emails in selection"} />
                            <PrimaryButton customStyle={"w-[100%] md:w-[calc(50%-1.25rem)]"} clickFunction={copyStudentEmails} text={"Copy student emails in selection"} />
                        </div>
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

        {/* {thesisApplications[0][1] && Object.keys(studentInfo).length > 0 ? <SimpleCard title={"Table Format"}>
            <div className="p-5">
                <div className="overflow-scroll no-scroll-bar">
                    <table className="text-[0.8rem] w-[2600px] border-[1px]">
                        <thead>
                            <tr>
                                <th className="w-[100px] border-[1px]">Number</th>
                                <th className="w-[100px] border-[1px]">Level</th>
                                <th className="w-[100px] border-[1px]">Type</th>
                                <th className="w-[100px] border-[1px]">Panel</th>
                                <th className="w-[100px] border-[1px]">Serial</th>
                                <th className="w-[200px] border-[1px]">Primary Supervisor</th>
                                <th className="w-[200px] border-[1px]">Secondary Supervisor</th>
                                <th className="w-[200px] border-[1px]">Co-supervisor 1</th>
                                <th className="w-[200px] border-[1px]">Co-supervisor 2</th>
                                <th className="w-[200px] border-[1px]">Title</th>
                                <th className="w-[400px] border-[1px]">Abstract</th>
                                <th className="w-[100px] border-[1px]">Registration</th>
                                <th className="w-[100px] border-[1px]">Members</th>
                                <th className="w-[200px] border-[1px]">Email</th>
                                <th className="w-[100px] border-[1px]">Credits</th>
                                <th className="w-[200px] border-[1px]">Name</th>
                                <th className="w-[100px] border-[1px]">Phone</th>
                                <th className="w-[100px] border-[1px]">Student ID</th>
                                <th className="w-[250px] border-[1px]">Discord ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {thesisApplications.map(app => app[0].member_emails.map((row, rowIndex) => <tr>
                                {rowIndex === 0 ? <td className="w-[100px] border-[1px]" rowSpan={app[0].member_emails.length}>{app[0].type.slice(0, 1).toUpperCase()}{app[0].number}</td> : <></>}
                                {rowIndex === 0 ? <td className="w-[100px] border-[1px]" rowSpan={app[0].member_emails.length}>{app[0].level}</td> : <></>}
                                {rowIndex === 0 ? <td className="w-[100px] border-[1px]" rowSpan={app[0].member_emails.length}>{app[0].type}</td> : <></>}
                                {rowIndex === 0 ? <td className="w-[100px] border-[1px]" rowSpan={app[0].member_emails.length}></td> : <></>}
                                {rowIndex === 0 ? <td className="w-[100px] border-[1px]" rowSpan={app[0].member_emails.length}></td> : <></>}
                                {rowIndex === 0 ? <td className="w-[200px] border-[1px]" rowSpan={app[0].member_emails.length}>{app[0].supervisor[0]}</td> : <></>}
                                {rowIndex === 0 ? <td className="w-[200px] border-[1px]" rowSpan={app[0].member_emails.length}></td> : <></>}
                                {rowIndex === 0 ? <td className="w-[200px] border-[1px]" rowSpan={app[0].member_emails.length}></td> : <></>}
                                {rowIndex === 0 ? <td className="w-[200px] border-[1px]" rowSpan={app[0].member_emails.length}></td> : <></>}
                                {rowIndex === 0 ? <td className="w-[200px] border-[1px]" rowSpan={app[0].member_emails.length}>{app[0].title}</td> : <></>}
                                {rowIndex === 0 ? <td className="w-[400px] border-[1px]" rowSpan={app[0].member_emails.length}>{app[0].abstract}</td> : <></>}
                                {rowIndex === 0 ? <td className="w-[100px] border-[1px]" rowSpan={app[0].member_emails.length}>2022 Fall</td> : <></>}
                                {rowIndex === 0 ? <td className="w-[100px] border-[1px]" rowSpan={app[0].member_emails.length}>{app[0].member_emails.length}</td> : <></>}
                                <td className="w-[200px] border-[1px]">{row}</td>
                                <td className="w-[200px] border-[1px]">{app[0].credits_completed[rowIndex]}</td>
                                <td className="w-[200px] border-[1px]">{studentInfo[row].name}</td>
                                <td className="w-[100px] border-[1px]">{studentInfo[row].phone}</td>
                                <td className="w-[100px] border-[1px]">{studentInfo[row].student_id}</td>
                                <td className="w-[250px] border-[1px]">{studentInfo[row].discord_id}</td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SimpleCard> : <></>} */}
    </div >
}

export default ThesisRegistrations;