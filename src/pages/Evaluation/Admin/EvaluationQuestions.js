import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import SimpleCard from "../../../components/Card/SimpleCard";
import SelectInput from "../../../components/FormInputs/LabeledInputs/SelectInput";
import TextInput from "../../../components/FormInputs/LabeledInputs/TextInput";
import LineInput from "../../../components/FormInputs/LabeledInputs/LineInput";

import { buttonStyles } from "../../../utils/styles/styles";
import { cardStyles } from "../../../utils/styles/styles";
import { transitioner } from "../../../utils/styles/styles";
import { deepClone } from "../../../utils/functions/deepClone"

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

const EvaluationQuestion = ({ qState, identifier, updateQuestion, removeQuestion }) => {
    const [question, setQuestion] = useState(qState);

    useEffect(() => {
        updateQuestion(identifier, question);
    }, [question, identifier, updateQuestion])

    const getConfigRows = () => {
        if (question.type === "short" || question.type === "paragraph") {
            return <></>;
        } else if (question.type.includes("Grid")) {
            return getGridRow();
        } else if (question.type === "linear") {
            return getLinerRow();
        } else {
            return getChoiceRow();
        }
    }

    const getChoiceRow = () => {
        const rows = [...question.rows, ""];

        return <div className="flex flex-col text-[0.9rem]">
            {rows.map((row, rowIndex) => {
                return <div className="flex flex-row gap-3" key={`r-${rowIndex}`}>
                    <div className="w-[60%] flex flex-col">
                        <LineInput value={row} onChangeFn={event => setRowValue(event, rowIndex)} label={`Option ${rowIndex + 1}`} />
                    </div>
                </div>
            })}
        </div>
    }

    const getGridRow = () => {
        const rows = [...question.rows.filter(r => r !== ""), ""];
        const columns = [...question.columns.filter(c => c !== ""), ""];

        return <div className="flex flex-row text-[0.9rem] gap-5">
            <div className="w-[45%] flex flex-col">
                {rows.map((row, rowIndex) => {
                    return <div className="w-[100%] flex flex-col" key={`r-${rowIndex}`}>
                        <LineInput value={row} onChangeFn={event => setRowValue(event, rowIndex)} label={`Row ${rowIndex + 1}`} />
                    </div>
                })}
            </div>
            <div className="w-[30%] flex flex-col">
                {columns.map((column, columnIndex) => {
                    return <div className="w-[100%] flex flex-col" key={`c-${columnIndex}`}>
                        <LineInput value={column} onChangeFn={event => setColumnValue(event, columnIndex)} label={`Column ${columnIndex + 1}`} />
                    </div>
                })}
            </div>
        </div>
    }

    const getLinerRow = () => {
        return <div className="flex flex-row gap-5">
            <div className="flex flex-col w-[30%]">
                <LineInput value={question.rows[0]} onChangeFn={event => setRowValue(event, 0)} label={`Label at first value`} />
            </div>
            <div className="flex flex-col w-[10%]">
                <LineInput value={question.columns[0]} onChangeFn={event => setColumnValue(event, 0)} label={`Range from`} />
            </div>
            <div className="flex flex-col w-[10%]">
                <LineInput value={question.columns[1]} onChangeFn={event => setColumnValue(event, 1)} label={`Range to`} />
            </div>
            <div className="flex flex-col w-[30%]">
                <LineInput value={question.rows[1]} onChangeFn={event => setRowValue(event, 1)} label={`Label at last value`} />
            </div>
        </div>
    }

    const setRowValue = (event, index) => {
        const rows = index >= question.rows.length ? [...question.rows.filter(r => r !== ""), ""] : question.rows.filter(r => r !== "");
        rows[index] = event.target.value;

        setQuestion({ ...question, rows: rows });
    }

    const setColumnValue = (event, index) => {
        const columns = index >= question.columns.length ? [...question.columns.filter(r => r !== ""), ""] : question.columns.filter(r => r !== "");
        columns[index] = event.target.value;

        setQuestion({ ...question, columns: columns });
    }

    const changeQuestionType = event => {
        setQuestion({ ...question, type: event.target.value, rows: [], columns: [] })
    }

    const toggleRequired = () => setQuestion({ ...question, required: !question.required });
    const setQuestionDisplay = event => {
        setQuestion({ ...question, display: event.target.value })
        // setQuestion({ ...question, display: event.target.innerText })
    };

    return <div className={`${cardStyles.simple} flex flex-col gap-5`}>
        <div className="flex flex-col md:flex-row justify-between gap-5">
            <div className="w-[100%] lg:w-[70%]">
                <TextInput label="Question" onChangeFn={setQuestionDisplay} value={question.display} />
            </div>
            <div className="w-[100%] lg:w-[20%]">
                <SelectInput name={"type"} label={"Question Type"} options={questionTypes} onChangeFn={changeQuestionType} />
            </div>
        </div>

        {getConfigRows()}

        <div className="flex flex-col md:flex-row justify-end gap-3 mt-5">
            <p className="my-auto">Required</p>
            <div className={`w-[40px] h-[20px] bg-zinc-300 my-auto rounded-full flex flex-row relative ${question.required ? "bg-blue-200" : "bg-zinc-300"} ${transitioner.simple} drop-shadow-md`} onClick={toggleRequired}>
                <span className={`${transitioner.simple} h-[20px] ${question.required ? "w-[20px]" : "w-[0px]"}`}></span>
                <span className={`w-[20px] h-[20px] absoulute block rounded-full ${transitioner.simple} ${question.required ? "bg-blue-400" : "bg-zinc-400"} drop-shadow-md`}></span>
            </div>
            <span className={`material-icons-round ${buttonStyles.primary} text-[1.5rem] !p-2 w-[2.5rem] h-[2.5rem] rounded-full`} onClick={() => removeQuestion(identifier)}>delete</span>
        </div>
    </div>
}

const EvaluationQuestions = () => {
    const { year, semester } = useParams();

    const [questionState, setQuestionState] = useState({
        year: year,
        semester: semester,
        theory_course: {},
        theory_faculty: {},
        lab_course: {},
        lab_faculty: {},
        show_theory_course: true,
        show_theory_faculty: false,
        show_lab_course: false,
        show_lab_faculty: false,
        part: "theory",
        type: "course",

    });

    const changeTargetPart = event => {
        const questionStateClone = deepClone(questionState);
        questionStateClone.part = event.target.value.toLowerCase();
        questionStateClone[`show_${event.target.value.toLowerCase()}_${questionState.type}`] = true;
        questionStateClone[`show_${getCurrentTarget()}`] = false;

        setQuestionState(questionStateClone);
    }

    const changeTargetType = event => {
        const questionStateClone = deepClone(questionState);
        questionStateClone.type = event.target.value.toLowerCase();
        questionStateClone[`show_${questionState.part}_${event.target.value.toLowerCase()}`] = true;
        questionStateClone[`show_${getCurrentTarget()}`] = false;

        setQuestionState(questionStateClone);
    }

    const getCurrentTarget = () => `${questionState.part}_${questionState.type}`;

    const updateQuestion = (identifier, state) => {
        const questionStateClone = deepClone(questionState);
        questionStateClone[getCurrentTarget()][identifier] = state;

        setQuestionState(questionStateClone);
    }

    const addQuestion = () => {
        const questionStateClone = deepClone(questionState);
        let uuid = uuidv4();
        while (uuid in questionStateClone[getCurrentTarget()]) uuid = uuidv4();
        questionStateClone[getCurrentTarget()][uuid] = defaultQuestionState;

        setQuestionState(questionStateClone);
    }

    const removeQuestion = identifier => {
        const questionStateClone = deepClone(questionState);
        delete questionStateClone[getCurrentTarget()][identifier];

        setQuestionState(questionStateClone);
    }

    return <div className="w-[90%] mx-auto min-h-[95vh] relative">
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

        <div className={`w-[100%] xl:w-[70%] flex flex-col gap-10 mx-auto py-24`}>
            {
                Object.keys(questionState[getCurrentTarget()])
                    .map(id => <EvaluationQuestion
                        qState={questionState[getCurrentTarget()][id]}
                        identifier={id} updateQuestion={updateQuestion}
                        removeQuestion={removeQuestion} key={`q-${id}`}
                    />)
            }
        </div>

        <div className="fixed bg-[#444]/[0.7] bottom-0 dark:bg-[#ccc]/[0.7] w-[100%] h-[10vh] left-0">
            <span className={`${buttonStyles.primary} fixed bottom-[calc(5vh-3.5rem/2)] left-[calc(50vw-50px-3.5rem/2)] lg:left-[calc(50vw-3.5rem/2)] !rounded-full material-icons-round text-[3rem] !p-[0.25rem] w-[3.5rem] h-[3.5rem] flex flex-col justify-center`} onClick={addQuestion}>
                add
            </span>
            <span className={`${buttonStyles.secondary} fixed bottom-[calc(5vh-3.5rem/2)] left-[calc(50vw+50px-3.5rem/2)] lg:left-[calc(50vw+100px-3.5rem/2)] !rounded-full material-icons-round text-[3rem] !p-[0.25rem] w-[3.5rem] h-[3.5rem] flex flex-col justify-center`} onClick={addQuestion}>
                done
            </span>
        </div>
    </div>
}

export default EvaluationQuestions;