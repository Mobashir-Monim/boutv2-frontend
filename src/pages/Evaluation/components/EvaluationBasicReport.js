import { useEffect, useState } from "react";
import SimpleCard from "../../../components/Card/SimpleCard";
import { deepClone } from "../../../utils/functions/deepClone";
import EvaluationReportHelper from "../helpers/EvaluationReportHelper";

const EvaluationBasicReport = ({ target, questions, evaluationInstance }) => {
    const { code, section, faculty, part } = target;
    const [report, setReport] = useState(new EvaluationReportHelper(code, section, part, evaluationInstance, questions));

    useEffect(() => {
        (async () => {
            const reportClone = deepClone(report);
            await reportClone.generateReport();
            setReport(reportClone);
        })();
    }, [target]);

    const generateStatable = stats => {
        if (Array.isArray(stats)) {
            return stats.map((s, sIndex) => <div className={`p-2 ${sIndex % 2 === 0 ? "bg-[#ddd] dark:bg-[#333]" : ""}`} key={sIndex}>{s}</div>)
        } else {
            let count = 0;
            let statable = [];

            for (let s in stats) {
                statable.push(<div className={`p-2 ${count % 2 === 0 ? "bg-[#ddd] dark:bg-[#333]" : ""}`} key={s}>
                    <span className="font-bold">{stats[s]}</span> student(s) selected <span className="font-bold">"{s}"</span>
                </div>)
                count += 1;
            }

            return statable.map(s => s);
        }
    }

    const generateStatisticalReport = () => {

        if (report.report) {
            if (report.report.submissions > 0) {
                let parts = [];

                for (let q in report.report.statistical) {
                    const isFacultyQuestion = report.report.statistical[q].id.includes("faculty");
                    const isTargetFacultyQuestion = report.report.statistical[q].id.includes(faculty);

                    if (!isFacultyQuestion || (isFacultyQuestion && isTargetFacultyQuestion)) {
                        parts.push(<SimpleCard title={report.report.statistical[q].display} key={q} customStyle={"dark:shadow-[0_0_4px_3px_rgba(23,23,23,0.5)]"}>
                            <div className="p-5">
                                {report.report.statistical[q].aggregatable ? <span className="block p-2 text-[0.8rem]">Average: {(report.report.statistical[q].average.sum / report.report.statistical[q].average.count).toFixed(2)}</span> : <span className="block py-2"></span>}
                                <div className="flex flex-col w-[100%] md:w-[65%] text-[0.8rem]">
                                    {generateStatable(report.report.statistical[q].stats)}
                                </div>
                            </div>
                        </SimpleCard>);
                    }
                }

                return parts.map(x => x);
            } else {
                return <h3 className="text-[2rem] block w-[100%] text-center">No submissions found</h3>;
            }
        } else {
            return <h3 className="text-[2rem] block w-[100%] text-center">Generating report, please wait</h3>;
        }
    }

    return <div className="flex flex-col gap-10 justify-between">
        {generateStatisticalReport()}
    </div>
}

export default EvaluationBasicReport;