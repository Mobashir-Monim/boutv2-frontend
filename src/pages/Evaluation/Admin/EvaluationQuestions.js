import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useEvaluationInstance } from "../../../utils/contexts/EvaluationContext";
import { deepClone } from "../../../utils/functions/deepClone"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../utils/contexts/AuthContext";
import { getEvlauationQuestions, setEvaluationQuestions } from "../../../db/remote/evaluation";

import SimpleCard from "../../../components/Card/SimpleCard";
import { SelectInput } from "../../../components/FormInputs/LabeledInputs";

import EvaluationQuestion from "./EvaluationQuestion";

import { buttonStyles } from "../../../utils/styles/styles";
import { pageLayoutStyles } from "../../../utils/styles/styles";

const questionTypes = {
    short: "Short",
    paragraph: "Paragraph",
    radio: "Multiple Choice",
    checkbox: "Checkbox",
    dropdown: "Dropdown",
    linear: "Linear scale",
    radioGrid: "Multiple choice Grid",
    checkboxGrid: "Checkbox Grid",
};

const defaultQuestionState = { display: "", type: "short", rows: [], columns: [], required: false };

const EvaluationQuestions = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { evaluationInstance } = useEvaluationInstance();
    const { id: evalInstId, year, semester, entity } = evaluationInstance;

    const [questionState, setQuestionState] = useState({
        year: year,
        semester: semester,
        entity: entity,
        evalInstId: evalInstId,
        theory_course: {},
        theory_faculty: {},
        lab_course: {},
        lab_faculty: {},
        part: "theory",
        type: "course",
        id: null
    });

    useEffect(() => {
        if (!evalInstId || !year || !semester || !entity || user.email !== "mobashir.monim@bracu.ac.bd")
            navigate("/evaluation");

        (async () => {
            let [evalQuestions, id] = await getEvlauationQuestions({ evalInstId });

            if (id) {
                evalQuestions = JSON.parse(evalQuestions.questions);
                const questionStateClone = deepClone(questionState);
                questionStateClone.theory_course = evalQuestions.theory.course;
                questionStateClone.theory_faculty = evalQuestions.theory.faculty;
                questionStateClone.lab_course = evalQuestions.lab.course;
                questionStateClone.lab_faculty = evalQuestions.lab.faculty;
                questionState.id = id;

                setQuestionState(questionStateClone);
            }

        })();
    }, []);

    const changeTargetPart = event => {
        const questionStateClone = deepClone(questionState);
        questionStateClone.part = event.target.value.toLowerCase();

        setQuestionState(questionStateClone);
    }

    const changeTargetType = event => {
        const questionStateClone = deepClone(questionState);
        questionStateClone.type = event.target.value.toLowerCase();

        setQuestionState(questionStateClone);
    }

    const getCurrentTarget = () => `${questionState.part}_${questionState.type}`;

    const addQuestion = () => {
        const questionStateClone = deepClone(questionState);
        let uuid = uuidv4();
        while (uuid in questionStateClone[getCurrentTarget()]) uuid = uuidv4();
        questionStateClone[getCurrentTarget()][uuid] = deepClone(defaultQuestionState);

        setQuestionState(questionStateClone);
    }

    const removeQuestion = identifier => {
        const questionStateClone = deepClone(questionState);
        delete questionStateClone[getCurrentTarget()][identifier];

        setQuestionState(questionStateClone);
    }

    const setRowValue = (event, index, identifier) => {
        const questionStateClone = deepClone(questionState);
        const rows = index >= questionStateClone[getCurrentTarget()][identifier].rows.length ?
            [...questionStateClone[getCurrentTarget()][identifier].rows.filter(r => r !== ""), ""] :
            questionStateClone[getCurrentTarget()][identifier].rows.filter(r => r !== "");
        rows[index] = event.target.value;
        questionStateClone[getCurrentTarget()][identifier].rows = rows;

        setQuestionState(questionStateClone);
    }

    const setColumnValue = (event, index, identifier) => {
        const questionStateClone = deepClone(questionState);
        const columns = index >= questionStateClone[getCurrentTarget()][identifier].columns.length ?
            [...questionStateClone[getCurrentTarget()][identifier].columns.filter(r => r !== ""), ""] :
            questionStateClone[getCurrentTarget()][identifier].columns.filter(r => r !== "");
        columns[index] = event.target.value;

        questionStateClone[getCurrentTarget()][identifier].columns = columns;

        setQuestionState(questionStateClone);
    }

    const changeQuestionType = (event, identifier) => {
        const questionStateClone = deepClone(questionState);
        questionStateClone[getCurrentTarget()][identifier].type = event.target.value;
        questionStateClone[getCurrentTarget()][identifier].rows = [];
        questionStateClone[getCurrentTarget()][identifier].columns = [];

        setQuestionState(questionStateClone);
    }

    const toggleRequired = identifier => {
        const questionStateClone = deepClone(questionState);
        questionStateClone[getCurrentTarget()][identifier].required = !questionStateClone[getCurrentTarget()][identifier].required;

        setQuestionState(questionStateClone);
    }
    const setQuestionDisplay = (event, identifier) => {
        const questionStateClone = deepClone(questionState);
        questionStateClone[getCurrentTarget()][identifier].display = event.target.value;

        setQuestionState(questionStateClone);
    };

    const formatQuestion = question => {
        if (question.type === "short" || question.type === "paragraph") {
            return { ...question, rows: [], columns: [] };
        } else if (question.type.includes("Grid")) {
            return {
                ...question,
                rows: [...question.rows.filter(r => r && r !== "")],
                columns: [...question.columns.filter(r => r && r !== "")]
            };
        } else if (question.type === "linear") {
            const rows = question.rows.filter(r => r && r !== "");
            const columns = question.columns.filter(r => r && r !== "");

            return { ...question, rows: [rows[0], rows[1]], columns: [columns[0], columns[1]] };
        } else {
            return { ...question, rows: [...question.rows.filter(r => r && r !== "")], columns: [] };
        }
    }

    const formatQuestions = () => {
        const questions = { theory: { course: {}, faculty: {} }, lab: { course: {}, faculty: {} } };
        let [part, type] = ["", ""];

        ["theory_course", "theory_faculty", "lab_course", "lab_faculty"].forEach(q => {
            [part, type] = q.split("_");

            for (let i in questionState[q]) {
                questions[part][type][i] = formatQuestion(questionState[q][i]);
            }
        });

        return questions;
    }

    const saveQuestions = async () => {
        const docRef = await setEvaluationQuestions({ questions: JSON.stringify(formatQuestions()), id: questionState.id, evalInstId: questionState.evalInstId });
        const questionStateClone = deepClone(questionState);
        questionState.id = docRef.id;
        setQuestionState(questionStateClone);
    }

    return <div className={`${pageLayoutStyles.scrollable} relative`}>
        <div className="flex flex-col lg:flex-row justify-between gap-10">
            <SimpleCard
                title={`Setting questions for ${questionState.year} ${questionState.semester}`}
                width="w-[100%] lg:w-[60%]"
            >
                <p className="mt-5">
                    Questions for
                    <span className="mx-2 text-red-600 dark:text-rose-400 font-bold">{questionState.part.toUpperCase()}</span>
                    evaluating
                    <span className="mx-2 text-indigo-600 dark:text-violet-400 font-bold">{questionState.type.toUpperCase()}</span>
                </p>
            </SimpleCard>
            <SimpleCard
                title={`Select Question target`}
                width="w-[100%] lg:w-[35%]"
            >
                <div className="mt-5 flex flex-col md:flex-row gap-5">
                    <div className="lg:w-[47%]">
                        <SelectInput name={"part"} label={"Questions Targetting"} options={["Theory", "Lab"]} onChangeFn={changeTargetPart} />
                    </div>
                    <div className="lg:w-[47%]">
                        <SelectInput name={"type"} label={"Questions Evaluating"} options={["Course", "Faculty"]} onChangeFn={changeTargetType} />
                    </div>
                </div>
            </SimpleCard>
        </div>

        <div className={`w-[100%] xl:w-[70%] flex flex-col gap-10 mx-auto pb-24 pt-10`}>
            {
                Object.keys(questionState[getCurrentTarget()])
                    .map(id => <EvaluationQuestion
                        qState={questionState[getCurrentTarget()][id]}
                        removeQuestion={removeQuestion} key={`q-${id}`}
                        identifier={id}
                        setRowValue={setRowValue}
                        setColumnValue={setColumnValue}
                        setQuestionDisplay={setQuestionDisplay}
                        changeQuestionType={changeQuestionType}
                        toggleRequired={toggleRequired}
                        questionTypes={questionTypes}
                    />)
            }
        </div>

        {/* <div className="fixed dark:bg-[#444]/[0.7] bottom-0 bg-[#ccc]/[0.7] w-[100%] h-[10vh] md:w-[5rem] md: left-0"> */}
        <div className="fixed dark:bg-[#444]/[0.7] bottom-0 bg-[#ccc]/[0.7] w-[100%] h-[10vh] md:w-[10rem] md:h-[5rem] md:rounded-full left-0 md:left-[calc(100%-10rem)]">
            <span
                className={`
                ${buttonStyles.primary} fixed 
                bottom-[calc(5vh-3.5rem/2)] md:bottom-[calc(5rem/2-3.5rem/2)]
                left-[calc(50vw-50px-3.5rem/2)] md:left-[calc(100%-9.2rem)]
                !rounded-full material-icons-round text-[3rem] !p-[0.25rem] w-[3.5rem] h-[3.5rem] flex flex-col justify-center`} onClick={addQuestion}
            >
                add
            </span>
            <span
                className={`
                ${buttonStyles.secondary} fixed 
                bottom-[calc(5vh-3.5rem/2)] md:bottom-[calc(5rem/2-3.5rem/2)]
                left-[calc(50vw-50px-3.5rem/2)] md:left-[calc(100%-4.2rem)]
                !rounded-full material-icons-round text-[3rem] !p-[0.25rem] w-[3.5rem] h-[3.5rem] flex flex-col justify-center`} onClick={saveQuestions}
            >
                done
            </span>
        </div>
    </div>
}

export default EvaluationQuestions;