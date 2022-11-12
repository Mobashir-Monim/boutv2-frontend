import { useEffect, useState } from "react";
import { getStudents } from "../../../../db/remote/student";
import { borderColorStyles } from "../../../../utils/styles/styles";

const ThesisMembers = ({ application }) => {
    const [students, setStudents] = useState([]);
    const typeMaps = [
        { display: "Supervisor", container: "supervisor" },
        { display: "Co-supervisor", container: "co_supervisor_emails" },
        { display: "Member", container: "member_emails" },
    ];

    useEffect(() => {
        (async () => {
            const students = await getStudents({ official_emails: application.member_emails });
            setStudents(students);
        })();
    }, [application]);

    const noneFound = <div className="bg-black/[0.1] gap-2 dark:bg-[#fff]/[0.3] flex flex-col p-3 rounded-xl w-[100%] md:w-[calc(50%-1.25rem/2)] text-[0.9rem] mx-auto" >
        <div className="flex flex-row gap-3">
            None Found
        </div>
    </div>;
    const showPersonEmail = person => <div className="flex flex-row gap-3">
        <span className="material-icons-round text-[0.9rem] my-auto">email</span>
        <span className="my-auto">{person}</span>
    </div>;
    const showSupervisorType = (type, personIndex) => type === "supervisor" ? <span className={`${borderColorStyles.simple} border-t-2 text-right`}>{personIndex === 0 ? "Primary" : "Secondary"}</span> : <></>
    const showStudentInfo = (type, personIndex) => {
        if (type === "member_emails" && application.credits_completed) {
            if (application.credits_completed.length > 0 && students.length > 0) {
                const student = students.find(student => student[0].official_email === application.member_emails[personIndex]);
                return <div className="flex flex-col gap-1 text-[0.8rem]">
                    <div className="flex flex-row gap-3">
                        <span className="material-icons-round text-[0.9rem] my-auto">person</span>
                        <span className="my-auto">{student[0].name}</span>
                    </div>
                    <div className="flex flex-row gap-3">
                        <span className="material-icons-round text-[0.9rem] my-auto">badge</span>
                        <span className="my-auto">{student[0].student_id}</span>
                    </div>
                    <div className="flex flex-row gap-3">
                        <span className="material-icons-round text-[0.9rem] my-auto">toll</span>
                        <span className="my-auto">{application.credits_completed[personIndex]}</span>
                    </div>
                </div>;
            }
        }

        return <></>;
    }

    const mapPeople = (type) => application[type].length > 0 ?
        application[type].map((person, personIndex) => <div className="bg-black/[0.1] gap-2 dark:bg-[#fff]/[0.3] flex flex-col p-3 rounded-xl w-[100%] md:w-[calc(50%-1.25rem/2)] text-[0.9rem]" key={`supervisor-${personIndex}`}>
            <div className="flex flex-col gap-1">
                {showStudentInfo(type, personIndex)}
                {showPersonEmail(person)}
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