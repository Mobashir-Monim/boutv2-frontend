import { useState } from "react";
import { useAuth } from "../../utils/contexts/AuthContext";
import { getEvaluationInstance, getEvaluationSubmissions, setEvaluationInstance } from "../../db/remote/evaluation";
import { getOfferedSections, getOfferedSectionsByFaculty, setOfferedSection } from "../../db/remote/course";
import { cardStyles, pageLayoutStyles } from "../../utils/styles/styles";
import { deepCopy } from "@firebase/util";
import { useEvaluationInstance, useEvaluationQuestions } from "../../utils/contexts/EvaluationContext";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";
import { useModal } from "../../utils/contexts/ModalContext";

import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import { SelectInput, LineInput } from "../../components/FormInputs/LabeledInputs";
import CardHeader from "../../components/Headers/CardHeader";
import SimpleCard from "../../components/Card/SimpleCard";
import EvaluationDates from "./components/EvaluationDates";
import AssignedCourses from "./components/AssignedCourses";
import EvaluationSearchPanel from "./components/EvaluationSearchPanel";
import EvaluationBasicReport from "./components/EvaluationBasicReport";

const Evaluation = () => {
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const { questions } = useEvaluationQuestions();
    const { showModal } = useModal();
    const { user } = useAuth();
    const { storeEvaluationInstance, evaluationInstance } = useEvaluationInstance();
    const years = Array((new Date()).getUTCFullYear() - 2022 + 1).fill().map((_, idx) => `${(new Date()).getUTCFullYear() + idx}`);
    const semesters = ["Spring", "Summer", "Fall"];

    const [evaluationState, setevaluationState] = useState({
        year: null,
        semester: null,
        dates: { show: false, start: (new Date()).toISOString().split("T")[0], end: null },
        entity: "CSE",
        initiated: false,
        published: false,
        id: null,
        offered_sections: { theory: [], lab: [] },
        submissions: { theory: [], lab: [] },
        search: {
            phrase: {
                code: "",
                section: "",
                link: "",
                faculty: ""
            },
            results: { theory: {}, lab: {} }
        },
        showReport: false,
        report: {
            target: { code: null, section: null, faculty: null },
            content: null
        }
    });

    const fetchSubmissions = async (section_ids, part) => {
        let submissions = [];

        for (let i = 0; i < section_ids.length; i += 10) {
            if (section_ids.slice(i, i + 10).length > 0) {
                const temp = await getEvaluationSubmissions({ offered_section_ids: section_ids.slice(i, i + 10), part });

                if (temp[0][1])
                    submissions = submissions.concat(temp);
            }
        }

        return submissions;
    }

    const fetchEvaluationInstance = async () => {
        if (semesters.includes(evaluationState.semester) && years.includes(evaluationState.year)) {
            showLoadingScreen("Fetching data, please wait");
            const evaluationStateClone = deepCopy(evaluationState);
            let [evaluationInstance, id] = (await getEvaluationInstance({ year: evaluationState.year, semester: evaluationState.semester, entity: evaluationState.entity }))[0];

            if (!id && user.uid === "36QlTRZox2Oc6QEqVFdSSK8eg4y1") {
                if (window.confirm(`Are you sure that you want to create a new evaluation instance for ${evaluationState.year} ${evaluationState.semester}`)) {
                    await setEvaluationInstance({ year: evaluationState.year, semester: evaluationState.semester, entity: evaluationState.entity, initiated: false, published: false, start: "", end: "" });
                    [evaluationInstance, id] = (await getEvaluationInstance({ year: evaluationState.year, semester: evaluationState.semester, entity: evaluationState.entity }))[0];
                }
            }

            if (id) {
                evaluationStateClone.dates.start = evaluationInstance.start;
                evaluationStateClone.dates.end = evaluationInstance.end;
                evaluationStateClone.initiated = evaluationInstance.initiated;
                evaluationStateClone.published = evaluationInstance.published;
                evaluationStateClone.id = id;
                evaluationStateClone.offered_sections = await getOfferedSectionsByFaculty(user.email);
                evaluationStateClone.submissions.theory = await fetchSubmissions(evaluationStateClone.offered_sections.theory.map(x => x[1]), "theory");
                evaluationStateClone.submissions.lab = await fetchSubmissions(evaluationStateClone.offered_sections.lab.map(x => x[1]), "lab");

                storeEvaluationInstance(evaluationStateClone);
                setevaluationState(evaluationStateClone);
            } else {
                setevaluationState({
                    ...evaluationState,
                    dates: { show: false, start: (new Date()).toISOString().split("T")[0], end: null },
                    entity: "CSE",
                    initiated: false,
                    published: false,
                    id: null,
                    offered_sections: { theory: [], lab: [] },
                    submissions: { theory: [], lab: [] },
                });
                alert("Evaluation not set.")
            }

            hideLoadingScreen();
        } else {
            alert("Please select a valid year and semester");
        }
    }

    const toggleEvaluationDatesModal = (show) => {
        show = typeof (show) === "boolean" ? show : !evaluationState.dates.show;
        const evaluationStateClone = deepCopy(evaluationState);
        evaluationStateClone.dates.show = show;

        setevaluationState(evaluationStateClone);
    }

    const fetchEvaluationSemesterData = async event => {
        await fetchEvaluationInstance();
        event.preventDefault();
    }

    const selectEvaluationSemester = event => {
        const evaluationStateClone = deepCopy(evaluationState);
        evaluationStateClone.semester = event.target.value;

        storeEvaluationInstance(evaluationStateClone);

        setevaluationState(evaluationStateClone);
    }

    const selectEvaluationYear = event => {
        const evaluationStateClone = deepCopy(evaluationState);
        evaluationStateClone.year = event.target.value;

        storeEvaluationInstance(evaluationStateClone);

        setevaluationState(evaluationStateClone);
    }

    const setStartDate = event => {
        const evaluationStateClone = deepCopy(evaluationState);
        evaluationStateClone.dates.start = event.target.value;

        setevaluationState(evaluationStateClone);
    }

    const setEndDate = event => {
        const evaluationStateClone = deepCopy(evaluationState);
        evaluationStateClone.dates.end = event.target.value;

        setevaluationState(evaluationStateClone);
    }

    const setEntity = event => {
        const evaluationStateClone = deepCopy(evaluationState);
        evaluationStateClone.entity = event.target.value;

        storeEvaluationInstance(evaluationStateClone);

        setevaluationState(evaluationStateClone);
    }

    const setSearchPhraseCode = event => {
        const evaluationStateClone = deepCopy(evaluationState);
        evaluationStateClone.search.phrase.code = event.target.value.toUpperCase();

        setevaluationState(evaluationStateClone);
    }

    const setSearchPhraseSection = event => {
        const evaluationStateClone = deepCopy(evaluationState);
        evaluationStateClone.search.phrase.section = event.target.value;

        setevaluationState(evaluationStateClone);
    }

    const setSearchPhraseLink = event => {
        const evaluationStateClone = deepCopy(evaluationState);
        evaluationStateClone.search.phrase.link = event.target.value;

        setevaluationState(evaluationStateClone);
    }

    const setSearchPhraseFaculty = event => {
        const evaluationStateClone = deepCopy(evaluationState);
        evaluationStateClone.search.phrase.faculty = event.target.value;

        setevaluationState(evaluationStateClone);
    }

    const constructSearchResultObject = (results) => {
        const resultObject = { theory: {}, lab: {} };

        if (results[0][1]) {
            for (let p in resultObject) {
                results.forEach(row => {
                    resultObject[p][row[1]] = {
                        code: row[0].code,
                        section: row[0].section,
                        [`${p}_instructor_names`]: row[0][`${p}_instructor_names`],
                        [`${p}_instructor_emails`]: row[0][`${p}_instructor_emails`],
                        [`${p}_instructor_initials`]: row[0][`${p}_instructor_initials`],
                        [`${p}_evaluation_link`]: row[0][`${p}_evaluation_link`],
                    }
                })
            }
        }

        return resultObject;
    }

    const searchOfferedSection = async () => {
        showLoadingScreen("Fetching data, please wait");
        const offered_sections = await getOfferedSections({
            year: evaluationState.year,
            semester: evaluationState.semester,
            code: evaluationState.search.phrase.code,
            section: evaluationState.search.phrase.section,
            link_code: evaluationState.search.phrase.link,
            faculty: evaluationState.search.phrase.faculty
        });
        const evaluationStateClone = deepCopy(evaluationState);
        evaluationStateClone.search.results = constructSearchResultObject(offered_sections);

        setevaluationState(evaluationStateClone);
        hideLoadingScreen();
    }

    const setOfferedSectionInstructorState = (part, identifier, target, index, event) => {
        const evaluationStateClone = deepCopy(evaluationState);
        evaluationStateClone.search.results[part][identifier][`${part}_instructor_${target}`][index] = event.target.value;

        setevaluationState(evaluationStateClone);
    }

    const setOfferedSectionInstructor = async identifier => {
        showLoadingScreen("Updating data, please wait");
        await setOfferedSection({
            id: identifier,
            code: evaluationState.search.results.theory[identifier].code,
            section: evaluationState.search.results.theory[identifier].section,
            semester: evaluationState.semester,
            year: `${evaluationState.year}`,
            lab_evaluation_link: evaluationState.search.results.lab[identifier].lab_evaluation_link,
            theory_evaluation_link: evaluationState.search.results.theory[identifier].theory_evaluation_link,
            lab_instructor_names: evaluationState.search.results.lab[identifier].lab_instructor_names,
            lab_instructor_emails: evaluationState.search.results.lab[identifier].lab_instructor_emails,
            lab_instructor_initials: evaluationState.search.results.lab[identifier].lab_instructor_initials,
            theory_instructor_names: evaluationState.search.results.theory[identifier].theory_instructor_names,
            theory_instructor_emails: evaluationState.search.results.theory[identifier].theory_instructor_emails,
            theory_instructor_initials: evaluationState.search.results.theory[identifier].theory_instructor_initials,
        })

        hideLoadingScreen();
    }

    const toggleInitializedState = event => {
        const evaluationStateClone = deepCopy(evaluationState);
        evaluationStateClone.initiated = !evaluationStateClone.initiated;
        evaluationStateClone.published = false;

        setevaluationState(evaluationStateClone);
    }

    const togglePublishedState = event => {
        if ((new Date()).getTime() > (new Date(`${evaluationState.dates.end} 11:59:59 PM`)).getTime() && evaluationState.initiated) {
            const evaluationStateClone = deepCopy(evaluationState);
            evaluationStateClone.published = !evaluationStateClone.published;

            setevaluationState(evaluationStateClone);

        } else {
            alert(`Evaluation collection must be over before publishing results`);
        }
    }

    const getFormattedEvaluationObject = () => {
        return {
            year: evaluationState.year,
            semester: evaluationState.semester,
            start: evaluationState.dates.start,
            end: evaluationState.dates.end,
            entity: evaluationState.entity,
            initiated: evaluationState.initiated,
            published: evaluationState.published,
            id: evaluationState.id,
        }
    }

    const saveEvaluationSettings = async () => {
        if (user.uid === "36QlTRZox2Oc6QEqVFdSSK8eg4y1") {
            showLoadingScreen("Updating data, please wait");
            await setEvaluationInstance(getFormattedEvaluationObject());
            hideLoadingScreen();
        }
    }

    const showReport = (code, section, faculty, part) => {
        showModal(
            `${code} - ${section} ${part.slice(0, 1).toUpperCase()}${part.slice(1)} Report`,
            <EvaluationBasicReport target={{ code, section, faculty, part }} questions={questions} evaluationInstance={evaluationInstance} />
        );
    }

    const entityControl = <LineInput label="Evaluation Entity" onChangeFn={setEntity} value={evaluationState.entity} />;

    const evalAdminControls = <SimpleCard title="Evaluation Admin Checklist" width="w-[100%] lg:w-[35%]">
        <div className="flex flex-col flex-wrap p-5 justify-between gap-3 mx-auto">
            <div className="flex flex-row w-[100%]">
                <SecondaryButton text={"Set Questions"} customStyle="w-[50%] !rounded-r-none" link={`/evaluation/questions`} />
                <SecondaryButton text={"Set Dates"} customStyle="w-[50%] !rounded-l-none" clickFunction={toggleEvaluationDatesModal} />
            </div>
            <div className="flex flex-row w-[100%]">
                <SecondaryButton customStyle="w-[50%] !rounded-r-none" text={"Set Matrix"} link={"/evaluation/analysis"} />
                <SecondaryButton customStyle="w-[50%] !rounded-l-none" text={`${evaluationState.initiated ? "Unpublish Form" : "Publish Form"}`} clickFunction={toggleInitializedState} />
            </div>
            <div className="flex flex-row w-[100%]">
                <SecondaryButton customStyle="w-[50%] !rounded-r-none" text={`${evaluationState.published ? "Unpublish Results" : "Publish Results"}`} clickFunction={togglePublishedState} />
                <SecondaryButton customStyle="w-[50%] !rounded-l-none" text={"Save Settings"} clickFunction={saveEvaluationSettings} />
            </div>
        </div>
    </SimpleCard>;

    const evaluationDatesModal = <EvaluationDates
        show={evaluationState.dates.show}
        toggleDateModal={toggleEvaluationDatesModal}
        startDate={evaluationState.dates.start}
        endDate={evaluationState.dates.end}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
    />;

    return <div className={`${pageLayoutStyles.scrollable} flex flex-col gap-10`}>
        <div className="flex flex-col lg:flex-row gap-y-10 md:justify-between">
            <SimpleCard customStyle={`w-[100%] lg:w-[60%] ${cardStyles.simple}`} title="Select evaluation semester">
                <div className="p-5">
                    <div className="flex flex-col mt-2 md:flex-row w-[100%] justify-between">
                        <div className="flex flex-col text-left md:w-[47%]">
                            <SelectInput name={"year"} label={"Evaluation Year"} options={evaluationState.year === null ? ["Select year", ...years] : years} value={evaluationState.year} onChangeFn={selectEvaluationYear} />
                        </div>
                        <div className="flex flex-col text-left md:w-[47%]">
                            <SelectInput name={"semester"} label={"Evaluation Semester"} options={evaluationState.semester === null ? ["Select semester", ...semesters] : semesters} value={evaluationState.semester} onChangeFn={selectEvaluationSemester} />
                        </div>
                    </div>
                    <div className="text-right flex flex-col md:flex-row mt-2 gap-5 justify-between">
                        <div className="flex flex-col w-[100%] md:w-[47%]">
                            {user.uid === "36QlTRZox2Oc6QEqVFdSSK8eg4y1" ? entityControl : <></>}
                        </div>
                        <div className="flex flex-col w-[100%] md:w-[30%] my-auto">
                            <PrimaryButton text="Confirm semester" type="button" clickFunction={fetchEvaluationSemesterData} />
                        </div>
                    </div>
                </div>
            </SimpleCard>
            {user.uid === "36QlTRZox2Oc6QEqVFdSSK8eg4y1" && evaluationState.id ? evalAdminControls : <></>}
        </div>

        <AssignedCourses evaluationState={evaluationState} showReport={showReport} />

        <EvaluationSearchPanel
            user={user}
            evaluationState={evaluationState}
            setSearchPhraseCode={setSearchPhraseCode}
            setSearchPhraseSection={setSearchPhraseSection}
            setSearchPhraseLink={setSearchPhraseLink}
            setSearchPhraseFaculty={setSearchPhraseFaculty}
            setOfferedSectionInstructor={setOfferedSectionInstructor}
            searchOfferedSection={searchOfferedSection}
            setOfferedSectionInstructorState={setOfferedSectionInstructorState}
            showReport={showReport}
            searchObject={evaluationState.search}
        />
        {user.uid === "36QlTRZox2Oc6QEqVFdSSK8eg4y1" ? evaluationDatesModal : <></>}
    </div>
}

export default Evaluation;