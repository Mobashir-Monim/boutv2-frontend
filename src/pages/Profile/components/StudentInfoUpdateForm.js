import { LineInput, SelectInput } from "../../../components/FormInputs/LabeledInputs";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import { transitioner, borderColorStyles, linkStyles, textColorStyles } from "../../../utils/styles/styles";
import { useModal } from "../../../utils/contexts/ModalContext";
import { deepClone } from "../../../utils/functions/deepClone";
import { useEffect, useState } from "react";
import { useAuth } from "../../../utils/contexts/AuthContext";
import { setStudentInfoUpdateRequest } from "../../../db/remote/student";
import { useLoadingScreen } from "../../../utils/contexts/LoadingScreenContext";
import { isEmail } from "../../../utils/functions/inputValidators";

const StudentInfoUpdateForm = ({ updateRequest, setUpdateRequest, student, processSubmittedUpdateRequest }) => {
    const { user } = useAuth();
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const { showModal } = useModal();
    const [informationUpdate, setInformationUpdate] = useState(student);

    const displayDiscordInfo = () => {
        showModal(
            "How to find Discord ID",
            <div className="flex flex-col gap-16">
                <div>
                    <h4 className={`border-b-2 ${borderColorStyles.simple} text-[1.5rem] font-bold`}>What is the discord ID?</h4>
                    <p>Discord ID is a 18/19 digit number used to identify your account. It is not the same as your discord username. You can use one of the following methods to find your discord id:</p>
                </div>

                <div>
                    <h4 className={`border-b-2 ${borderColorStyles.simple} font-bold`}>First method</h4>
                    <p>Join the <a className={linkStyles.primary} target="_blank" href="https://discord.gg/SrfrSzQzpE">CSE Thesis Server</a>; The bot will send you your Discord User ID. Paste the ID in the following field.</p>
                </div>

                <div>
                    <h4 className={`border-b-2 ${borderColorStyles.simple} font-bold`}>Second method</h4>
                    <p>Send the message <span className={`font-bold italic ${textColorStyles.clickable} ${transitioner.simple} cursor-copy`} onClick={() => navigator.clipboard.writeText("!myid")}>!myid</span> to the bot to get your Discord User ID.</p>
                </div>

                <div>
                    <h4 className={`border-b-2 ${borderColorStyles.simple} font-bold`}>Third method</h4>
                    <p>Follow instructions in this <a className={linkStyles.primary} target="_blank" href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID">this article</a></p>
                </div>
            </div>
        );
    }

    useEffect(() => {
        const studentClone = deepClone(student);
        studentClone.name = user.displayName;
        studentClone.email = user.email;

        setInformationUpdate(studentClone);
    }, [student]);

    const validPersonalEmail = () => isEmail({ value: informationUpdate.personal_email })
        && !informationUpdate.personal_email.endsWith("@g.bracu.ac.bd")
        && !informationUpdate.personal_email.endsWith("@bracu.ac.bd");
    const validPhone = () => informationUpdate.phone.length === 11 && informationUpdate.phone.startsWith("01");
    const validStudentID = () =>
        informationUpdate.student_id.length === 8 &&
        (
            `${informationUpdate.student_id[3]}${informationUpdate.student_id[4]}` === "41"
            || `${informationUpdate.student_id[3]}${informationUpdate.student_id[4]}` === "01"
            || `${informationUpdate.student_id[3]}${informationUpdate.student_id[4]}` === "99"
        );
    const validDiscordID = () =>
        /^\d+$/.test(informationUpdate.discord_id)
        && (
            informationUpdate.discord_id.length === 18
            || informationUpdate.discord_id.length === 19
        );
    const validStudentProgram = () => {
        let flag = ["CS", "CSE"].includes(informationUpdate.program);

        if (`${informationUpdate.student_id[3]}${informationUpdate.student_id[4]}` === "41") {
            flag = flag && informationUpdate.program === "CS";
        } else if (`${informationUpdate.student_id[3]}${informationUpdate.student_id[4]}` === "01"
            || `${informationUpdate.student_id[3]}${informationUpdate.student_id[4]}` === "99") {
            flag = flag && informationUpdate.program === "CSE";
        } else {
            flag = false;
        }

        return flag;
    }
    const validateInfoDifference = () => {
        let flag = informationUpdate.student_id === student.student_id;
        flag &= informationUpdate.personal_email === student.personal_email;
        flag &= informationUpdate.discord_id === student.discord_id;
        flag &= informationUpdate.phone === student.phone;
        flag &= informationUpdate.program === student.program;

        return !flag;
    }

    const submitValidations = [
        { check: validStudentID, error: "Invalid Student ID" },
        { check: validPersonalEmail, error: "Invalid Personal Email Address" },
        { check: validStudentProgram, error: "Invalid Program" },
        { check: validPhone, error: "Invalid Phone Number" },
        { check: validDiscordID, error: <p>Invalid Discord ID, read more <span className={`${textColorStyles.clickable} cursor-pointer`} onClick={displayDiscordInfo}>here</span></p> },
        { check: validateInfoDifference, error: "No change in information, cannot request profile update" }
    ];

    const validateInformationUpdate = () => {
        let errors = [];

        for (let i in submitValidations) {
            if (!submitValidations[i].check())
                errors.push(submitValidations[i].error);
        }

        return errors;
    }

    const updateInformationUpdate = (event, target) => {
        const informationUpdateClone = deepClone(informationUpdate);

        if (target === "discord_id") {
            if (!/^\d+$/.test(informationUpdateClone[target]))
                informationUpdateClone[target] = "";

            if (/^\d+$/.test(event.target.value) || event.target.value === "")
                informationUpdateClone[target] = event.target.value.trim();
        } else if (target === "phone") {
            if (/^\d+$/.test(event.target.value) || event.target.value === "") {
                if (event.target.value.startsWith("+880")) {
                    informationUpdateClone.phone = event.target.value.replace("+880", "0");
                } else if (event.target.value.startsWith("880")) {
                    informationUpdateClone.phone = event.target.value.replace("880", "0");
                } else {
                    informationUpdateClone.phone = event.target.value;
                }
            }
        } else {
            informationUpdateClone[target] = event.target.value.trim();
        }


        setInformationUpdate(informationUpdateClone);
    }

    const submitUpdateRequest = async () => {
        showLoadingScreen("Processing request, please wait.")
        const errors = validateInformationUpdate();

        if (errors.length === 0) {
            const message = await setStudentInfoUpdateRequest(informationUpdate);
            processSubmittedUpdateRequest();
            showLoadingScreen(message);
        } else {
            showModal("Invalid Data in update request", <div className="flex flex-col gap-2">{errors.map((e, eIndex) => <div className="" key={eIndex}>{e}</div>)}</div>)
        }

        hideLoadingScreen();
    }

    return <div className={`flex flex-col gap-2.5 ${updateRequest.showRequestForm ? "h-[500px] md:h-[350px]" : "h-[0px]"} ${transitioner.simple} overflow-hidden`}>
        <div className="flex flex-col mx-auto justify-around">
            <div className={`flex flex-row justify-start rounded-3xl mx-auto`}>
                <span className={`material-icons-round w-[1rem] flex justify-center !h-[1rem] mr-2 text-[1rem] my-auto text-black/[0.5] dark:text-white`}>person</span>
                <span className={`my-auto`}>{user.displayName}</span>
            </div>
            <div className={`flex flex-row justify-start rounded-3xl mx-auto`}>
                <span className={`material-icons-round w-[1rem] flex justify-center !h-[1rem] mr-2 text-[1rem] my-auto text-black/[0.5] dark:text-white`}>email</span>
                <span className={`my-auto`}>{user.email}</span>
            </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2.5">
            <SelectInput
                options={["CS", "CSE"].includes(informationUpdate.program) ? ["CS", "CSE"] : ["Select Program", "CS", "CSE"]}
                label={<span className="flex flex-row justify-end gap-3">
                    <span className={`material-icons-round text-[0.9rem]`}>school</span>
                    <span className="my-auto">Program</span>
                </span>}
                customStyle={{ container: "basis-1/2" }}
                value={informationUpdate.program}
                onChangeFn={event => updateInformationUpdate(event, "program")}
            />
            <LineInput
                label={<span className="flex flex-row justify-end gap-3">
                    <span className={`material-icons-round text-[0.9rem]`}>badge</span>
                    <span className="my-auto">Student ID</span>
                </span>}
                customStyle={{ container: "basis-1/2" }}
                value={informationUpdate.student_id}
                onChangeFn={event => updateInformationUpdate(event, "student_id")}
            />
        </div>
        <div className="flex flex-col md:flex-row gap-2.5">
            <LineInput
                label={<span className="flex flex-row justify-end gap-3">
                    <span className={`material-icons-round text-[0.9rem]`}>phone</span>
                    <span className="my-auto">Phone Number</span>
                </span>}
                customStyle={{ container: "basis-1/2" }}
                min="11"
                max="11"
                value={informationUpdate.phone}
                onChangeFn={event => updateInformationUpdate(event, "phone")}
            />
            <div className="flex flex-row gap-1 basis-1/2">
                <LineInput
                    label={<span className="flex flex-row justify-end gap-3">
                        <span className={`material-icons-round text-[0.9rem]`}>discord</span>
                        <span className="my-auto">Discord ID</span>
                    </span>}
                    customStyle={{ container: "w-[100%]" }}
                    value={informationUpdate.discord_id}
                    onChangeFn={event => updateInformationUpdate(event, "discord_id")}
                />
                <span className={`material-icons-round text-[40px] cursor-pointer hover:text-blue-400 ${transitioner.simple}`} onClick={displayDiscordInfo}>help</span>
            </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2.5">
            <LineInput
                label={<span className="flex flex-row justify-end gap-3">
                    <span className={`material-icons-round text-[0.9rem]`}>alternate_email</span>
                    <span className="my-auto">Personal Email</span>
                </span>}
                customStyle={{ container: "basis-1/2" }}
                value={informationUpdate.personal_email}
                onChangeFn={event => updateInformationUpdate(event, "personal_email")}
            />
        </div>

        <div className="flex flex-row gap-5">
            <PrimaryButton text="Cancel" customStyle="basis-1/2" clickFunction={() => setUpdateRequest({ ...updateRequest, showRequestForm: false })} />
            <SecondaryButton text="Submit" customStyle="basis-1/2" clickFunction={submitUpdateRequest} />
        </div>
    </div>
}

export default StudentInfoUpdateForm;