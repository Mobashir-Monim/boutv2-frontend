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

const StudentInfoUpdateForm = ({ updateRequest, setUpdateRequest, student, processSubmittedUpdateRequest }) => {
    const { user } = useAuth();
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const { showModal } = useModal();
    const [informationUpdate, setInformationUpdate] = useState(student);

    useEffect(() => {
        const studentClone = deepClone(student);
        studentClone.name = user.displayName;
        studentClone.email = user.email;

        setInformationUpdate(studentClone);
    }, [student])

    const updateInformationUpdate = (event, target) => {
        const informationUpdateClone = deepClone(informationUpdate);

        if (target === "discord_id") {

        } else {
            informationUpdateClone[target] = event.target.value;
        }


        setInformationUpdate(informationUpdateClone);
    }

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

    const submitUpdateRequest = async () => {
        showLoadingScreen("Processing request, please wait.")

        if (/^\d+$/.test(informationUpdate.discord_id) && (informationUpdate.discord_id.length === 18 || informationUpdate.discord_id.length === 19)) {
            const message = await setStudentInfoUpdateRequest(informationUpdate);
            processSubmittedUpdateRequest();
            showLoadingScreen(message);
        } else {
            showLoadingScreen("INVALID DISCORD ID")
            displayDiscordInfo()
        }

        setTimeout(() => { hideLoadingScreen(); }, 5000);
    }

    return <div className={`flex flex-col gap-2.5 ${updateRequest.showRequestForm ? "h-[460px] md:h-[260px] mt-5" : "h-[0px] mt-0"} ${transitioner.simple} overflow-hidden`}>
        <div className="flex flex-col md:flex-row gap-2.5">
            <SelectInput
                options={["CS", "CSE"]}
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

        <div className="flex flex-col md:flex-row gap-5">
            <PrimaryButton text="Cancel" customStyle="basis-1/2" clickFunction={() => setUpdateRequest({ ...updateRequest, showRequestForm: false })} />
            <SecondaryButton text="Submit Update Request" customStyle="basis-1/2" clickFunction={submitUpdateRequest} />
        </div>
    </div>
}

export default StudentInfoUpdateForm;