import { useEffect, useState } from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import BaseButton from "../../components/Buttons/BaseButton";
import SimpleCard from "../../components/Card/SimpleCard";
import { LineInput } from "../../components/FormInputs/LabeledInputs";
import { getStudents, getStudentsInfoUpdateRequest, getStudentsInfoUpdateRequests, setStudent, deleteStudentInfoUpdateRequest } from "../../db/remote/student";
import { deepClone } from "../../utils/functions/deepClone";
import { borderColorStyles, pageLayoutStyles, transitioner } from "../../utils/styles/styles";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";

const StudentProfileManager = () => {
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const [profileManager, setProfileManager] = useState({
        queue: [],
        current: null,
        queueLoading: true,
        contentLoading: false,
        statusUpdating: false,
        searchAddress: "",
        studentContent: [{}, null],
    });

    const updateIterables = [
        { icon: "badge", key: "student_id" },
        { icon: "school", key: "program" },
        { icon: "phone", key: "phone" },
        { icon: "alternate_email", key: "personal_email" },
        { icon: "discord", key: "discord_id" },
    ]

    const emptyInbox = <div className="flex flex-col mx-auto h-[30vh] md:h-[50vh] justify-center">
        <span className="material-icons-round text-[5rem] mx-auto text-[#000]/[0.5] dark:text-white/[0.5]">inbox</span>
        <h4 className="text-[1.5rem] text-center">Nothing Found</h4>
    </div>

    const loadingList = <div className="flex flex-col mx-auto h-[30vh] md:h-[50vh] justify-center">
        <svg className="spinner h-10 w-10 md:h-20 md:w-20 stroke-[#000]/[0.5] dark:stroke-[#fff]/[0.5] mx-auto" viewBox="0 0 50 50">
            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
        </svg>
        <h4 className="text-[1.5rem] text-center">Loading, please wait</h4>
    </div>

    const queueList = profileManager.queue.map((req, reqIndex) => <SimpleCard key={`req-${req[1]}`} showTitle={false} customStyle={`rounded-2xl !bg-blue-600/[0.4] hover:!bg-rose-600/[0.7] ${transitioner.simple} p-0 cursor-pointer border-0`}>
        <div className="flex flex-col p-2" onClick={() => fetchUpdateRequestInfo(reqIndex)}>
            <div className={`flex flex-row w-[100%] justify-start rounded-3xl`}>
                <span className={`material-icons-round w-[2.5rem] flex justify-center !h-[2.5rem] p-2 text-[1.5rem] text-black/[0.5] dark:text-white`}>email</span>
                <span className={`my-auto text-[0.9rem] w-[100%]`}>{req[0].email}</span>
            </div>
        </div>
    </SimpleCard>);

    useEffect(() => {
        (async () => {
            if (profileManager.queue.length === 0) {
                setProfileManager({ ...profileManager, queueLoading: true });
                const profileManagerClone = deepClone(profileManager);
                const queue = await getStudentsInfoUpdateRequests();

                if (queue[0][1])
                    profileManagerClone.queue = queue;

                profileManagerClone.queueLoading = false;
                setProfileManager(profileManagerClone);
            }
        })();
    }, [profileManager.queue])

    const getListContent = () => {
        if (profileManager.queueLoading) {
            return loadingList;
        } else if (profileManager.queue.length) {
            return queueList;
        } else {
            return emptyInbox;
        }
    }

    const fetchUpdateRequestInfo = async current => {
        setProfileManager({ ...profileManager, contentLoading: true });
        const profileManagerClone = deepClone(profileManager);
        let student = await getStudents({ official_emails: [profileManagerClone.queue[current][0].email] })

        if (!student[0][1])
            student = [[{}, "null"]];

        profileManagerClone.studentContent = student[0];
        profileManagerClone.current = current;
        setProfileManager(profileManagerClone);
    }

    const displayStudentInfo = () => {
        return <div className="flex flex-col w-[100%] gap-5">
            <div className="flex flex-col">
                <div className={`flex flex-row justify-start rounded-3xl mx-auto`}>
                    <span className={`material-icons-round w-[2.5rem] flex justify-center !h-[2.5rem] p-2 text-[1.5rem] text-black/[0.5] dark:text-white`}>person</span>
                    <span className={`my-auto text-[0.8rem]`}>{profileManager.queue[profileManager.current][0].name}</span>
                </div>
                <div className={`flex flex-row justify-start rounded-3xl mx-auto`}>
                    <span className={`material-icons-round w-[2.5rem] flex justify-center !h-[2.5rem] p-2 text-[1.5rem] text-black/[0.5] dark:text-white`}>email</span>
                    <span className={`my-auto text-[0.8rem]`}>{profileManager.queue[profileManager.current][0].email}</span>
                </div>
            </div>
            {updateIterables.map(item => <div className={`flex flex-row rounded-xl bg-blue-300/[0.5] dark:bg-violet-500/[0.5]`} key={item.key}>
                <span className={`material-icons-round w-[calc(2.5rem-4px)] my-auto flex justify-center !h-[calc(2.5rem-5px)] p-2 text-[calc(1.5rem-4px)] text-black/[0.5] dark:text-white`}>{item.icon}</span>
                <div className="w-[100%]">
                    <div className={`rounded-tr-xl rounded-l-none my-auto text-[0.8rem] bg-[rgba(255,51,51,0.7)] dark:bg-[rgba(255,51,51,0.5)] py-1 text-center font-bold`}>{profileManager.studentContent[0][item.key] ? profileManager.studentContent[0][item.key] : "\u00A0"}</div>
                    <div className={`rounded-br-xl rounded-l-none my-auto text-[0.8rem] bg-[rgba(51,255,51,0.5)] dark:bg-[rgba(51,255,51,0.3)] py-1 text-center font-bold`}>{profileManager.queue[profileManager.current][0][item.key] ? profileManager.queue[profileManager.current][0][item.key] : "\u00A0"}</div>
                </div>
            </div>)}
            <div className="flex flex-row justify-evenly">
                <BaseButton style={`bg-rose-600/[0.7] hover:bg-rose-600 !rounded-full w-[42px] h-[42px] !p-0 flex flex-col justify-center ${transitioner.simple}`} clickFunction={declineStudentProfile} text={<span className="material-icons-round mx-auto">clear</span>} />
                <BaseButton style={`bg-teal-600/[0.7] hover:bg-teal-600 !rounded-full w-[42px] h-[42px] !p-0 flex flex-col justify-center ${transitioner.simple}`} clickFunction={approveStudentProfile} text={<span className="material-icons-round mx-auto">check</span>} />
            </div>
        </div>
    }

    const displayRequestInfo = () => {
        if (profileManager.contentLoading) {
            return loadingList;
        } else if (profileManager.studentContent[1]) {
            return displayStudentInfo();
        } else {
            return emptyInbox;
        }
    }

    const generateStudentObject = () => ({
        id: profileManager.studentContent[1] === "null" ? null : profileManager.studentContent[1],
        department: profileManager.queue[profileManager.current][0].department ? profileManager.queue[profileManager.current][0].department : profileManager.studentContent[0].department,
        lms_username: profileManager.queue[profileManager.current][0].lms_username ? profileManager.queue[profileManager.current][0].lms_username : profileManager.studentContent[0].lms_username,
        name: profileManager.queue[profileManager.current][0].name ? profileManager.queue[profileManager.current][0].name : profileManager.studentContent[0].name,
        official_email: profileManager.queue[profileManager.current][0].official_email ? profileManager.queue[profileManager.current][0].official_email : profileManager.studentContent[0].official_email,
        personal_email: profileManager.queue[profileManager.current][0].personal_email ? profileManager.queue[profileManager.current][0].personal_email : profileManager.studentContent[0].personal_email,
        phone: profileManager.queue[profileManager.current][0].phone ? profileManager.queue[profileManager.current][0].phone : profileManager.studentContent[0].phone,
        program: profileManager.queue[profileManager.current][0].program ? profileManager.queue[profileManager.current][0].program : profileManager.studentContent[0].program,
        school: profileManager.queue[profileManager.current][0].school ? profileManager.queue[profileManager.current][0].school : profileManager.studentContent[0].school,
        student_id: profileManager.queue[profileManager.current][0].student_id ? profileManager.queue[profileManager.current][0].student_id : profileManager.studentContent[0].student_id,
        discord_id: profileManager.queue[profileManager.current][0].discord_id ? profileManager.queue[profileManager.current][0].discord_id : profileManager.studentContent[0].discord_id
    });

    const approveStudentProfile = async () => {
        showLoadingScreen("Approving changes, please wait");
        let queue = [...profileManager.queue];
        queue.splice(profileManager.current, 1);
        await setStudent(generateStudentObject());
        await deleteStudentInfoUpdateRequest(profileManager.queue[profileManager.current][1]);
        setProfileManager({ ...profileManager, queue: queue, studentContent: [{}, null] })
        hideLoadingScreen();
    }

    const declineStudentProfile = async () => {
        showLoadingScreen("Declining changes, please wait");
        let queue = [...profileManager.queue];
        queue.splice(profileManager.current, 1);
        setProfileManager({ ...profileManager, queue: queue, studentContent: [{}, null] });
        await deleteStudentInfoUpdateRequest(profileManager.queue[profileManager.current][1]);
        hideLoadingScreen();
    }

    const setSearchPhrase = event => {
        const profileManagerClone = deepClone(profileManager);
        profileManagerClone.searchAddress = event.target.value;
        setProfileManager(profileManagerClone);
    }

    const fetchStudentInfoUpdateRequest = async () => {
        let queue = await getStudentsInfoUpdateRequest(profileManager.searchAddress);

        if (!queue[0][1])
            queue = [];

        setProfileManager({ ...profileManager, queue: queue });
    }

    return <div className={`${pageLayoutStyles.scrollable}`}>
        <SimpleCard showTitle={false} customStyle="flex flex-col md:flex-row !bg-[#fff]/[0.0]">
            <SimpleCard showTitle={false} customStyle="w-[100%] md:w-[40%] rounded-t-none md:rounded-tl-xl md:rounded-r-none md:order-first">
                <div className="p-5 flex flex-col gap-5">
                    <div className="flex flex-row gap-3">
                        <LineInput customStyle={{ container: "w-[calc(95%-42px)]", input: "py-1" }} label="Email Address" onChangeFn={event => setSearchPhrase(event)} value={profileManager.searchAddress} />
                        <PrimaryButton customStyle="!rounded-full w-[42px] h-[42px] !p-0 flex flex-col justify-center" text={<span className="material-icons-round mx-auto">search</span>} clickFunction={fetchStudentInfoUpdateRequest} />
                    </div>
                    <div className={`h-[20vh] md:h-[50vh] pt-5 flex flex-col justify-start gap-4 overflow-scroll no-scroll-bar ${borderColorStyles.simple} border-t-2`}>
                        {getListContent()}
                    </div>
                </div>
            </SimpleCard>
            <SimpleCard showTitle={false} customStyle={`min-h-[50vh] w-[100%] !drop-shadow-3xl md:w-[60%] rounded-b-none md:rounded-br-xl md:rounded-l-none -order-1 !bg-blue-500/[0.05] dark:!bg-blue-500/[0.1]`}>
                <div className="p-5 flex flex-col justify-center">
                    {displayRequestInfo()}
                </div>
            </SimpleCard>
        </SimpleCard>
    </div>
}

export default StudentProfileManager;