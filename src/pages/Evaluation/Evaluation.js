import { useEffect, useState } from "react";
import { useAuth } from "../../utils/contexts/AuthContext";
import { getEvaluationInstance, getEvaluationSubmissions, setEvaluationInstance } from "../../db/remote/evaluation";
import { getDelinkableSections, getLinkableSections, getOfferedSections, getOfferedSectionsByFaculty, setOfferedSection } from "../../db/remote/course";
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
import { useSemesterSelect } from "../../utils/hooks/useSemesterSelect";

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
        showLoadingScreen("Fetching data, please wait");
        const eSClone = deepCopy(evaluationState);
        let [evaluationInstance, id] = (await getEvaluationInstance({ year: evaluationState.year, semester: evaluationState.semester, entity: evaluationState.entity }))[0];

        if (!id && user.uid === "36QlTRZox2Oc6QEqVFdSSK8eg4y1") {
            if (window.confirm(`Are you sure that you want to create a new evaluation instance for ${evaluationState.year} ${evaluationState.semester}`)) {
                await setEvaluationInstance({ year: evaluationState.year, semester: evaluationState.semester, entity: evaluationState.entity, initiated: false, published: false, start: "", end: "" });
                [evaluationInstance, id] = (await getEvaluationInstance({ year: evaluationState.year, semester: evaluationState.semester, entity: evaluationState.entity }))[0];
            }
        }

        if (id) {
            eSClone.dates.start = evaluationInstance.start;
            eSClone.dates.end = evaluationInstance.end;
            eSClone.initiated = evaluationInstance.initiated;
            eSClone.published = evaluationInstance.published;
            eSClone.id = id;
            eSClone.offered_sections = await getOfferedSectionsByFaculty(user.email, eSClone.semester, eSClone.year);
            eSClone.submissions.theory = await fetchSubmissions(eSClone.offered_sections.theory.map(x => x[1]), "theory");
            eSClone.submissions.lab = await fetchSubmissions(eSClone.offered_sections.lab.map(x => x[1]), "lab");

            storeEvaluationInstance(eSClone);
            setevaluationState(eSClone);
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
    }

    const toggleEvaluationDatesModal = (show) => {
        show = typeof (show) === "boolean" ? show : !evaluationState.dates.show;
        const eSClone = deepCopy(evaluationState);
        eSClone.dates.show = show;

        setevaluationState(eSClone);
    }

    const fetchEvaluationSemesterData = async () => {
        if (semesterSelection.isValidSelection()) {
            await fetchEvaluationInstance();
        } else {
            showModal("INVALID SEMESTER", "Please select a valid semester and year");
        }
    }

    const semesterSelection = useSemesterSelect(fetchEvaluationSemesterData);

    useEffect(() => {
        const eSClone = deepCopy(evaluationState);
        eSClone.semester = semesterSelection.values.semester;
        eSClone.year = semesterSelection.values.year;
        storeEvaluationInstance(eSClone);
        setevaluationState(eSClone);
    }, [semesterSelection.values])

    const setStartDate = event => {
        const eSClone = deepCopy(evaluationState);
        eSClone.dates.start = event.target.value;

        setevaluationState(eSClone);
    }

    const setEndDate = event => {
        const eSClone = deepCopy(evaluationState);
        eSClone.dates.end = event.target.value;

        setevaluationState(eSClone);
    }

    const setEntity = event => {
        const eSClone = deepCopy(evaluationState);
        eSClone.entity = event.target.value;

        storeEvaluationInstance(eSClone);

        setevaluationState(eSClone);
    }

    const setSearchPhraseCode = event => {
        const eSClone = deepCopy(evaluationState);
        eSClone.search.phrase.code = event.target.value.toUpperCase();

        setevaluationState(eSClone);
    }

    const setSearchPhraseSection = event => {
        const eSClone = deepCopy(evaluationState);
        eSClone.search.phrase.section = event.target.value;

        setevaluationState(eSClone);
    }

    const setSearchPhraseLink = event => {
        const eSClone = deepCopy(evaluationState);
        eSClone.search.phrase.link = event.target.value;

        setevaluationState(eSClone);
    }

    const setSearchPhraseFaculty = event => {
        const eSClone = deepCopy(evaluationState);
        eSClone.search.phrase.faculty = event.target.value;

        setevaluationState(eSClone);
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
        const eSClone = deepCopy(evaluationState);
        eSClone.search.results = constructSearchResultObject(offered_sections);

        setevaluationState(eSClone);
        hideLoadingScreen();
    }

    const setOfferedSectionInstructorState = (part, identifier, target, index, event) => {
        const eSClone = deepCopy(evaluationState);
        eSClone.search.results[part][identifier][`${part}_instructor_${target}`][index] = event.target.value;

        setevaluationState(eSClone);
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

    const delinkNonInstanceSections = async () => {
        const delinableSections = await getDelinkableSections(evaluationState.semester, evaluationState.year);

        if (delinableSections[0][1]) {
            for (let offeredSection of delinableSections) {
                if (!(offeredSection[0].semester === evaluationState.semester && offeredSection[0].year === evaluationState.year)) {
                    offeredSection[0].id = offeredSection[1];
                    offeredSection[0].lab_evaluation_link = "";
                    offeredSection[0].theory_evaluation_link = "";
                    await setOfferedSection(offeredSection[0]);
                }
            }
        }
    }

    const generateNewCode = usedCodes => {
        const base = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let code = "";

        while (usedCodes.includes(code) || code === "") {
            code = "";

            while (code.length < 6) {
                code = `${code}${base[Math.round(Math.random() * 61)]}`;
            }

        }

        return code;
    }

    const linkInstanceSections = async () => {
        const linkableSections = await getLinkableSections(evaluationState.semester, evaluationState.year);
        let index = 0;

        if (linkableSections[0][1]) {
            let usedCodes = [];

            for (let offeredSection of linkableSections) {
                console.log(index);
                offeredSection[0].id = offeredSection[1];

                for (let prefix of ["theory", "lab"]) {
                    if (offeredSection[0][`${prefix}_instructor_emails`].length !== 0) {
                        let code = generateNewCode(usedCodes);

                        while (true) {
                            let linkedSection = await getOfferedSections({ link_code: code });

                            if (linkedSection[0][1] !== null) {
                                usedCodes.push(code);
                            } else {
                                break;
                            }

                            code = generateNewCode(usedCodes);
                        }
                        usedCodes.push(code);
                        offeredSection[0][`${prefix}_evaluation_link`] = code;
                    }
                }
                index += 1;
                await setOfferedSection(offeredSection[0]);
            }

        }
    }

    const toggleInitializedState = async event => {
        showLoadingScreen("This may take some time, please do not close the window/browser");
        await delinkNonInstanceSections();
        console.log("linking");
        await linkInstanceSections();
        const eSClone = deepCopy(evaluationState);
        eSClone.initiated = !eSClone.initiated;
        eSClone.published = false;

        setevaluationState(eSClone);
        hideLoadingScreen();
    }

    const togglePublishedState = event => {
        if ((new Date()).getTime() > (new Date(`${evaluationState.dates.end} 11:59:59 PM`)).getTime() && evaluationState.initiated) {
            const eSClone = deepCopy(evaluationState);
            eSClone.published = !eSClone.published;

            setevaluationState(eSClone);

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

    const evalAdminControls = <SimpleCard title="Evaluation Admin Console">
        <div className="flex flex-row flex-wrap p-5 justify-between gap-3 mx-auto">
            <SecondaryButton customStyle="w-[calc(50%-0.75rem/2)]" text={"Set Questions"} link={`/evaluation/questions`} />
            <SecondaryButton customStyle="w-[calc(50%-0.75rem/2)]" text={"Set Dates"} clickFunction={toggleEvaluationDatesModal} />
            <SecondaryButton customStyle="w-[calc(50%-0.75rem/2)]" text={"Set Matrix"} link={"/evaluation/analysis"} />
            <SecondaryButton customStyle="w-[calc(50%-0.75rem/2)]" text={`${evaluationState.initiated ? "Unpublish Form" : "Publish Form"}`} clickFunction={toggleInitializedState} />
            <SecondaryButton customStyle="w-[calc(50%-0.75rem/2)]" text={`${evaluationState.published ? "Unpublish Results" : "Publish Results"}`} clickFunction={togglePublishedState} />
            <SecondaryButton customStyle="w-[calc(50%-0.75rem/2)]" text={"Save Settings"} clickFunction={saveEvaluationSettings} />
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
            <div className="w-[100%] md:w-[calc(40%-1.25rem)]">
                {semesterSelection.semesterSelect}
            </div>
            <div className="w-[100%] lg:w-[calc(60%-1.25rem)]">
                {user.uid === "36QlTRZox2Oc6QEqVFdSSK8eg4y1" && evaluationState.id ? evalAdminControls : <></>}
            </div>
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