import { useEffect, useState } from "react";
import { CheckboxInput, LineInput, SelectInput, TextInput } from "../../components/FormInputs/LabeledInputs";
import { buttonStyles, pageLayoutStyles, textColorStyles, transitioner } from "../../utils/styles/styles";
import { deepClone } from "../../utils/functions/deepClone";
import SimpleCard from "../../components/Card/SimpleCard";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { getFacultyMemberByInitials } from "../../db/remote/faculty";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";
import { getStudents } from "../../db/remote/student";
import { useAuth } from "../../utils/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../utils/contexts/ModalContext";
import { getThesisInstance, getThesisRegistrations, setThesisRegistration } from "../../db/remote/thesis";


const ThesisRegistration = () => {
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const { showModal } = useModal();
    const navigate = useNavigate();
    const { user } = useAuth();
    const thesisTypes = { thesis: "Thesis", project: "Project", internship: "Internship" };
    const memberDetails = { name: "", email: "", student_id: "", complete_profile: false, credits: null };
    const detailsMap = { name: "name", email: "official_email", phone: "phone", program: "program", discord_id: "discord_id" };
    const [application, setApplication] = useState({
        type: null,
        title: "",
        abstract: "",
        supervisor: "",
        members: 1,
        member_details: [{ name: "", email: "", student_id: "", complete_profile: false, credits: null }],
        supervisor_details: { name: "", email: "", initials: "" },
        accepted_policy: false,
        instance_id: null,
        application_ends: null,
    });

    const validThesisType = () => Object.keys(thesisTypes).includes(application.type);
    const validTheisTitle = () => application.title.replace(/\s+/g, " ").trim().split(" ").length >= 5;
    const validThesisAbstract = () => application.abstract.replace(/\s+/g, " ").trim().split(" ").length >= 50 && application.abstract.replace(/\s+/g, ' ').trim().split(" ").length <= 600;
    const validSupervisor = () => application.supervisor_details.name !== "INVALID INITIALS" && application.supervisor_details.name !== "";
    const validPolicyAcceptance = () => application.accepted_policy;
    const validCreditsCompleted = () => {
        let flag = true;

        application.member_details.forEach(member => {
            flag = flag && /^\d+$/.test(member.credits);
        });

        return flag;
    }
    const validMembers = () => {
        let flag = true;
        let temp = [];

        application.member_details.forEach(member => {
            if (!temp.includes(member.email)) {
                temp.push(member.email)
            } else {
                flag = false;
            }
        });

        return flag;
    }
    const validMemberDetails = () => {
        let flag = application.type === "internship" ? application.members === 1 : application.members <= 5;

        application.member_details.forEach(member => {
            flag = flag && member.complete_profile;
        });

        return flag;
    }



    const submitValidations = [
        { check: validThesisType, error: "Please select a valid thesis type" },
        { check: validTheisTitle, error: "Thesis title must be atleast 5 words long" },
        { check: validThesisAbstract, error: "Thesis abstract must be between 50 and 600 words" },
        { check: validSupervisor, error: "Please choose a valid supervisor" },
        { check: validMembers, error: "Duplicate members" },
        { check: validMemberDetails, error: "Incomplete profile information, please update your profiles and have it approved" },
        { check: validCreditsCompleted, error: "Please enter credits completed for each member" },
        { check: validPolicyAcceptance, error: "You and, your team members, must agree that you have read the thesis policy and have accepted it" },
    ]

    useEffect(() => {
        (async () => {
            showLoadingScreen("Loading your profile, please wait");
            const hasExistingReg = await fetchExistingReg();
            if (hasExistingReg) {
                await loadStudentProfile();
                await fetchThesisInstance();
            } else {
                navigate("/thesis");
                showModal("You have an existing registration", <p>Your already have an exisitng registration, if it has not been approved yet then please wait for approval or contact your supervisor</p>);
            }
            hideLoadingScreen();
        })();
    }, []);

    const fetchExistingReg = async () => {
        const reg = await getThesisRegistrations({ member_email: user.email });
        return reg[0][1] === null;
    }

    const loadStudentProfile = async () => {
        const student = (await getStudents({ official_emails: [user.email] }))[0];

        if (student[1]) {
            for (let m in detailsMap)
                if (student[0][detailsMap[m]] === "") {
                    showProfileIncompleteMessage();
                    return;
                }

            const applicationClone = deepClone(application);
            applicationClone.member_details[0].student_id = student[0].student_id;
            applicationClone.member_details[0].name = student[0].name;
            applicationClone.member_details[0].email = student[0].official_email;
            applicationClone.member_details[0].complete_profile = true;

            setApplication(applicationClone);
        } else {
            showProfileIncompleteMessage();
        }
    }

    const fetchThesisInstance = async () => {
        const thesisInstance = await getThesisInstance({});

        if (!thesisInstance[0][1]) {
            showModal("Thesis registration closed", <p>Thesis registration is no longer ongoing</p>)
            navigate("/dashboard");
        } else {
            const applicationClone = deepClone(application);
            applicationClone.instance_id = thesisInstance[0][1];
            applicationClone.application_ends = thesisInstance[0][0].end;
            setApplication(applicationClone);
        }
    }

    const showProfileIncompleteMessage = () => {
        showModal("Incomplete Profile", <p>Please complete your profile and have it approved before applying for thesis</p>)
        navigate("/profile");
    }

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
        application.member_details.splice(1);
    }

    const updateMembersCount = application => {
        application.members = parseInt(application.members);

        if (application.members < application.member_details.length) {
            application.member_details.splice(application.members);
        } else {
            while (application.members !== application.member_details.length)
                application.member_details.push(deepClone(memberDetails));
        }
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

    const updateMemberStudentID = async (event, index) => {
        if (/^\d+$/.test(event.target.value) && index > 0) {
            const applicationClone = deepClone(application);
            applicationClone.member_details[index].student_id = event.target.value;

            if (applicationClone.member_details[index].student_id.length === 8) {
                await fetchMemberInfo(index, applicationClone);
            } else {
                memberDetails.forEach(detail => {
                    if (detail !== "student_id")
                        applicationClone.member_details[index][detail] = "";
                });
            }

            setApplication(applicationClone);
        }
    }

    const fetchMemberInfo = async (index, application) => {
        const student = (await getStudents({ student_ids: [application.member_details[index].student_id] }))[0];

        if (student[1]) {
            let flag = true;
            for (let m in detailsMap)
                flag = flag && student[0][detailsMap[m]] !== "";

            application.member_details[index].name = student[0].name;
            application.member_details[index].email = student[0].official_email;
            application.member_details[index].complete_profile = flag;
        } else {
            application.member_details[index].name = "INVALID ID";
        }
    }

    const updateMemberCredits = (event, index) => {
        if (/^\d+$/.test(event.target.value) || event.target.value === "") {
            const applicationClone = deepClone(application);
            applicationClone.member_details[index].credits = event.target.value;
            setApplication(applicationClone);
        }
    }

    const submitApplication = async () => {
        showLoadingScreen("Please wait while we process your application");
        const errors = isSubmittable();

        if (errors.length) {
            showModal("Problems in application", <ul>{errors.map((e, eIndex) => <li key={eIndex}>{e}</li>)}</ul>)
        } else {
            const formattedApplication = formatApplication();
            await setThesisRegistration(formattedApplication);
            showModal("Application submitted", <p>Your application has been submitted, please wait for approval</p>);
            navigate("/thesis");
        }

        hideLoadingScreen();
    }

    const isSubmittable = () => {
        let errors = [];

        for (let i in submitValidations)
            if (!submitValidations[i].check())
                errors.push(submitValidations[i].error)

        return errors;
    }

    const updatePolicyAgreementAccept = () => {
        const applicationClone = deepClone(application);
        applicationClone.accepted_policy = !applicationClone.accepted_policy;
        setApplication(applicationClone);
    }

    const formatApplication = () => {
        let members = [];
        application.member_details.forEach(member => { members.push(member.email) });

        return {
            type: application.type,
            title: application.title,
            abstract: application.abstract,
            supervisor: [application.supervisor_details.email],
            member_emails: members,
        };
    }

    return <div className={`${pageLayoutStyles.scrollable}`}>
        <div className="w-[90%] lg:w-[80%] xl:w-[70%] flex flex-col gap-10 mx-auto">
            <SimpleCard title={"Thesis information"}>
                <div className="flex flex-col gap-5 p-5">
                    <div className="flex flex-col md:flex-row gap-5">
                        <SelectInput options={application.type ? thesisTypes : { "": "Select type", ...thesisTypes }} label="Thesis Type" customStyle={{ container: "w-[100%] md:w-[calc(50%-0.75rem)]" }} onChangeFn={event => updateApplication(event, "type")} value={application.type} />
                    </div>
                    <div className={`flex flex-col md:flex-row gap-5 ${application.type === "internship" || !application.type ? "h-[0px]" : "h-[60px]"} overflow-hidden ${transitioner.simple}`}>
                        <SelectInput options={[1, 2, 3, 4, 5]} customStyle={{ container: "w-[100%] md:w-[calc(50%-0.75rem)]" }} label="Number of members" onChangeFn={event => updateApplication(event, "members")} value={application.members} />
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
                        <LineInput label="Supervisor Initials" customStyle={{ container: "w-[100%] md:w-[calc(50%-0.75rem)]" }} onChangeFn={event => updateApplication(event, "supervisor")} placeholder="Supervisor Initials" max={3} min={3} value={application.supervisor} />
                        <div className="flex flex-col">
                            <a target="_blank" rel="noreferrer" href={"https://docs.google.com/spreadsheets/d/1u8v_o6g5QQLVH-O8PU9oTXaqmJQiBrv8LUGUpx9CC9o/edit#gid=1386339045"} className={`${buttonStyles.secondary}`}>View Faculty Initials</a>
                        </div>
                    </div>
                    <div className={`flex flex-col md:flex-row gap-5 ${application.supervisor_details.name !== "" ? "h-[140px] md:h-[60px]" : "h-[0px]"} overflow-hidden ${transitioner.simple}`}>
                        <LineInput label="Supervisor Name" customStyle={{ container: "w-[100%] md:w-[calc(50%-0.75rem)]" }} placeholder="Supervisor Name" readOnly={true} value={application.supervisor_details.name} />
                        <LineInput label="Supervisor Email" customStyle={{ container: "w-[100%] md:w-[calc(50%-0.75rem)]" }} placeholder="Supervisor Email" readOnly={true} value={application.supervisor_details.email} />
                    </div>
                </div>
            </SimpleCard>

            <SimpleCard title={`Your information (Member 1)`}>
                <div className="flex flex-col gap-5 p-5">
                    <div className="flex flex-col md:flex-row gap-5">
                        <LineInput label={`Your Student ID`} customStyle={{ container: "w-[100%] md:w-[calc(50%-0.75rem)]" }} placeholder={`Your ID`} min={8} max={8} readOnly={true} value={application.member_details[0].student_id} />
                        <LineInput label={`Credits Completed`} customStyle={{ container: "w-[60%] md:w-[20%] ml-auto md:mr-auto md:ml-0" }} placeholder={`Credits Completed`} onChangeFn={event => updateMemberCredits(event, 0)} value={application.member_details[0].credits} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-5">
                        <LineInput label={`Your Name`} customStyle={{ container: "w-[100%] md:w-[50%]" }} readOnly={true} value={application.member_details[0].name} />
                        <LineInput label={`Your Email`} customStyle={{ container: "w-[100%] md:w-[50%]" }} readOnly={true} value={application.member_details[0].email} />
                    </div>
                </div>
            </SimpleCard>

            {Array(application.members - 1 > 4 ? 4 : application.members - 1).fill(1).map((_, mIndex) => <SimpleCard title={`Member ${mIndex + 2} information`} key={`member-${mIndex}`}>
                <div className="flex flex-col gap-5 p-5">
                    <div className="flex flex-col md:flex-row gap-5">
                        <LineInput label={`Student ID`} customStyle={{ container: "w-[100%] md:w-[calc(50%-0.75rem)]" }} placeholder={`Member ${mIndex + 1} Student ID`} min={8} max={8} onChangeFn={event => updateMemberStudentID(event, mIndex + 1)} value={application.member_details[mIndex + 1].student_id} />
                        <LineInput label={`Credits Completed`} customStyle={{ container: "w-[60%] md:w-[20%] ml-auto md:mr-auto md:ml-0" }} placeholder={`Credits Completed`} onChangeFn={event => updateMemberCredits(event, mIndex + 1)} value={application.member_details[mIndex + 1].credits} />
                    </div>
                    <div className="flex flex-col md:flex-row gap-5">
                        <LineInput label={`Member Name`} customStyle={{ container: "w-[100%] md:w-[50%]" }} readOnly={true} value={application.member_details[mIndex + 1].name} />
                        <LineInput label={`Member Email`} customStyle={{ container: "w-[100%] md:w-[50%]" }} readOnly={true} value={application.member_details[mIndex + 1].email} />
                    </div>
                </div>
            </SimpleCard>)}

            <SimpleCard title={`Policy Agreement`}>
                <div className="flex flex-col gap-5 p-5">
                    <div className="flex flex-col gap-5">
                        <p>
                            Have you and your group members read the thesis policy as described
                            <a className={`${textColorStyles.clickable} mx-1 ${transitioner.simple}`} href="https://docs.google.com/document/d/1pAMjuQAxSEcLgkbvmx9qJGvK2BlPQhvXhgev8OeJTas/edit#heading=h.rc6keegzd4k2" rel="noreferrer" target="_blank">here</a>
                            and agree to it?
                        </p>
                        <CheckboxInput
                            options={["Yes, I/we all have read the policy and accepted it"]}
                            customStyle={{ input: "rounded-full" }}
                            values={application.accepted_policy ? ["Yes, I/we all have read the policy and accepted it"] : []}
                            onChangeFn={updatePolicyAgreementAccept}
                        />
                    </div>
                </div>
            </SimpleCard>

            <PrimaryButton text={"Submit Thesis Registration Form"} clickFunction={submitApplication} />
        </div>
    </div>
}

export default ThesisRegistration;