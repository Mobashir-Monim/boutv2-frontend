import { textColorStyles, transitioner } from "../../../utils/styles/styles";
import SimpleCard from "../../../components/Card/SimpleCard";
import { borderColorStyles } from "../../../utils/styles/styles";
import { useAuth } from "../../../utils/contexts/AuthContext";

const AssignedCourses = ({ evaluationState, showReport }) => {
    const { user } = useAuth();

    const colSm = "inline-block w-[150px] text-center";
    const colMd = "inline-block w-[200px] text-center";
    const getCourseCode = course => course[0].code;
    const getCourseSection = course => course[0].section;
    const getEvaluationCode = (course, part) => course[0][`${part === 1 ? "lab" : "theory"}_evaluation_link`];
    const copyEvaluationCode = (course, part) => navigator.clipboard.writeText(getEvaluationCode(course, part));
    const getRowBgColor = (rowIndex) => rowIndex % 2 ? "bg-[#eee] dark:bg-[#333]" : "";
    const countSubmissions = (part, courseID) =>
        evaluationState.submissions[part === 1 ? "lab" : "theory"].filter(x => x[0].offered_section_id === courseID).length;

    const openReport = (course, part) => showReport(
        getCourseCode(course),
        getCourseSection(course),
        user.email,
        part === 1 ? "lab" : "theory");

    const getRow = (course, courseIndex, cIndex) => <div
        className={`flex flex-row min-w-[700px] px-3 py-2.5 border-b-[1px] ${borderColorStyles.simple} ${getRowBgColor(courseIndex)}`}
        key={`c-t-${courseIndex}`}
    >
        <span className={`${colSm} !text-left`}>{getCourseCode(course)} {cIndex === 1 ? "Lab" : ""}</span>
        <span className={`${colSm}`}>{getCourseSection(course)}</span>
        <span className={`${colMd}`}>{countSubmissions(cIndex, course[1])}</span>
        <span
            className={`flex w-[200px] justify-center ${textColorStyles.clickable} cursor-copy ${transitioner.simple} font-['Source_Code_Pro']`}
            onClick={() => copyEvaluationCode(course, cIndex)}
        >
            <span className="material-icons-round mr-3">content_copy</span> {getEvaluationCode(course, cIndex)}
        </span>
        <span
            className={`flex w-[200px] justify-center ${textColorStyles.clickable} cursor-pointer ${transitioner.simple}`}
            onClick={() => openReport(course, cIndex)}
        >
            <span className="material-icons-round mr-3">description</span> Report
        </span>
    </div>;

    return <div className={`${evaluationState.id ? "" : "hidden"} ${transitioner.simple}`}>
        <SimpleCard title={`Evaluation completion status of ${evaluationState.year} ${evaluationState.semester} course assignments`}>
            <div className="flex flex-col mt-5 overflow-scroll no-scroll-bar pb-5">
                <div className={`flex flex-row min-w-[700px] border-y-2 px-3 py-2.5 ${borderColorStyles.simple} bg-[#eee] dark:bg-[#333]`}>
                    <span className={`${colSm} !text-left`}>Course Code</span>
                    <span className={`${colSm}`}>Course Section</span>
                    <span className={`${colMd}`}>Submissions</span>
                    <span className={`${colMd}`}>Evaluation Code</span>
                    <span className={`${colMd}`}>Evaluation Report</span>
                </div>

                {[evaluationState.offered_sections.theory, evaluationState.offered_sections.lab].map((courses, cIndex) =>
                    courses.map((course, courseIndex) => getRow(course, courseIndex, cIndex))
                )}
            </div>
        </SimpleCard>
    </div>
}

export default AssignedCourses;