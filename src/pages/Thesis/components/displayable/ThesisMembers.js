import { borderColorStyles } from "../../../../utils/styles/styles";

const ThesisMembers = ({ application }) => {
    const typeMaps = [
        { display: "Supervisor", container: "supervisor" },
        { display: "Co-supervisor", container: "co_supervisor_emails" },
        { display: "Member", container: "member_emails" },
    ];

    const noneFound = <div className="bg-black/[0.1] gap-2 dark:bg-[#fff]/[0.3] flex flex-col p-3 rounded-xl w-[100%] md:w-[calc(50%-1.25rem/2)] text-[0.9rem] mx-auto" >
        <div className="flex flex-row gap-3">
            None Found
        </div>
    </div>;
    const showPersonEmail = person => <div className="flex flex-row gap-3">
        <span className="material-icons-round">email</span>
        <span className="my-auto">{person}</span>
    </div>;
    const showSupervisorType = (type, personIndex) => type === "supervisor" ? <span className={`${borderColorStyles.simple} border-t-2 text-right`}>{personIndex === 0 ? "Primary" : "Secondary"}</span> : <></>
    const showCreditsCompleted = (type, personIndex) => {
        if (type === "member_emails" && application.credits_completed) {
            if (application.credits_completed.length > 0) {
                return <div className="flex flex-row gap-3">
                    <span className="">Credits Completed: </span>
                    <span className="my-auto">{application.credits_completed[personIndex]}</span>
                </div>;
            }
        }

        return <></>;
    }

    const mapPeople = (type) => application[type].length > 0 ?
        application[type].map((person, personIndex) => <div className="bg-black/[0.1] gap-2 dark:bg-[#fff]/[0.3] flex flex-col p-3 rounded-xl w-[100%] md:w-[calc(50%-1.25rem/2)] text-[0.9rem]" key={`supervisor-${personIndex}`}>
            <div className="flex flex-col gap-3">
                {showPersonEmail(person)}
                {showCreditsCompleted(type, personIndex)}
            </div>
            {showSupervisorType(type, personIndex)}
        </div>) : noneFound;

    return typeMaps.map(type => <div key={type.container}>
        <div className={`flex flex-row justify-between border-b-4 mb-2 ${borderColorStyles.simple} pb-2`}>
            <h4 className={`my-auto`}>{type.display}(s)</h4>
            <h4 className={`text-blue-400 font-bold font-mono`}>[ {application[type.container].length} ]</h4>
        </div>
        <div className="flex flex-col md:flex-row gap-5 flex-wrap">
            {mapPeople(type.container)}
        </div>
    </div>);
}

export default ThesisMembers;