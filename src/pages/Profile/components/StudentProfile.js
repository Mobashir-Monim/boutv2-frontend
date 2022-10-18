import { useEffect, useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SimpleCard from "../../../components/Card/SimpleCard";
import { bgColorStyles, borderColorStyles, pageLayoutStyles, transitioner } from "../../../utils/styles/styles";
import { deleteStudentInfoUpdateRequest, getStudents, getStudentsInfoUpdateRequest } from "../../../db/remote/student";
import { useLoadingScreen } from "../../../utils/contexts/LoadingScreenContext";
import StudentInfoUpdateForm from "./StudentInfoUpdateForm";


const StudentProfile = ({ user }) => {
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const [student, setStudent] = useState({});
    const [updateRequest, setUpdateRequest] = useState({
        pendingRequest: true,
        showRequestForm: false,
    });

    useEffect(() => {
        (async () => {
            showLoadingScreen("Loading Profile...");
            loadProfile();
            loadProfileUpdateRequests();
            hideLoadingScreen();
        })();
    }, []);

    const loadProfile = async () => {
        const profile = await getStudents({ official_emails: [user.email] });

        if (profile[0][1])
            setStudent(profile[0][0]);
    }

    const loadProfileUpdateRequests = async () => {
        const infoUpdateReq = await getStudentsInfoUpdateRequest(user.email);

        if (infoUpdateReq[0][1]) {
            setUpdateRequest({ ...updateRequest, pendingRequest: infoUpdateReq[0][1] });
        } else {
            setUpdateRequest({ ...updateRequest, pendingRequest: false });
        }
    }

    const processSubmittedUpdateRequest = () => setUpdateRequest({ ...updateRequest, pendingRequest: true });

    const getInfoContainerClasses = width => `flex flex-row w-[100%] ${width === "sm" ? "md:w-[35%]" : "md:w-[50%]"} justify-start bg-[#171717]/[0.1] dark:bg-[#fff]/[0.3] rounded-3xl`;
    const getIconClasses = bgColor => `material-icons-round ${bgColorStyles[bgColor]} w-[44px] flex justify-center border-2 ${borderColorStyles.simple} rounded-full p-2 text-black/[0.5] dark:text-white`;

    const deleteExistingUpdateRequest = async () => {
        if (window.confirm("Are you sure you want to delete your current request?")) {
            await deleteStudentInfoUpdateRequest(updateRequest.pendingRequest);
            setUpdateRequest({ ...updateRequest, pendingRequest: false, showRequestForm: false });
        }
    }

    const getInfoUpdateForm = () => {
        if (updateRequest.pendingRequest) {
            return <div className="flex flex-col gap-5">
                <h1 className="text-center">You have an existing update request, please visit your thesis supervisor/a full-time faculty member/DCO for approval.</h1>
                <PrimaryButton text="Delete current request?" customStyle="w-[100%] md:w-[50%] mx-auto" clickFunction={deleteExistingUpdateRequest} />
            </div>;
        } else {
            return <>
                <div className={`flex justify-center ${(updateRequest.showRequestForm) ? "h-[0px]" : "h-[40px]"} ${transitioner.simple} overflow-hidden`}>
                    <PrimaryButton text="Need to update your info?" customStyle="w-[100%] md:w-[50%]" clickFunction={() => setUpdateRequest({ ...updateRequest, showRequestForm: true })} />
                </div>
                <StudentInfoUpdateForm
                    updateRequest={updateRequest}
                    setUpdateRequest={setUpdateRequest}
                    student={student}
                    processSubmittedUpdateRequest={processSubmittedUpdateRequest}
                />
            </>;
        }
    }

    return <div className={`${pageLayoutStyles.scrollable}`}>
        <div className="flex flex-col md:flex-row gap-10">
            <SimpleCard title="Student Profile" customStyle="w-[100%] h-auto mx-auto">
                <div className="p-5 flex flex-col gap-5">
                    <div className="flex flex-col md:flex-row md:justify-between gap-5">
                        <div className="flex flex-col justify-center w-[50%] mx-auto md:w-[15%]">
                            <img src={user.photoURL} className="rounded-full" alt="Student Image" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex flex-col w-[100%] lg:w-[70%] gap-2.5">
                            <div className="flex flex-col md:flex-row gap-2.5 md:gap-5 md:p-2 rounded-3xl">
                                <div className={getInfoContainerClasses("sm")}>
                                    <span className={getIconClasses("patternA")}>badge</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{student.student_id ? student.student_id : "\u00A0"}</span>
                                </div>
                                <div className={getInfoContainerClasses("md")}>
                                    <span className={getIconClasses("patternB")}>person</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{user.displayName}</span>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2.5 md:gap-5 md:p-2 rounded-3xl">
                                <div className={getInfoContainerClasses("sm")}>
                                    <span className={getIconClasses("patternC")}>school</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{student.program ? student.program : "\u00A0"}</span>
                                </div>
                                <div className={getInfoContainerClasses("md")}>
                                    <span className={getIconClasses("patternA")}>email</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{user.email}</span>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2.5 md:gap-5 md:p-2 rounded-3xl">
                                <div className={getInfoContainerClasses("sm")}>
                                    <span className={getIconClasses("patternB")}>phone</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{student.phone ? student.phone : "\u00A0"}</span>
                                </div>
                                <div className={getInfoContainerClasses("md")}>
                                    <span className={getIconClasses("patternC")}>discord</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{student.discord_id ? student.discord_id : "\u00A0"}</span>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-5 md:gap-5 md:p-2 rounded-3xl">
                                <div className={getInfoContainerClasses("md")}>
                                    <span className={getIconClasses("patternA")}>alternate_email</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{student.personal_email ? student.personal_email : "\u00A0"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {getInfoUpdateForm()}
                </div>
            </SimpleCard>
        </div>
    </div>
}

export default StudentProfile;