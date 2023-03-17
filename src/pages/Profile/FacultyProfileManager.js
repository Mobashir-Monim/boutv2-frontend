import { useEffect, useState } from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import BaseButton from "../../components/Buttons/BaseButton";
import SimpleCard from "../../components/Card/SimpleCard";
import { LineInput, TextInput } from "../../components/FormInputs/LabeledInputs";
import { deepClone } from "../../utils/functions/deepClone";
import { bgColorStyles, borderColorStyles, pageLayoutStyles, transitioner } from "../../utils/styles/styles";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";
import { deleteFacultyInfoUpdateRequest, getFacultyInfoUpdateRequest, getFacultyInfoUpdateRequests, getFacultyMember, setFaculty } from "../../db/remote/faculty";

const FacultyProfileManager = () => {
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const [profileManager, setProfileManager] = useState({
        queue: [],
        current: null,
        queueLoading: true,
        contentLoading: false,
        statusUpdating: false,
        searchAddress: "",
        facultyContent: [{}, null],
    });

    const updateIterables = [
        { key: "pin", icon: "badge", },
        { key: "degree", icon: "workspace_premium", },
        { key: "personal_email", icon: "alternate_email", },
        { key: "room", icon: "apartment", },
        { key: "initials", icon: "abc", },
        { key: "discord_id", icon: "discord", },
        { key: "phone", icon: "phone", },
    ];

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
            if (profileManager.queue.length === 0 && profileManager.searchAddress === "") {
                setProfileManager({ ...profileManager, queueLoading: true });
                const profileManagerClone = deepClone(profileManager);
                const queue = await getFacultyInfoUpdateRequests();

                if (queue[0][1])
                    profileManagerClone.queue = queue;

                profileManagerClone.queueLoading = false;
                setProfileManager(profileManagerClone);
            }
        })();
    }, [profileManager.queue, profileManager.searchAddress])

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
        let faculty = await getFacultyMember({ email: profileManagerClone.queue[current][0].email })

        if (!faculty[0][1])
            faculty = [[{}, "null"]];

        profileManagerClone.facultyContent = faculty[0];
        profileManagerClone.current = current;
        setProfileManager(profileManagerClone);
    }

    const displayFacultyInfo = () => {
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
                {displayRowInfo(item)}
            </div>)}
            <div className="flex flex-row justify-evenly">
                <BaseButton
                    style={`bg-rose-600/[0.7] hover:bg-rose-600 !rounded-full w-[42px] h-[42px] !p-0 flex flex-col justify-center ${transitioner.simple}`}
                    clickFunction={declineFacultyProfile}
                    text={<span className="material-icons-round mx-auto">clear</span>}
                />
                <BaseButton
                    style={`bg-teal-600/[0.7] hover:bg-teal-600 !rounded-full w-[42px] h-[42px] !p-0 flex flex-col justify-center ${transitioner.simple}`}
                    clickFunction={approveFacultyProfile}
                    text={<span className="material-icons-round mx-auto">check</span>}
                />
            </div>
        </div>
    }

    const displayRowInfo = item => {
        if (profileManager.facultyContent[0][item.key] === profileManager.queue[profileManager.current][0][item.key]) {
            return <div className="w-[100%]">
                <div
                    className={`rounded-r-xl rounded-l-none my-auto text-[0.8rem] ${bgColorStyles.inverse} py-4 text-center font-bold`}>
                    {profileManager.facultyContent[0][item.key] ? profileManager.facultyContent[0][item.key] : "\u00A0"}
                </div>
            </div>
        } else {
            return <div className="w-[100%]">
                <div
                    className={`rounded-tr-xl rounded-l-none my-auto text-[0.8rem] bg-[rgba(255,51,51,0.7)] dark:bg-[rgba(255,51,51,0.5)] py-1 text-center font-bold`}>
                    {profileManager.facultyContent[0][item.key] ? profileManager.facultyContent[0][item.key] : "\u00A0"}
                </div>
                <div
                    className={`rounded-br-xl rounded-l-none my-auto text-[0.8rem] bg-[rgba(51,255,51,0.5)] dark:bg-[rgba(51,255,51,0.3)] py-1 text-center font-bold`}>
                    {profileManager.queue[profileManager.current][0][item.key] ? profileManager.queue[profileManager.current][0][item.key] : "\u00A0"}
                </div>
            </div>
        }
    }

    const displayRequestInfo = () => {
        if (profileManager.contentLoading) {
            return loadingList;
        } else if (profileManager.facultyContent[1]) {
            return displayFacultyInfo();
        } else {
            return emptyInbox;
        }
    }

    const generateFacultyObject = () => ({
        id: profileManager.facultyContent[1] === "null" ? null : profileManager.facultyContent[1],
        ...profileManager.facultyContent[0],
        ...profileManager.queue[profileManager.current][0]
    });

    const approveFacultyProfile = async () => {
        showLoadingScreen("Approving changes, please wait");
        let queue = [...profileManager.queue];
        queue.splice(profileManager.current, 1);
        await setFaculty(generateFacultyObject())
        await deleteFacultyInfoUpdateRequest(profileManager.queue[profileManager.current][1]);
        setProfileManager({ ...profileManager, queue: queue, facultyContent: [{}, null] })
        hideLoadingScreen();
    }

    const declineFacultyProfile = async () => {
        showLoadingScreen("Declining changes, please wait");
        let queue = [...profileManager.queue];
        queue.splice(profileManager.current, 1);
        setProfileManager({ ...profileManager, queue: queue, facultyContent: [{}, null] });
        await deleteFacultyInfoUpdateRequest(profileManager.queue[profileManager.current][1]);
        hideLoadingScreen();
    }

    const setSearchPhrase = event => {
        const profileManagerClone = deepClone(profileManager);
        profileManagerClone.searchAddress = event.target.value;
        setProfileManager(profileManagerClone);
    }

    const fetchFacultyInfoUpdateRequest = async () => {
        let queue = await getFacultyInfoUpdateRequest(profileManager.searchAddress);
        setProfileManager({
            ...profileManager,
            queue: queue[0][1] ? queue : [],
            facultyContent: [{}, null],
        });
    }

    return <div className={`${pageLayoutStyles.scrollable}`}>
        <SimpleCard showTitle={false} customStyle="flex flex-col md:flex-row !bg-[#fff]/[0.0]">
            <SimpleCard showTitle={false} customStyle="w-[100%] md:w-[40%] rounded-t-none md:rounded-tl-xl md:rounded-r-none md:order-first">
                <div className="p-5 flex flex-col gap-5">
                    <div className="flex flex-row gap-3">
                        <LineInput customStyle={{ container: "w-[calc(95%-42px)]", input: "py-1" }} label="Email Address" onChangeFn={event => setSearchPhrase(event)} value={profileManager.searchAddress} />
                        <PrimaryButton customStyle="!rounded-full w-[42px] h-[42px] !p-0 flex flex-col justify-center" text={<span className="material-icons-round mx-auto">search</span>} clickFunction={fetchFacultyInfoUpdateRequest} />
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

export default FacultyProfileManager;
