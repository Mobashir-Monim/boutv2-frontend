import { useState } from "react";
import { LineInput, SelectInput, TextInput } from "../../components/FormInputs/LabeledInputs";
import { pageLayoutStyles, transitioner } from "../../utils/styles/styles";
import { supervisors } from "./supervisors";
import { deepClone } from "../../utils/functions/deepClone";
import * as inputValidators from "../../utils/functions/inputValidators";
import SimpleCard from "../../components/Card/SimpleCard";
import PrimaryButton from "../../components/Buttons/PrimaryButton";


const ThesisRegistration = () => {
    const programs = ["CS", "CSE"];
    const thesisTypes = { thesis: "Thesis", project: "Project", internship: "Internship" };
    const memberDetails = ["names", "student_ids", "credit_completed", "student_uids"];
    const thesisDataValidations = {
        type: [inputValidators.isNotEmpty,]
    };

    const [application, setApplication] = useState({
        type: null,
        title: "",
        abstract: "",
        supervisor: null,
        members: 1,
        names: [""],
        student_ids: [""],
        student_uids: [""],
        credit_completed: [""],
    });

    const updateApplication = (event, target) => {
        const applicationClone = deepClone(application);
        applicationClone[target] = event.target.value;

        if (target === "type" && event.target.value === "internship")
            resetMembers(applicationClone);

        if (target === "members")
            updateMembersCount(applicationClone);

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
                <div className="flex flex-col gap-5 py-5">
                    <div className="flex flex-col md:flex-row gap-5">
                        <SelectInput options={application.type ? thesisTypes : { "": "Select type", ...thesisTypes }} label="Thesis Type" customStyle={{ container: "basis-1/2" }} onChangeFn={event => updateApplication(event, "type")} value={application.type} />
                        <SelectInput options={application.supervisor ? supervisors : { "": "Select Supervisor", ...supervisors }} label="Supervisor" customStyle={{ container: "basis-1/2" }} onChangeFn={event => updateApplication(event, "supervisor")} />
                    </div>
                    <div className={`flex flex-col md:flex-row gap-5 ${application.type === "internship" || !application.type ? "hidden" : ""} overflow-hidden ${transitioner.simple}`}>
                        <SelectInput options={[1, 2, 3, 4, 5]} customStyle={{ container: "basis-1/2" }} label="Number of members" onChangeFn={event => updateApplication(event, "members")} value={application.members} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-5">
                        <LineInput label="Title" customStyle={{ container: "w-[100%]" }} onChangeFn={event => updateApplication(event, "title")} placeholder="Thesis Title" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-5">
                        <TextInput label="Abstract" customStyle={{ container: "w-[100%]" }} onChangeFn={event => updateApplication(event, "abstract")} placeholder="Thesis Abstract" />
                    </div>
                </div>
            </SimpleCard>

            {Array(application.members).fill(1).map((_, mIndex) => <SimpleCard title={`Member ${mIndex + 1} information`} key={`member-${mIndex}`}>
                <div className="flex flex-col gap-5 py-5">
                    {/* <div className="flex flex-col md:flex-row gap-5">
                        <LineInput label={`Name`} customStyle={{ container: "basis-1/2" }} placeholder={`Member ${mIndex + 1} Name`} onChangeFn={event => updateMemberDetails(event, mIndex, "names")} />
                        <LineInput label={`G-suite Email`} customStyle={{ container: "basis-1/2" }} placeholder={`Member ${mIndex + 1} G-Suite`} onChangeFn={event => updateMemberDetails(event, mIndex, "emails")} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-5">
                        <LineInput label={`Phone Number`} customStyle={{ container: "basis-1/2" }} placeholder={`Member ${mIndex + 1} Phone`} onChangeFn={event => updateMemberDetails(event, mIndex, "mobile_numbers")} />
                        <LineInput label={`Discord ID`} customStyle={{ container: "basis-1/2" }} placeholder={`Member ${mIndex + 1} Discord ID`} onChangeFn={event => updateMemberDetails(event, mIndex, "discord_ids")} />
                    </div> */}
                    <div className="flex flex-col md:flex-row gap-5 justify-between">
                        {/* <SelectInput label={`Program`} customStyle={{ container: "basis-1/5" }} options={programs} onChangeFn={event => updateMemberDetails(event, mIndex, "programs")} /> */}
                        <LineInput label={`Student ID`} customStyle={{ container: "basis-2/5" }} placeholder={`Member ${mIndex + 1} Student ID`} onChangeFn={event => updateMemberDetails(event, mIndex, "student_ids")} />
                        <LineInput label={`Credits Completed`} customStyle={{ container: "basis-2/5" }} placeholder={`Member ${mIndex + 1} Credits Completed`} onChangeFn={event => updateMemberDetails(event, mIndex, "credit_completed")} />
                    </div>
                </div>
            </SimpleCard>)}

            <PrimaryButton text={"Submit Thesis Registration Form"} />
        </div>
    </div>
}

export default ThesisRegistration;