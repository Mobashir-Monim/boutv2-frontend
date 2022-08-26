import { useState } from "react";
import { useAuth } from "../../utils/contexts/AuthContext";
import { getEvaluationInstance, getEvaluationSubmissions, setEvaluationInstance } from "../../db/remote/evaluation";
import { getOfferedSections, getOfferedSectionsByFaculty, setOfferedSection } from "../../db/remote/course";
import { borderColorStyles, cardStyles, pageLayoutStyles, transitioner } from "../../utils/styles/styles";
import { deepCopy } from "@firebase/util";
import { useEvaluationInstance } from "../../utils/contexts/EvaluationContext";

import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import { SelectInput, LineInput } from "../../components/FormInputs/LabeledInputs";
import CardHeader from "../../components/Headers/CardHeader";
import SimpleCard from "../../components/Card/SimpleCard";
import EvaluationDates from "./Admin/EvaluationDates";

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
        search: {
            phrase: {
                code: "",
                section: "",
                link: ""
            },
            results: { theory: {}, lab: {} }
        },
    });

    const fetchSubmissions = async (section_ids, part) => {
        let submissions = [];

        for (let i = 0; i < section_ids.length; i++) {
            if (section_ids.slice(i * 10, i + 10).length > 0) {
                const temp = await getEvaluationSubmissions({ offered_section_ids: section_ids.slice(i * 10, i + 10), part });

                console.log(temp);
                if (temp[0][1])
                    submissions = submissions.concat(temp);
            }
        }

        return submissions;
    }

    const fetchEvaluationInstance = async () => {
        if (semesters.includes(pageState.semester) && years.includes(pageState.year)) {
            const pageStateClone = deepCopy(pageState);
            let flag = false;
            let [evaluationInstance, id] = (await getEvaluationInstance({ year: pageState.year, semester: pageState.semester, entity: pageState.entity }))[0];

            if (!id && user.uid != "36QlTRZox2Oc6QEqVFdSSK8eg4y1") {
                await setEvaluationInstance({ year: pageState.year, semester: pageState.semester, entity: pageState.entity, initiated: false, published: false, start: "", end: "" });
                [evaluationInstance, id] = (await getEvaluationInstance({ year: pageState.year, semester: pageState.semester, entity: pageState.entity }))[0];
            }

            if (id) {
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
                setPageState({
                    ...pageState,
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

    const setSearchPhraseCode = event => {
        const pageStateClone = deepCopy(pageState);
        pageStateClone.search.phrase.code = event.target.value;

        setPageState(pageStateClone);
    }

    const setSearchPhraseSection = event => {
        const pageStateClone = deepCopy(pageState);
        pageStateClone.search.phrase.section = event.target.value;

        setPageState(pageStateClone);
    }

    const setSearchPhraseLink = event => {
        const pageStateClone = deepCopy(pageState);
        pageStateClone.search.phrase.link = event.target.value;

        setPageState(pageStateClone);
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
        const offered_sections = await getOfferedSections({
            year: pageState.year,
            semester: pageState.semester,
            code: pageState.search.phrase.code,
            section: pageState.search.phrase.section,
            link_code: pageState.search.phrase.link
        });
        const pageStateClone = deepCopy(pageState);
        pageStateClone.search.results = constructSearchResultObject(offered_sections);

        setPageState(pageStateClone);
    }

    const setOfferedSectionInstructorState = (part, identifier, target, index, event) => {
        const pageStateClone = deepCopy(pageState);
        pageStateClone.search.results[part][identifier][`${part}_instructor_${target}`][index] = event.target.value;

        setPageState(pageStateClone);
    }

    const setOfferedSectionInstructor = async identifier => {
        const docRef = await setOfferedSection({
            id: identifier,
            code: pageState.search.results.theory[identifier].code,
            section: pageState.search.results.theory[identifier].section,
            semester: pageState.semester,
            year: `${pageState.year}`,
            lab_evaluation_link: pageState.search.results.lab[identifier].lab_evaluation_link,
            theory_evaluation_link: pageState.search.results.theory[identifier].theory_evaluation_link,
            lab_instructor_names: pageState.search.results.lab[identifier].lab_instructor_names,
            lab_instructor_emails: pageState.search.results.lab[identifier].lab_instructor_emails,
            lab_instructor_initials: pageState.search.results.lab[identifier].lab_instructor_initials,
            theory_instructor_names: pageState.search.results.theory[identifier].theory_instructor_names,
            theory_instructor_emails: pageState.search.results.theory[identifier].theory_instructor_emails,
            theory_instructor_initials: pageState.search.results.theory[identifier].theory_instructor_initials,
        })

        console.log("updated");
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
        <div className="flex flex-col flex-wrap mt-2 justify-between gap-3 mx-auto">
            <div className="flex flex-row w-[100%]">
                <SecondaryButton text={"Set Questions"} customStyle="w-[50%] !rounded-r-none" link={`/evaluation/questions`} />
                <SecondaryButton text={"Set Dates"} customStyle="w-[50%] !rounded-l-none" clickFunction={toggleEvaluationDatesModal} />
            </div>
            <div className="flex flex-row w-[100%]">
                <SecondaryButton customStyle="w-[50%] !rounded-r-none" text={"Set Matrix"} link={"/evaluation/analysis"} />
                <SecondaryButton customStyle="w-[50%] !rounded-l-none" text={`${pageState.initiated ? "Unpublish Form" : "Publish Form"}`} clickFunction={toggleInitializedState} />
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

    return <div className={`${pageLayoutStyles.scrollable} flex flex-col gap-10`}>
        <div className="flex flex-col lg:flex-row gap-y-10 md:justify-between">
            <div className={`w-[100%] lg:w-[60%] ${cardStyles.simple}`}>
                <CardHeader title="Select evaluation semester" />
                <div className="flex flex-col mt-2 md:flex-row w-[100%] justify-between">
                    <div className="flex flex-col text-left md:w-[47%]">
                        <SelectInput name={"year"} label={"Evaluation Year"} options={years} onChangeFn={selectEvaluationYear} />
                    </div>
                    <div className="flex flex-col text-left md:w-[47%]">
                        <SelectInput name={"semester"} label={"Evaluation Semester"} options={semesters} onChangeFn={selectEvaluationSemester} />
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
            {user.uid === "36QlTRZox2Oc6QEqVFdSSK8eg4y1" && pageState.id ? evalAdminControls : <></>}
        </div>
        <div className={`${pageState.id ? "" : "hidden"} ${transitioner.simple}`}>
            <SimpleCard title={`Evaluation completion status of ${pageState.year} ${pageState.semester} course assignments`}>
                <div className="flex flex-col mt-5 overflow-scroll no-scroll-bar pb-5">
                    <div className={`flex flex-row min-w-[700px] border-y-2 px-3 py-2.5 ${borderColorStyles.simple} bg-[#eee] ${borderColorStyles.simple} dark:bg-[#333]`}>
                        <span className="inline-block w-[150px]">Course Code</span>
                        <span className="inline-block w-[150px] text-center">Course Section</span>
                        <span className="inline-block w-[200px] text-center">Submissions</span>
                        <span className="inline-block w-[200px] text-center">Evaluation Code</span>
                    </div>

                    {[pageState.offered_sections.theory, pageState.offered_sections.lab].map((courses, cIndex) =>
                        courses.map((course, courseIndex) => <div className={`flex flex-row min-w-[700px] px-3 py-2.5 border-b-[1px] ${borderColorStyles.simple} ${courseIndex % 2 ? "bg-[#eee] dark:bg-[#333]" : ""}`} key={`c-t-${courseIndex}`}>
                            <span className="inline-block w-[150px]">{course[0].code}</span>
                            <span className="inline-block w-[150px] text-center">{course[0].section}</span>
                            <span className="inline-block w-[200px] text-center">{cIndex === 1 ? pageState.submissions.lab.filter(x => x[0].offered_section_id === course[1]).length : pageState.submissions.theory.filter(x => x[0].offered_section_id === course[1]).length}</span>
                            <span className={`flex w-[200px] justify-center hover:text-orange-500 text-blue-500 dark:text-blue-400 cursor-copy ${transitioner.simple} font-['Source_Code_Pro']`} onClick={() => navigator.clipboard.writeText(cIndex === 1 ? course[0].lab_evaluation_link : course[0].theory_evaluation_link)}>
                                <span className="material-icons-round mr-3">content_copy</span>
                                {cIndex === 1 ? course[0].lab_evaluation_link : course[0].theory_evaluation_link}
                            </span>
                        </div>)
                    )}
                </div>
            </SimpleCard>
        </div>
        <div className={`${pageState.id ? "" : "hidden"} w-[100%] lg:w-[80%] ${transitioner.simple}`}>
            <SimpleCard title={`Evaluation Admin`}>
                <div className="flex flex-col mt-5">
                    <div className="flex flex-col gap-5 mb-10">
                        <div className="flex flex-col md:flex-row justify-between md:w-[100%] gap-5">
                            <div className="md:w-[47%]">
                                <LineInput label="Course Code" onChangeFn={setSearchPhraseCode} />
                            </div>
                            <div className="md:w-[47%]">
                                <LineInput label="Course Section" onChangeFn={setSearchPhraseSection} />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between md:w-[100%] gap-5">
                            <div className="md:w-[47%]">
                                <LineInput label="Evaluation Code" onChangeFn={setSearchPhraseLink} />
                            </div>
                            <div className="md:w-[47%] justify-center flex my-auto">
                                <PrimaryButton text="Fetch Data" customStyle={"w-[100%]"} type="button" clickFunction={searchOfferedSection} />
                            </div>
                        </div>
                    </div>
                    {Object.keys(pageState.search.results).map(part =>
                        Object.keys(pageState.search.results[part]).map(identifier => {
                            if (pageState.search.results[part][identifier][`${part}_instructor_names`].length === 0)
                                return <span className="hidden" key={identifier}></span>;

                            return <div className={`border-b-2 pb-10 ${borderColorStyles.simple} flex flex-col gap-10`} key={`${identifier}`}>
                                <div className={`flex flex-col md:flex-row mt-5 gap-7 md:gap-32`}>
                                    <div className="md:w-[20%] my-auto h-10 flex flex-col">
                                        <div>
                                            <p className={`border-b-2 ${borderColorStyles.simple} text-center`}>
                                                {pageState.search.results[part][identifier].code} - {pageState.search.results[part][identifier].section}
                                                <span className="text-blue-500 dark:text-blue-400 ml-2">{part[0].toUpperCase()}</span>
                                            </p>
                                            <p className="font-['Source_Code_Pro'] text-center text-blue-500 dark:text-blue-400">
                                                {pageState.search.results[part][identifier][`${part}_evaluation_link`]}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-[100%] md:w-[70%] gap-3 md:max-w-[400px]">
                                        {pageState.search.results[part][identifier][`${part}_instructor_emails`].map((_, iIndex) => <div key={`${identifier}-${iIndex}`}>
                                            <div className="flex flex-row">
                                                <div className="w-[65px]"><LineInput customStyle={{ input: "text-[0.9rem] border-2 border-b-[1px] border-r-[1px] rounded-tl-[10px]", label: "hidden" }} label="Initials" value={pageState.search.results[part][identifier][`${part}_instructor_initials`][iIndex]} onChangeFn={event => setOfferedSectionInstructorState(part, identifier, "initials", iIndex, event)} /></div>
                                                <div className="min-w-[200px] w-[100%]"><LineInput customStyle={{ input: "text-[0.9rem] border-2 border-b-[1px] border-l-[1px] rounded-tr-[10px]", label: "hidden" }} label="Name" value={pageState.search.results[part][identifier][`${part}_instructor_names`][iIndex]} onChangeFn={event => setOfferedSectionInstructorState(part, identifier, "names", iIndex, event)} /></div>
                                            </div>
                                            <div className="w-[100%]"><LineInput customStyle={{ input: "text-[0.9rem] border-2 border-2 border-t-[1px] rounded-b-[10px]", label: "hidden" }} label="Email" value={pageState.search.results[part][identifier][`${part}_instructor_emails`][iIndex]} onChangeFn={event => setOfferedSectionInstructorState(part, identifier, "emails", iIndex, event)} /></div>
                                        </div>)}
                                    </div>
                                </div>
                                <div className="my-auto">
                                    <PrimaryButton text="Save Changes" customStyle={"w-[100%]"} type="button" clickFunction={() => setOfferedSectionInstructor(identifier)} />
                                </div>
                            </div>
                        })
                    )}
                </div>
            </SimpleCard>
        </div>
        {user.uid === "36QlTRZox2Oc6QEqVFdSSK8eg4y1" ? evaluationDatesModal : <></>}
    </div>
}

export default Evaluation;