import { useState } from "react";
import { useAuth } from "../../utils/contexts/AuthContext";
import { getEvaluationInstance, getEvaluationSubmissions, setEvaluationInstance } from "../../db/remote/evaluation";
import { getOfferedSectionsByFaculty } from "../../db/remote/course";
import { cardStyles, pageLayoutStyles, transitioner } from "../../utils/styles/styles";
import { deepCopy } from "@firebase/util";
import { useEvaluationInstance } from "../../utils/contexts/EvaluationContext";

import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import { SelectInput } from "../../components/FormInputs/LabeledInputs";
import CardHeader from "../../components/Headers/CardHeader";
import SimpleCard from "../../components/Card/SimpleCard";
import EvaluationDates from "./Admin/EvaluationDates";
import { LineInput } from "../../components/FormInputs/LabeledInputs";

const Evaluation = () => {
    const { user } = useAuth();
    const { storeEvaluationInstance } = useEvaluationInstance();
    const years = Array((new Date()).getUTCFullYear() - 2022 + 1).fill().map((_, idx) => `${(new Date()).getUTCFullYear() + idx}`);
    const semesters = ["Spring", "Summer", "Fall"];

    const [pageState, setPageState] = useState({
        year: years[0],
        semester: semesters[0],
        dates: { show: false, start: (new Date()).toISOString().split("T")[0], end: null },
        entity: "CSE",
        initiated: false,
        published: false,
        id: null,
        offered_sections: { theory: [], lab: [] },
        submissions: { theory: [], lab: [] },
    });

    const fetchSubmissions = async (section_ids, part) => {
        let submissions = [];

        for (let i = 0; i < section_ids.length; i++) {
            if (section_ids.slice(i * 10, i + 10).length > 0) {
                const temp = await getEvaluationSubmissions({ offered_section_ids: section_ids.slice(i * 10, i + 10), part });
                submissions = submissions.concat(temp);
            }
        }

        return submissions;
    }

    const fetchEvaluationInstance = async () => {
        if (semesters.includes(pageState.semester) && years.includes(pageState.year)) {
            const pageStateClone = deepCopy(pageState);
            let [evaluationInstance, id] = await getEvaluationInstance({ year: pageState.year, semester: pageState.semester, entity: pageState.entity });
            if (!id) {
                await setEvaluationInstance({ year: pageState.year, semester: pageState.semester, entity: pageState.entity, initiated: false, published: false, start: "", end: "" });
                [evaluationInstance, id] = await getEvaluationInstance({ year: pageState.year, semester: pageState.semester, entity: pageState.entity });
            }

            pageStateClone.dates.start = evaluationInstance.start;
            pageStateClone.dates.end = evaluationInstance.end;
            pageStateClone.initiated = evaluationInstance.initiated;
            pageStateClone.published = evaluationInstance.published;
            pageStateClone.id = id;
            pageStateClone.offered_sections = await getOfferedSectionsByFaculty(user.email);
            pageStateClone.submissions.theory = await fetchSubmissions(pageStateClone.offered_sections.theory.map(x => x[1]), "theory");
            pageStateClone.submissions.lab = await fetchSubmissions(pageStateClone.offered_sections.lab.map(x => x[1]), "lab");

            storeEvaluationInstance(pageStateClone);
            setPageState(pageStateClone);
        } else {
            alert("Please select a valid year and semester");
        }
    }

    const toggleEvaluationDatesModal = (show) => {
        show = typeof (show) === "boolean" ? show : !pageState.dates.show;
        const pageStateClone = deepCopy(pageState);
        pageStateClone.dates.show = show;

        setPageState(pageStateClone);
    }

    const fetchEvaluationSemesterData = async event => {
        await fetchEvaluationInstance();
        event.preventDefault();
    }

    const selectEvaluationSemester = event => {
        const pageStateClone = deepCopy(pageState);
        pageStateClone.semester = event.target.value;

        storeEvaluationInstance(pageStateClone);

        setPageState(pageStateClone);
    }

    const selectEvaluationYear = event => {
        const pageStateClone = deepCopy(pageState);
        pageStateClone.year = event.target.value;

        storeEvaluationInstance(pageStateClone);

        setPageState(pageStateClone);
    }

    const setStartDate = event => {
        const pageStateClone = deepCopy(pageState);
        pageStateClone.dates.start = event.target.value;

        setPageState(pageStateClone);
    }

    const setEndDate = event => {
        const pageStateClone = deepCopy(pageState);
        pageStateClone.dates.end = event.target.value;

        setPageState(pageStateClone);
    }

    const setEntity = event => {
        const pageStateClone = deepCopy(pageState);
        pageStateClone.entity = event.target.value;

        storeEvaluationInstance(pageStateClone);

        setPageState(pageStateClone);
    }

    const toggleInitializedState = event => {
        const pageStateClone = deepCopy(pageState);
        pageStateClone.initiated = !pageStateClone.initiated;
        pageStateClone.published = false;

        setPageState(pageStateClone);
    }

    const togglePublishedState = event => {
        if ((new Date()).getTime() > (new Date(`${pageState.dates.end} 11:59:59 PM`)).getTime() && pageState.initiated) {
            const pageStateClone = deepCopy(pageState);
            pageStateClone.published = !pageStateClone.published;

            setPageState(pageStateClone);
        } else {
            alert(`Evaluation collection must be over before publishing results`);
        }
    }

    const getFormattedEvaluationObject = () => {
        return {
            year: pageState.year,
            semester: pageState.semester,
            start: pageState.dates.start,
            end: pageState.dates.end,
            entity: pageState.entity,
            initiated: pageState.initiated,
            published: pageState.published,
            id: pageState.id,
        }
    }

    const saveEvaluationSettings = async () => {
        await setEvaluationInstance(getFormattedEvaluationObject());
    }

    const entityControl = <LineInput label="Evaluation Entity" onChangeFn={setEntity} value={pageState.entity} />;

    const evalAdminControls = <SimpleCard title="Evaluation Admin Checklist" width="w-[100%] lg:w-[35%]">
        <div className="flex flex-col flex-wrap mt-5 justify-between gap-3 mx-auto">
            <div className="flex flex-row w-[100%]">
                <SecondaryButton text={"Set Questions"} customStyle="w-[50%] !rounded-r-none" link={`/evaluation/questions`} />
                <SecondaryButton text={"Set Dates"} customStyle="w-[50%] !rounded-l-none" clickFunction={toggleEvaluationDatesModal} />
            </div>
            <div className="flex flex-row w-[100%]">
                <SecondaryButton customStyle="w-[50%] !rounded-r-none" text={"Set Matrix"} link={"/evaluation/analysis"} />
                <SecondaryButton customStyle="w-[50%] !rounded-l-none" text={`${pageState.published ? "Unpublish Form" : "Publish Form"}`} clickFunction={toggleInitializedState} />
            </div>
            <div className="flex flex-row w-[100%]">
                <SecondaryButton customStyle="w-[50%] !rounded-r-none" text={`${pageState.published ? "Unpublish Results" : "Publish Results"}`} clickFunction={togglePublishedState} />
                <SecondaryButton customStyle="w-[50%] !rounded-l-none" text={"Save Settings"} clickFunction={saveEvaluationSettings} />
            </div>
        </div>
    </SimpleCard>;

    const evaluationDatesModal = <EvaluationDates
        show={pageState.dates.show}
        toggleDateModal={toggleEvaluationDatesModal}
        startDate={pageState.dates.start}
        endDate={pageState.dates.end}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
    />;

    return <div className={`${pageLayoutStyles.scrollable} flex flex-col gap-10 pb-20`}>
        <div className="flex flex-col lg:flex-row gap-y-10 md:justify-between">
            <div className={`w-[100%] lg:w-[60%] ${cardStyles.simple}`}>
                <CardHeader title="Select evaluation semester" />
                <div className="flex flex-col mt-5 md:flex-row w-[100%] justify-between">
                    <div className="flex flex-col text-left md:w-[47%]">
                        <SelectInput name={"year"} label={"Evaluation Year"} options={years} onChangeFn={selectEvaluationYear} />
                    </div>
                    <div className="flex flex-col text-left md:w-[47%]">
                        <SelectInput name={"semester"} label={"Evaluation Semester"} options={semesters} onChangeFn={selectEvaluationSemester} />
                    </div>
                </div>
                <div className="text-right flex flex-col md:flex-row mt-5 gap-5 justify-between">
                    <div className="flex flex-col w-[100%] md:w-[50%]">
                        {user.uid === "36QlTRZox2Oc6QEqVFdSSK8eg4y1" ? entityControl : <></>}
                    </div>
                    <div className="flex flex-col w-[100%] md:w-[30%] my-auto">
                        <PrimaryButton text="Confirm semester" type="button" clickFunction={fetchEvaluationSemesterData} />
                    </div>
                </div>
            </div>
            {user.uid === "36QlTRZox2Oc6QEqVFdSSK8eg4y1" ? evalAdminControls : <></>}
        </div>
        <div className={`${pageState.id ? "" : "hidden"} ${transitioner.simple}`}>
            <SimpleCard title={`Evaluation completion status of ${pageState.year} ${pageState.semester} course assignments`}>
                <div className="flex flex-col mt-5 overflow-scroll pb-10">
                    <div className="flex flex-row overflow-scroll min-w-[700px] border-b-[1px] mb-2">
                        <span className="inline-block w-[150px]">Course Code</span>
                        <span className="inline-block w-[150px]">Course Section</span>
                        <span className="inline-block w-[200px]">Submissions</span>
                        <span className="inline-block w-[200px]">Evaluation Code</span>
                    </div>
                    {pageState.offered_sections.theory.map((course, courseIndex) => <div className="flex flex-row overflow-scroll min-w-[700px]" key={`c-t-${courseIndex}`}>
                        <span className="inline-block w-[150px] text-cent">{course[0].code}</span>
                        <span className="inline-block w-[150px] text-cent">{course[0].section}</span>
                        <span className="inline-block w-[200px] text-cent">{pageState.submissions.theory.filter(x => x[0].offered_section_id === course[1]).length}</span>
                        <span className="inline-block w-[200px] text-cent">{course[0].theory_evaluation_link}</span>
                    </div>)}
                    {pageState.offered_sections.lab.map((course, courseIndex) => <div className="flex flex-row overflow-scroll min-w-[700px]" key={`c-l-${courseIndex}`}>
                        <span className="inline-block w-[150px]">{course[0].code} Lab</span>
                        <span className="inline-block w-[150px]">{course[0].section}</span>
                        <span className="inline-block w-[200px]">{pageState.submissions.lab.filter(x => x[0].offered_section_id === course[1]).length}</span>
                        <span className="inline-block w-[200px]">{course[0].theory_evaluation_link}</span>
                    </div>)}
                </div>
            </SimpleCard>
        </div>
        {user.uid === "36QlTRZox2Oc6QEqVFdSSK8eg4y1" ? evaluationDatesModal : <></>}
    </div>
}

export default Evaluation;