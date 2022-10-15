import { useEffect, useState } from "react";
import { LineInput, SelectInput, TextInput } from "../../components/FormInputs/LabeledInputs";
import { pageLayoutStyles, transitioner } from "../../utils/styles/styles";
import { deepClone } from "../../utils/functions/deepClone";
import SimpleCard from "../../components/Card/SimpleCard";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { getFacultyMemberByInitials, getFacultyMembersByStatus } from "../../db/remote/faculty";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";


const ThesisRegistration = () => {
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const thesisTypes = { thesis: "Thesis", project: "Project", internship: "Internship" };
    const memberDetails = ["names", "student_ids", "credit_completed", "student_uids"];

    const [application, setApplication] = useState({
        type: null,
        title: "",
        abstract: "",
        supervisor: "",
        members: 1,
        names: [""],
        student_ids: [""],
        student_uids: [""],
        credit_completed: [""],
        supervisor_details: { name: "", email: "", initials: "" }
    });

    const updateApplication = async (event, target) => {
        const applicationClone = deepClone(application);
        applicationClone[target] = event.target.value;

        if (target === "type" && event.target.value === "internship")
            resetMembers(applicationClone);

        if (target === "members")
            updateMembersCount(applicationClone);

        if (target === "supervisor") {
            applicationClone.supervisor = /^[a-zA-Z()]+$/.test(event.target.value[event.target.value.length - 1]) ? applicationClone.supervisor.toUpperCase() : application.supervisor;

            if (applicationClone.supervisor.length === 3 && event.target.value.toUpperCase() !== application.supervisor_details.initials) {
                await setThesisSupervisor(applicationClone);
            } else {
                applicationClone.supervisor_details.name = "";
                applicationClone.supervisor_details.email = "";
                applicationClone.supervisor_details.initials = "";
            }
        }

        setApplication(applicationClone);
    }

    const resetMembers = application => {
        application.members = 1;
        memberDetails.forEach(detail => { application[detail] = [""] });
    }

    const updateMemberDetails = (event, index, detail) => {
        const applicationClone = deepClone(application);
        applicationClone[detail][index] = event.target.value;

        setApplication(applicationClone);
    }

    const setThesisSupervisor = async application => {
        const supervisor = await getFacultyMemberByInitials({ initials: application.supervisor });

        if (supervisor[0][1]) {
            application.supervisor_details.name = supervisor[0][0].name;
            application.supervisor_details.email = supervisor[0][0].email;
            application.supervisor_details.initials = supervisor[0][0].initials;
        } else {
            application.supervisor_details.name = "INVALID INITIALS";
            application.supervisor_details.email = "INVALID INITIALS";
            application.supervisor_details.initials = "INVALID INITIALS";
        }
    }

    const updateMembersCount = application => {
        application.members = parseInt(application.members);

        memberDetails.forEach(detail => {
            if (application.members > application[detail].length) {
                while (application.members > application[detail].length)
                    application[detail].push("");
            } else {
                application[detail] = deepClone(application[detail].slice(0, application.members));
            }
        });
    }

    const isSubmittable = () => {

    }

    return <div className={`${pageLayoutStyles.scrollable}`}>
        <div className="w-[90%] lg:w-[80%] xl:w-[70%] flex flex-col gap-10 mx-auto">
            <SimpleCard title={"Thesis information"}>
                <div className="flex flex-col gap-5 p-5">
                    <div className="flex flex-col md:flex-row gap-5">
                        <SelectInput options={application.type ? thesisTypes : { "": "Select type", ...thesisTypes }} label="Thesis Type" customStyle={{ container: "basis-1/2" }} onChangeFn={event => updateApplication(event, "type")} value={application.type} />
                        {/* <SelectInput options={application.supervisor ? supervisors : { "": "Select Supervisor", ...supervisors }} label="Supervisor" customStyle={{ container: "basis-1/2" }} onChangeFn={event => updateApplication(event, "supervisor")} /> */}
                    </div>
                    <div className={`flex flex-col md:flex-row gap-5 ${application.type === "internship" || !application.type ? "h-[0px]" : "h-[60px]"} overflow-hidden ${transitioner.simple}`}>
                        <SelectInput options={[1, 2, 3, 4, 5]} customStyle={{ container: "basis-1/2" }} label="Number of members" onChangeFn={event => updateApplication(event, "members")} value={application.members} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-5">
                        <LineInput label="Title" customStyle={{ container: "w-[100%]" }} onChangeFn={event => updateApplication(event, "title")} placeholder="Thesis Title" value={application.title} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-5">
                        <TextInput label="Abstract" customStyle={{ container: "w-[100%]" }} onChangeFn={event => updateApplication(event, "abstract")} placeholder="Thesis Abstract" value={application.abstract} />
                    </div>
                </div>
            </SimpleCard>

            <SimpleCard title={"Supervisor Information"}>
                <div className="flex flex-col gap-5 p-5">
                    <div className="flex flex-col md:flex-row gap-5">
                        <LineInput label="Supervisor Initials" customStyle={{ container: "w-[100%] md:w-[50%]" }} onChangeFn={event => updateApplication(event, "supervisor")} placeholder="Supervisor Initials" max={3} min={3} value={application.supervisor} />
                    </div>
                    <div className={`flex flex-col md:flex-row gap-5 ${application.supervisor_details.name !== "" && application.supervisor_details.name !== "INVALID INITIALS" ? "h-[140px] md:h-[60px]" : "h-[0px]"} overflow-hidden ${transitioner.simple}`}>
                        <LineInput label="Supervisor Name" customStyle={{ container: "w-[100%] md:w-[50%]" }} placeholder="Supervisor Name" readOnly={true} value={application.supervisor_details.name} />
                        <LineInput label="Supervisor Email" customStyle={{ container: "w-[100%] md:w-[50%]" }} placeholder="Supervisor Email" readOnly={true} value={application.supervisor_details.email} />
                    </div>
                </div>
            </SimpleCard>

            {Array(application.members).fill(1).map((_, mIndex) => <SimpleCard title={`Member ${mIndex + 1} information`} key={`member-${mIndex}`}>
                <div className="flex flex-col gap-5 p-5">
                    <div className="flex flex-col md:flex-row gap-5">
                        <LineInput label={`Student ID`} customStyle={{ container: "w-[100%] md:w-[50%]" }} placeholder={`Member ${mIndex + 1} Student ID`} onChangeFn={event => updateMemberDetails(event, mIndex, "student_ids")} />
                        <LineInput label={`Credits Completed`} customStyle={{ container: "w-[60%] md:w-[20%] ml-auto md:mr-auto md:ml-0" }} placeholder={`Credits Completed`} onChangeFn={event => updateMemberDetails(event, mIndex, "credit_completed")} />
                    </div>
                </div>
            </SimpleCard>)}

            <PrimaryButton text={"Submit Thesis Registration Form"} />
        </div>
    </div>
}

export default ThesisRegistration;