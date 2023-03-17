import { useEffect, useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SimpleCard from "../../../components/Card/SimpleCard";
import { bgColorStyles, borderColorStyles, pageLayoutStyles, transitioner } from "../../../utils/styles/styles";
import { useLoadingScreen } from "../../../utils/contexts/LoadingScreenContext";
import { deleteFacultyInfoUpdateRequest, getFacultyInfoUpdateRequest, getFacultyMember } from "../../../db/remote/faculty";
import { useAuth } from "../../../utils/contexts/AuthContext";
import Spinner from "../../../components/Utils/Spinner";
import { userHasRole } from "../../../db/remote/user";
import FacultyInfoUpdateForm from "../FacultyInfoUpdateForm";
import { useParams } from "react-router-dom";
import { getStoredUser } from "../../../db/local/user";
import { domainKey, staffDomainValue } from "../../../utils/contants";

const FacultyProfile = ({ user }) => {
    const params = useParams();
    const authUser = getStoredUser();
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const [faculty, setFaculty] = useState({});
    const [studentProfileManager, setStudentProfileManager] = useState(null);
    const [facultyProfileManager, setFacultyProfileManager] = useState(null);
    const [updateRequest, setUpdateRequest] = useState({
        pendingRequest: false,
        showRequestForm: false,
    });

    const infoPoints = [
        {
            id: "pin",
            icon: "badge",
            desc: "Pin",
            width: "sm",
        },
        {
            id: "name",
            icon: "person",
            desc: "Name",
            default: user.displayName,
            width: "md",
        },
        {
            id: "designation",
            icon: "school",
            desc: "Designation",
            width: "sm",
        },
        {
            id: "email",
            icon: "email",
            desc: "Email",
            default: user.email,
            width: "md",
        },

        {
            id: "degree",
            icon: "workspace_premium",
            desc: "Degree",
            width: "sm",
        },
        {
            id: "discord_id",
            icon: "discord",
            desc: "Discord ID",
            width: "md",
        },
        {
            id: "status",
            icon: "account_circle",
            desc: "Status",
            width: "sm",
        },
        {
            id: "personal_email",
            icon: "alternate_email",
            desc: "Personal Email",
            width: "md",
        },
        {
            id: "usis_initials",
            icon: "abc",
            desc: "USIS Initials",
            width: "sm",
        },
        {
            id: "room",
            icon: "apartment",
            desc: "Room",
            width: "md",
        },
        {
            id: "initials",
            icon: "abc",
            desc: "Departmental Initials",
            width: "sm",
        },
        {
            id: "phone",
            icon: "phone",
            desc: "Phone",
            width: "md",
        },
    ];

    useEffect(() => {
        (async () => {
            if (studentProfileManager === null || facultyProfileManager === null) {
                showLoadingScreen("Loading Profile...");
                loadProfile();
                await isStudentProfileManager();
                await isFacultyProfileManager();
                loadProfileUpdateRequests();
                hideLoadingScreen();
            }
        })();
    }, []);

    const loadProfile = async () => {
        const profile = await getFacultyMember({ email: user.email });

        if (profile[0][1])
            setFaculty(profile[0][0]);
    }

    const isStudentProfileManager = async () => {
        const canManage = await userHasRole(user.email, "student-profile-manager");
        setStudentProfileManager(canManage);
    }

    const isFacultyProfileManager = async () => {
        const canManage = await userHasRole(user.email, "faculty-profile-manager");
        setFacultyProfileManager(canManage);
    }

    const loadProfileUpdateRequests = async () => {
        let email = user?.email;

        if (authUser[domainKey] === staffDomainValue && params.email)
            email = params.email

        const infoUpdateReq = await getFacultyInfoUpdateRequest(email);

        if (infoUpdateReq[0][1]) {
            setUpdateRequest({ ...updateRequest, pendingRequest: infoUpdateReq[0][1] });
        } else {
            setUpdateRequest({ ...updateRequest, pendingRequest: false });
        }
    }

    const deleteExistingUpdateRequest = async () => {
        if (window.confirm("Are you sure you want to delete your current request?")) {
            try {
                await deleteFacultyInfoUpdateRequest(updateRequest.pendingRequest);
                setUpdateRequest({ ...updateRequest, pendingRequest: false, showRequestForm: false });
            } catch (error) {
                console.error(error);
            }
        }
    }

    const processSubmittedUpdateRequest = () => setUpdateRequest({ showRequestForm: false, pendingRequest: true });

    const getInfoUpdateForm = () => {
        if (user) {
            if (updateRequest.pendingRequest === null)
                return <Spinner dimensions={"h-10 w-10 mx-auto"} />;

            if (updateRequest.pendingRequest) {
                return <div className="flex flex-col gap-5">
                    <h1 className="text-center">You have an existing update request, please request the DCO for approval.</h1>
                    <PrimaryButton text="Delete current request?" customStyle="w-[100%] md:w-[50%] mx-auto" clickFunction={deleteExistingUpdateRequest} />
                </div>;
            } else {
                return <>
                    <div className={`flex justify-center ${(updateRequest.showRequestForm) ? "h-[0px]" : "h-[40px]"} ${transitioner.simple} overflow-hidden`}>
                        <PrimaryButton text="Update Info" customStyle="w-[100%] md:w-[50%]" clickFunction={() => setUpdateRequest({ ...updateRequest, showRequestForm: true })} />
                    </div>
                    <FacultyInfoUpdateForm
                        updateRequest={updateRequest}
                        setUpdateRequest={setUpdateRequest}
                        faculty={faculty}
                        processSubmittedUpdateRequest={processSubmittedUpdateRequest}
                    />
                </>;
            }
        }
    }

    const getStudentManagerButton = () => {
        if (studentProfileManager === null) {
            return <Spinner dimensions={"h-10 w-10"} />;
        } else if (studentProfileManager) {
            return <PrimaryButton text="Student Profile Management" type="link" link={"/profile/manage/students"} />
        } else {
            return <></>
        }
    }

    const getFacultyManagerButton = () => {
        if (facultyProfileManager === null) {
            return <Spinner dimensions={"h-10 w-10"} />;
        } else if (facultyProfileManager) {
            return <PrimaryButton text="Faculty Profile Management" type="link" link={"/profile/manage/faculty"} />
        } else {
            return <></>
        }
    }

    const infoContainerClasses = `flex flex-col gap-1 w-[100%] w-[100%] justify-start`;
    const infoClasses = `flex flex-row gap-2 my-auto text-[0.8rem] w-[100%] rounded-r-[-10px]`
    const descriptionClasses = `flex flex-row rounded-r-full rounded-bl-full p-1 w-[100%] -mt-[1px] ml-auto text-black/[0.5] dark:text-white px-5 bg-[#171717]/[0.1] dark:bg-[#fff]/[0.3]`;

    return <div className={`${pageLayoutStyles.scrollable}`}>
        <div className="flex flex-col gap-10">
            <SimpleCard title="Faculty Profile" customStyle="w-[100%] h-auto mx-auto">
                <div className="p-5 flex flex-col gap-5">
                    <div className={`flex flex-col md:flex-row md:justify-between gap-5 ${(updateRequest.showRequestForm) ? "h-[0px]" : "md:h-[430px]"} ${transitioner.simple} overflow-hidden`}>
                        <div className="flex flex-col justify-center mx-auto w-[50%] md:w-[calc(15%-1.25rem/2)]">
                            <img src={user.photoURL} className="rounded-full" alt="Student Image" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex flex-col lg:flex-row gap-5 w-[100%] md:w-[calc(75%-1.25rem/2)]">
                            <div className="flex flex-col gap-5 w-[100%] md:w-[35%] cursor-default">
                                {infoPoints.filter(point => point.width === "sm").map((point, pointIndex) =>
                                    <div className={infoContainerClasses} key={pointIndex}>
                                        <span className={infoClasses}>
                                            <span className="material-icons-round text-[0.9rem] my-auto">{point.icon}</span>
                                            <span className="my-auto">{point.desc}</span>
                                        </span>
                                        <span className={descriptionClasses}>
                                            {faculty[point.id] ? faculty[point.id] : point.default ?? "\u00A0"}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-5 w-[100%] md:w-[50%] cursor-default">
                                {infoPoints.filter(point => point.width === "md").map((point, pointIndex) =>
                                    <div className={infoContainerClasses} key={pointIndex}>
                                        <span className={infoClasses}>
                                            <span className="material-icons-round text-[0.9rem] my-auto">{point.icon}</span>
                                            <span className="my-auto">{point.desc}</span>
                                        </span>
                                        <span className={descriptionClasses}>
                                            {faculty[point.id] ? faculty[point.id] : point.default ?? "\u00A0"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {getInfoUpdateForm()}
                </div>
            </SimpleCard>

            <div className="flex flex-row flex-wrap justify-center gap-5">
                {getStudentManagerButton()}
                {getFacultyManagerButton()}
            </div>
        </div>
    </div>
}

export default FacultyProfile;