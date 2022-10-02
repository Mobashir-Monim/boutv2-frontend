import { useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SimpleCard from "../../../components/Card/SimpleCard";
import { LineInput, SelectInput } from "../../../components/FormInputs/LabeledInputs";
import { deepClone } from "../../../utils/functions/deepClone";
import { borderColorStyles, linkStyles, pageLayoutStyles, textColorStyles, transitioner } from "../../../utils/styles/styles";
import { useModal } from "../../../utils/contexts/ModalContext";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";


const StudentProfile = ({ user }) => {
    const { showModal } = useModal();
    const [student, setStudent] = useState(JSON.parse(localStorage.getItem("student")));
    const [informationUpdate, setInformationUpdate] = useState(JSON.parse(localStorage.getItem("student")));
    const [updateRequest, setUpdateRequest] = useState(false);

    const updateInformationUpdate = (event, target) => {
        const informationUpdateClone = deepClone(informationUpdate);
        informationUpdateClone[target] = event.target.value;

        setInformationUpdate(informationUpdateClone);
    }

    const displayDiscordInfo = () => {
        showModal(
            "How to find Discord ID",
            <div className="flex flex-col gap-16">
                <div>
                    <h4 className={`border-b-2 ${borderColorStyles.simple}`}>First method</h4>
                    <p>Join the <a className={linkStyles.primary} href="https://discord.gg/SrfrSzQzpE">CSE Thesis Server</a>; The bot will send you your Discord User ID. Paste the ID in the following field.</p>
                </div>

                <div>
                    <h4 className={`border-b-2 ${borderColorStyles.simple}`}>Second method</h4>
                    <p>Send the message <span className={`font-bold italic ${textColorStyles.clickable} ${transitioner.simple} cursor-copy`} onClick={() => navigator.clipboard.writeText("!myid")}>!myid</span> to the bot to get your Discord User ID.</p>
                </div>

                <div>
                    <h4 className={`border-b-2 ${borderColorStyles.simple}`}>Third method</h4>
                    <p>Follow instructions in this <a className={linkStyles.primary} href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID">this article</a></p>
                </div>
            </div>
        );
    }

    return <div className={`${pageLayoutStyles.scrollable}`}>
        <div className="flex flex-col md:flex-row gap-10">
            <SimpleCard title="Student Profile" customStyle="w-[100%] h-auto lg:w-[70%] mx-auto">
                <div className="mt-5 flex flex-col gap-5">
                    <div className="flex flex-col md:flex-row gap-5 md:gap-10 md:bg-[#171717]/[0.1] md:dark:bg-[#fff]/[0.3] md:p-2 rounded-3xl">
                        <div className={`flex flex-row  md:w-[35%] justify-start bg-[#171717]/[0.1] dark:bg-[#fff]/[0.3] p-2 rounded-3xl md:bg-[#fff]/[0] md:p-0`}>
                            <span className={`material-icons-round border-r-[1px] ${borderColorStyles.secondary} px-3`}>badge</span>
                            <span className={`px-3 border-l-[1px] ${borderColorStyles.secondary} my-auto`}>{student.student_id}</span>
                        </div>
                        <div className={`flex flex-row  md:w-[50%] justify-start bg-[#171717]/[0.1] dark:bg-[#fff]/[0.3] p-2 rounded-3xl md:bg-[#fff]/[0] md:p-0`}>
                            <span className={`material-icons-round border-r-[1px] ${borderColorStyles.secondary} px-3`}>person</span>
                            <span className={`px-3 border-l-[1px] ${borderColorStyles.secondary} my-auto`}>{user.displayName}</span>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-5 md:gap-10 md:bg-[#171717]/[0.1] md:dark:bg-[#fff]/[0.3] md:p-2 rounded-3xl">
                        <div className={`flex flex-row  md:w-[35%] justify-start bg-[#171717]/[0.1] dark:bg-[#fff]/[0.3] p-2 rounded-3xl md:bg-[#fff]/[0] md:p-0`}>
                            <span className={`material-icons-round border-r-[1px] ${borderColorStyles.secondary} px-3`}>school</span>
                            <span className={`px-3 border-l-[1px] ${borderColorStyles.secondary} my-auto`}>{student.program}</span>
                        </div>
                        <div className={`flex flex-row  md:w-[50%] justify-start bg-[#171717]/[0.1] dark:bg-[#fff]/[0.3] p-2 rounded-3xl md:bg-[#fff]/[0] md:p-0`}>
                            <span className={`material-icons-round border-r-[1px] ${borderColorStyles.secondary} px-3`}>email</span>
                            <span className={`px-3 border-l-[1px] ${borderColorStyles.secondary} my-auto`}>{user.email}</span>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-5 md:gap-10 md:bg-[#171717]/[0.1] md:dark:bg-[#fff]/[0.3] md:p-2 rounded-3xl">
                        <div className={`flex flex-row  md:w-[35%] justify-start bg-[#171717]/[0.1] dark:bg-[#fff]/[0.3] p-2 rounded-3xl md:bg-[#fff]/[0] md:p-0`}>
                            <span className={`material-icons-round border-r-[1px] ${borderColorStyles.secondary} px-3`}>phone</span>
                            <span className={`px-3 border-l-[1px] ${borderColorStyles.secondary} my-auto`}>{student.phone}</span>
                        </div>
                        <div className={`flex flex-row  md:w-[50%] justify-start bg-[#171717]/[0.1] dark:bg-[#fff]/[0.3] p-2 rounded-3xl md:bg-[#fff]/[0] md:p-0`}>
                            <span className={`material-icons-round border-r-[2px] ${borderColorStyles.secondary} px-3`}>discord</span>
                            <span className={`px-3 border-l-[1px] ${borderColorStyles.secondary} my-auto`}>{student.discord_id}</span>
                        </div>
                    </div>
                    <div className={`flex justify-center ${updateRequest ? "h-[0px]" : "h-[40px]"} ${transitioner.simple} overflow-hidden`}>
                        <PrimaryButton text="Request Information Update" customStyle="w-[100%] md:w-[50%]" clickFunction={() => setUpdateRequest(true)} />
                    </div>
                    <div className={`flex flex-col gap-5 ${updateRequest ? "h-[387px] md:h-[185px] mt-5" : "h-[0px] mt-0"} ${transitioner.simple} overflow-hidden`}>
                        <div className="flex flex-col md:flex-row gap-5">
                            <SelectInput
                                options={["CS", "CSE"]}
                                label={<span className="flex flex-row justify-end gap-3">
                                    <span className={`material-icons-round text-[0.9rem]`}>school</span>
                                    <span className="my-auto">Program</span>
                                </span>}
                                customStyle={{ input: "py-1 text-[0.9rem]", container: "basis-1/2" }}
                                value={informationUpdate.program}
                                onChangeFn={event => updateInformationUpdate(event, "program")}
                            />
                            <LineInput
                                label={<span className="flex flex-row justify-end gap-3">
                                    <span className={`material-icons-round text-[0.9rem]`}>badge</span>
                                    <span className="my-auto">Student ID</span>
                                </span>}
                                customStyle={{ input: "py-1 text-[0.9rem]", container: "basis-1/2" }}
                                value={informationUpdate.student_id}
                                onChangeFn={event => updateInformationUpdate(event, "student_id")}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                            <LineInput
                                label={<span className="flex flex-row justify-end gap-3">
                                    <span className={`material-icons-round text-[0.9rem]`}>phone</span>
                                    <span className="my-auto">Phone Number</span>
                                </span>}
                                customStyle={{ input: "py-1 text-[0.9rem]", container: "basis-1/2" }}
                                value={informationUpdate.phone}
                                onChangeFn={event => updateInformationUpdate(event, "phone")}
                            />
                            <div className="flex flex-row gap-1 basis-1/2">
                                {/* <div className="basis-3"> */}
                                <LineInput
                                    label={<span className="flex flex-row justify-end gap-3">
                                        <span className={`material-icons-round text-[0.9rem]`}>discord</span>
                                        <span className="my-auto">Discord ID</span>
                                    </span>}
                                    customStyle={{ input: "py-1 text-[0.9rem]", container: "w-[100%]" }}
                                    value={informationUpdate.discord_id}
                                    onChangeFn={event => updateInformationUpdate(event, "discord_id")}
                                />
                                {/* </div> */}
                                <span className={`material-icons-round text-[32px] cursor-pointer hover:text-blue-400 ${transitioner.simple}`} onClick={displayDiscordInfo}>help</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-5">
                            <PrimaryButton text="Cancel" customStyle="basis-1/2" clickFunction={() => setUpdateRequest(false)} />
                            <SecondaryButton text="Submit Update Request" customStyle="basis-1/2" />
                        </div>
                    </div>
                </div>
            </SimpleCard>
        </div>
    </div>
}

export default StudentProfile;