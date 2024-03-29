import { useEffect, useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SimpleCard from "../../../components/Card/SimpleCard";
import { bgColorStyles, borderColorStyles, pageLayoutStyles, transitioner, textColorStyles } from "../../../utils/styles/styles";
import { deleteStudentInfoUpdateRequest, getStudents, getStudentsInfoUpdateRequest } from "../../../db/remote/student";
import { useLoadingScreen } from "../../../utils/contexts/LoadingScreenContext";
import StudentInfoUpdateForm from "./StudentInfoUpdateForm";
import { useParams } from "react-router-dom";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import { useModal } from "../../../utils/contexts/ModalContext";
import { domainKey, staffDomainValue } from "../../../utils/contants";
import { getStoredUser } from "../../../db/local/user";
import Spinner from "../../../components/Utils/Spinner";

const StudentProfile = ({ user }) => {
    const params = useParams();
    const authUser = getStoredUser();
    const { showModal } = useModal();
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const [student, setStudent] = useState({});
    const [updateRequest, setUpdateRequest] = useState({
        pendingRequest: null,
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
        let email = user?.email;

        if (authUser[domainKey] === staffDomainValue && params.email)
            email = params.email

        const profile = await getStudents({ official_emails: [email] });

        if (profile[0][1])
            setStudent(profile[0][0]);
    }

    const loadProfileUpdateRequests = async () => {
        let email = user?.email;

        if (authUser[domainKey] === staffDomainValue && params.email)
            email = params.email

        const infoUpdateReq = await getStudentsInfoUpdateRequest(email);

        if (infoUpdateReq[0][1]) {
            setUpdateRequest({ ...updateRequest, pendingRequest: infoUpdateReq[0][1] });
        } else {
            setUpdateRequest({ ...updateRequest, pendingRequest: false });
        }
    }

    const processSubmittedUpdateRequest = () => setUpdateRequest({ showRequestForm: false, pendingRequest: true });

    const getInfoContainerClasses = width => `flex flex-row w-[100%] ${width === "sm" ? "md:w-[35%]" : "md:w-[50%]"} justify-start bg-[#171717]/[0.1] dark:bg-[#fff]/[0.3] rounded-3xl`;
    const getIconClasses = bgColor => `material-icons-round ${bgColorStyles[bgColor]} w-[44px] flex justify-center border-2 ${borderColorStyles.simple} rounded-full p-2 text-black/[0.5] dark:text-white`;

    const deleteExistingUpdateRequest = async () => {
        if (window.confirm("Are you sure you want to delete your current request?")) {
            await deleteStudentInfoUpdateRequest(updateRequest.pendingRequest);
            setUpdateRequest({ ...updateRequest, pendingRequest: false, showRequestForm: false });
        }
    }

    const getInfoUpdateForm = () => {
        if (user && Object.keys(student).length > 0) {
            if (updateRequest.pendingRequest === null)
                return <Spinner dimensions={"h-10 w-10"} />;

            if (updateRequest.pendingRequest) {
                return <div className="flex flex-col gap-5">
                    <h1 className="text-center">You have an existing update request, please visit your thesis supervisor/a full-time faculty member/DCO for approval.</h1>
                    <PrimaryButton text="Delete current request?" customStyle="w-[100%] md:w-[50%] mx-auto" clickFunction={deleteExistingUpdateRequest} />
                </div>;
            } else {
                return <>
                    <div className={`flex justify-center ${(updateRequest.showRequestForm) ? "h-[0px]" : "h-[40px]"} ${transitioner.simple} overflow-hidden`}>
                        <PrimaryButton text="Update Profile" customStyle="w-[100%] md:w-[50%]" clickFunction={() => setUpdateRequest({ ...updateRequest, showRequestForm: true })} />
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
    }

    const getAdvisingVerificationCode = () => {
        if (updateRequest.pendingRequest) {
            showModal("Profile Approval Pending", <div className="flex flex-col justify-center w-[100%]">
                <div className="mx-auto">
                    You have a pending profile update request.
                </div>
                <div className="mx-auto text-red-400 font-bold text-[1.1rem] text-center">
                    Please have an advisor approve your profile update request to generate your advising verification code.
                </div>
            </div>);
        } else if (
            student.name === ""
            || student.program === ""
            || student.official_email === ""
            || student.personal_email === ""
            || student.student_id === ""
            || student.phone === ""
        ) {
            showModal("Incomplete Profile", <div className="flex flex-col justify-center w-[100%]">
                <div className="mx-auto">
                    Your profile is incomplete.
                </div>
                <div className="mx-auto text-red-400 font-bold text-[1.1rem] text-center">
                    Please update your profile first to get your advising verification code.
                </div>
            </div>);
        } else {
            let advising_verification_code = student.advising_verification_code
            if (!advising_verification_code)
                advising_verification_code = `${student.student_id}-APRTCF`;

            showModal("Advising Verification Code", <div className="flex flex-col justify-center w-[100%]">
                <div className="mx-auto">
                    Your Advising Verification Code is:
                </div>
                <div className="mx-auto text-red-400 font-bold text-[1.1rem] text-center">
                    <SecondaryButton
                        customStyle={`flex justify-center cursor-copy ${transitioner.simple} font-['Source_Code_Pro']`}
                        clickFunction={() => navigator.clipboard.writeText(advising_verification_code)}
                        text={
                            <div className="flex flex-row gap-2">
                                <span className="material-icons-round mr-3">content_copy</span>
                                <span className="my-auto">{advising_verification_code}</span>
                            </div>
                        }
                    />
                </div>
            </div>);
        }
    }

    return <div className={`${pageLayoutStyles.scrollable}`}>
        <div className="flex flex-col md:flex-row gap-10">
            <SimpleCard title="Student Profile" customStyle={`w-[100%] mx-auto`}>
                <div className={`p-5 flex flex-col ${transitioner.simple} ${updateRequest.showRequestForm ? "gap-0" : "gap-5"}`}>
                    <div className={`flex flex-col md:flex-row md:justify-between gap-5 ${updateRequest.showRequestForm ? "h-[0px]" : "h-[545px] md:h-[270px]"} overflow-hidden ${transitioner.simple}`}>
                        <div className={`flex flex-col justify-center w-[50%] mx-auto md:w-[15%] ${user ? "" : "hidden"}`}>
                            <img src={user?.photoURL} className="rounded-full" alt="Student Image" referrerPolicy="no-referrer" />
                        </div>
                        <div className={`flex flex-col w-[100%] lg:w-[70%] gap-2.5 ${user ? "" : "mx-auto"}`}>
                            <div className="flex flex-col md:flex-row gap-2.5 md:gap-5 md:p-2 rounded-3xl">
                                <div className={getInfoContainerClasses("sm")}>
                                    <span className={getIconClasses("patternA")}>badge</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{student.student_id ?? "\u00A0"}</span>
                                </div>
                                <div className={getInfoContainerClasses("md")}>
                                    <span className={getIconClasses("patternB")}>person</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{user?.displayName ?? student.name}</span>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2.5 md:gap-5 md:p-2 rounded-3xl">
                                <div className={getInfoContainerClasses("sm")}>
                                    <span className={getIconClasses("patternC")}>school</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{student.program ?? "\u00A0"}</span>
                                </div>
                                <div className={getInfoContainerClasses("md")}>
                                    <span className={getIconClasses("patternA")}>email</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{user?.email ?? student.official_email}</span>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2.5 md:gap-5 md:p-2 rounded-3xl">
                                <div className={getInfoContainerClasses("sm")}>
                                    <span className={getIconClasses("patternB")}>phone</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{student.phone ?? "\u00A0"}</span>
                                </div>
                                <div className={getInfoContainerClasses("md")}>
                                    <span className={getIconClasses("patternC")}>discord</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{student.discord_id ?? "\u00A0"}</span>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-5 md:gap-5 md:p-2 rounded-3xl">
                                <div className={`w-[100%] md:w-[35%] flex flex-col justify-center bg-[#171717]/[0.1] dark:bg-[#fff]/[0.3] rounded-3xl`}>
                                    <SecondaryButton customStyle="text-[0.9rem] mx-auto w-[90%]" text={"Advising Verification Code"} clickFunction={getAdvisingVerificationCode} />
                                </div>
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