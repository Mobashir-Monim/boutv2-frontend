import { useEffect, useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SimpleCard from "../../../components/Card/SimpleCard";
import { bgColorStyles, borderColorStyles, pageLayoutStyles, transitioner } from "../../../utils/styles/styles";
import { useLoadingScreen } from "../../../utils/contexts/LoadingScreenContext";
import { getFacultyMember } from "../../../db/remote/faculty";
import { useAuth } from "../../../utils/contexts/AuthContext";
import Spinner from "../../../components/Utils/Spinner";
import { userHasRole } from "../../../db/remote/user";

const FacultyProfile = ({ user }) => {
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const [faculty, setFaculty] = useState({});
    const [studentProfileManager, setStudentProfileManager] = useState(null);
    const [facultyProfileManager, setFacultyProfileManager] = useState(null);

    useEffect(() => {
        (async () => {
            if (studentProfileManager === null || facultyProfileManager === null) {
                showLoadingScreen("Loading Profile...");
                loadProfile();
                await isStudentProfileManager();
                await isFacultyProfileManager();
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

    const getInfoContainerClasses = width => `flex flex-row w-[100%] ${width === "sm" ? "md:w-[35%]" : "md:w-[50%]"} justify-start bg-[#171717]/[0.1] dark:bg-[#fff]/[0.3] rounded-3xl`;
    const getIconClasses = bgColor => `material-icons-round ${bgColorStyles[bgColor]} w-[44px] flex justify-center border-2 ${borderColorStyles.simple} rounded-full p-2 text-black/[0.5] dark:text-white`;

    return <div className={`${pageLayoutStyles.scrollable}`}>
        <div className="flex flex-col gap-10">
            <SimpleCard title="Faculty Profile" customStyle="w-[100%] h-auto mx-auto">
                <div className="p-5 flex flex-col gap-5">
                    <div className="flex flex-col md:flex-row md:justify-between gap-5">
                        <div className="flex flex-col justify-center w-[50%] mx-auto md:w-[15%]">
                            <img src={user.photoURL} className="rounded-full" alt="Student Image" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex flex-col w-[100%] lg:w-[70%] gap-2.5">
                            <div className="flex flex-col md:flex-row gap-2.5 md:gap-5 md:p-2 rounded-3xl">
                                <div className={getInfoContainerClasses("sm")}>
                                    <span className={getIconClasses("patternA")}>badge</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{faculty.pin ? faculty.pin : "\u00A0"}</span>
                                </div>
                                <div className={getInfoContainerClasses("md")}>
                                    <span className={getIconClasses("patternB")}>person</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{user.displayName}</span>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2.5 md:gap-5 md:p-2 rounded-3xl">
                                <div className={getInfoContainerClasses("sm")}>
                                    <span className={getIconClasses("patternC")}>school</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{faculty.designation ? faculty.designation : "\u00A0"}</span>
                                </div>
                                <div className={getInfoContainerClasses("md")}>
                                    <span className={getIconClasses("patternA")}>email</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{user.email}</span>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2.5 md:gap-5 md:p-2 rounded-3xl">
                                <div className={getInfoContainerClasses("sm")}>
                                    <span className={getIconClasses("patternB")}>phone</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{faculty.phone ? faculty.phone : "\u00A0"}</span>
                                </div>
                                <div className={getInfoContainerClasses("md")}>
                                    <span className={getIconClasses("patternC")}>discord</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{faculty.discord_id ? faculty.discord_id : "\u00A0"}</span>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-5 md:gap-5 md:p-2 rounded-3xl">
                                <div className={getInfoContainerClasses("sm")}>
                                    <span className={getIconClasses("patternA")}>account_circle</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{faculty.status ? faculty.status : "\u00A0"}</span>
                                </div>
                                <div className={getInfoContainerClasses("md")}>
                                    <span className={getIconClasses("patternB")}>alternate_email</span>
                                    <span className={`px-3 my-auto text-[0.9rem] w-[100%]`}>{faculty.personal_email ? faculty.personal_email : "\u00A0"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
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