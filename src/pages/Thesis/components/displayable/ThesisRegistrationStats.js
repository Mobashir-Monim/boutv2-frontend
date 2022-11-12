import { useEffect, useState } from "react";
import SimpleCard from "../../../../components/Card/SimpleCard";
import { applicationTypeColors } from "../../../../utils/styles/styles";
import { applicationTypeIcons } from "../../../../utils/styles/icons";
import { getThesisInstanceStats } from "../../../../db/remote/thesis";

const defaultThesisStats = {
    reg_stats: { internships: "", projects: "", theses: "" },
    approval_stats: { supervisor: "", coordinator: "" },
    soft_reject_stats: { supervisor: "", coordinator: "" },
    hard_reject_stats: { supervisor: "", coordinator: "" },
    unprocessed_stats: { supervisor: "", coordinator: "" },
}

const ThesisRegistrationStats = ({ thesisInstanceID, display = "col" }) => {
    const [thesisStats, setThesisStats] = useState(defaultThesisStats);
    const regTypeMaps = [
        { name: "internship", container: "internships" },
        { name: "project", container: "projects" },
        { name: "thesis", container: "theses" },
    ];
    const processingStatsMap = [
        { display: "Approved", container: "approval_stats" },
        { display: "Soft Reject", container: "soft_reject_stats" },
        { display: "Hard Reject", container: "hard_reject_stats" },
        { display: "Unprocessed", container: "unprocessed_stats" },
    ];

    useEffect(() => {
        (async () => {
            if (thesisInstanceID) {
                const stats = await getThesisInstanceStats(thesisInstanceID);
                setThesisStats(stats);
            }
        })();
    }, [thesisInstanceID]);

    const getFlexDirection = defaultDirection => {
        if (display === "col") {
            return defaultDirection;
        } else {
            if (defaultDirection === "flex-row") {
                return "flex-col";
            } else {
                return "flex-row";
            }
        }
    }

    return <SimpleCard title={"Registration Stats"} customStyle={"w-[100%]"}>
        <div className={`p-5 overflow-scroll flex ${getFlexDirection("flex-col")} gap-5`}>
            <div className={`flex flex-col ${display === "col" ? "gap-2" : "gap-5 min-w-[80px]"} my-auto`}>
                <div className={`flex ${getFlexDirection("flex-row")} justify-center gap-5`}>
                    {regTypeMaps.map(regType => <span className={`flex gap-2 ${applicationTypeColors[regType.name]} py-1 px-3 rounded-full text-[0.8rem]`} key={regType.name}>
                        <span className="material-icons-round my-auto text-[1.2rem]">{applicationTypeIcons[regType.name]}</span>
                        <span className="my-auto">{thesisStats.reg_stats[[regType.container]]}</span>
                    </span>)}
                </div>
                <div className={`text-center ${display === "col" ? "" : "hidden"}`}>
                    Total Registrations: {thesisStats.reg_stats.total}
                </div>
                <span className={`flex gap-2 bg-[#ccc] dark:bg-[#333] py-1 px-3 rounded-full text-[0.8rem] ${display !== "col" ? "" : "hidden"}`}>
                    <span className="material-icons-round my-auto text-[1.2rem]">app_registration</span>
                    <span className="my-auto">{thesisStats.reg_stats.total}</span>
                </span>
            </div>

            <div className="flex flex-col w-[100%]">
                <div className={`flex flex-row justify-between bg-[#ccc] dark:bg-[#333] py-2 px-2`}>
                    <span className={`${display === "col" ? "w-[80px]" : "w-[80px] md:w-[120px]"} text-[0.8rem]`}></span>
                    <span className={`${display === "col" ? "w-[80px]" : "w-[80px] md:w-[120px]"} text-[0.8rem] text-center`}>Supervisor</span>
                    <span className={`${display === "col" ? "w-[80px]" : "w-[80px] md:w-[120px]"} text-[0.8rem] text-center`}>Coordinator</span>
                </div>
                {processingStatsMap.map((process, processIndex) => <div className={`flex flex-row justify-between ${processIndex % 2 === 1 ? "bg-[#ccc] dark:bg-[#333]" : ""} py-2 px-2`} key={process.container}>
                    <span className={`${display === "col" ? "w-[80px]" : "w-[80px] md:w-[120px]"} text-[0.8rem]`}>{process.display}</span>
                    <span className={`${display === "col" ? "w-[80px]" : "w-[80px] md:w-[120px]"} text-[0.8rem] text-center`}>{thesisStats[process.container].supervisor}</span>
                    <span className={`${display === "col" ? "w-[80px]" : "w-[80px] md:w-[120px]"} text-[0.8rem] text-center`}>{thesisStats[process.container].coordinator}</span>
                </div>)}
            </div>
        </div>
    </SimpleCard>;
}

export default ThesisRegistrationStats;