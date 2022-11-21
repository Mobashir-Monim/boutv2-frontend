import { TextInput } from "../../../components/FormInputs/LabeledInputs";
import { LineInput } from "../../../components/FormInputs/LabeledInputs";
import { SelectInput } from "../../../components/FormInputs/LabeledInputs";

import { borderColorStyles, cardStyles } from "../../../utils/styles/styles";
import { transitioner } from "../../../utils/styles/styles";
import { buttonStyles } from "../../../utils/styles/styles";

const EvaluationQuestion = ({ qState, identifier, removeQuestion, setRowValue, setColumnValue, setQuestionDisplay, changeQuestionType, toggleRequired, questionTypes }) => {
    const getConfigRows = () => {
        if (qState.type === "short" || qState.type === "paragraph") {
            return <></>;
        } else if (qState.type.includes("Grid")) {
            return getGridRow();
        } else if (qState.type === "linear") {
            return getLinerRow();
        } else {
            return getChoiceRow();
        }
    }

    const getChoiceRow = () => {
        const rows = [...qState.rows, ""];

        return <div className="flex flex-col gap-5 text-[0.9rem]">
            {rows.map((row, rowIndex) => {
                return <div className="flex flex-row gap-3" key={`r-${rowIndex}`}>
                    <LineInput
                        value={row}
                        onChangeFn={event => setRowValue(event, rowIndex, identifier)}
                        label={`Option ${rowIndex + 1}`}
                        customStyle={{ container: "w-[60%] flex flex-col" }}
                    />
                </div>
            })}
        </div>
    }

    const getGridRow = () => {
        const rows = [...qState.rows.filter(r => r !== ""), ""];
        const columns = [...qState.columns.filter(c => c !== ""), ""];

        return <div className="flex flex-row text-[0.9rem]">
            <div className="w-[100%] flex flex-col gap-5">
                {rows.map((row, rowIndex) => {
                    return <div className="flex flex-row" key={`r-${rowIndex}`}>
                        <LineInput
                            value={row}
                            onChangeFn={event => setRowValue(event, rowIndex, identifier)}
                            label={`Row ${rowIndex + 1}`}
                            customStyle={{
                                container: "w-[60%] flex flex-col",
                                input: `rounded-r-none border-r-2 ${borderColorStyles.simple}`
                            }}
                        />
                        <LineInput
                            key={`c-${rowIndex}`}
                            value={columns[rowIndex]}
                            onChangeFn={event => setColumnValue(event, rowIndex, identifier)}
                            label={`Column ${rowIndex + 1}`}
                            customStyle={{
                                container: "w-[20%] flex flex-col",
                                input: `rounded-l-none border-l-2 ${borderColorStyles.simple}`
                            }}
                        />
                    </div>
                })}
            </div>
        </div>
    }

    const getLinerRow = () => {
        return <div className="flex flex-row gap-5 text-[0.9rem]">
            <div className="flex flex-col w-[30%]">
                <LineInput value={qState.rows[0]} onChangeFn={event => setRowValue(event, 0, identifier)} label={`Label at first value`} />
            </div>
            <div className="flex flex-col w-[10%]">
                <LineInput value={qState.columns[0]} onChangeFn={event => setColumnValue(event, 0, identifier)} label={`Range from`} />
            </div>
            <div className="flex flex-col w-[10%]">
                <LineInput value={qState.columns[1]} onChangeFn={event => setColumnValue(event, 1, identifier)} label={`Range to`} />
            </div>
            <div className="flex flex-col w-[30%]">
                <LineInput value={qState.rows[1]} onChangeFn={event => setRowValue(event, 1, identifier)} label={`Label at last value`} />
            </div>
        </div>
    }

    return <div className={`${cardStyles.simple} flex flex-col gap-5 p-5`}>
        <div className="flex flex-col md:flex-row justify-between gap-5 text-[0.9rem]">
            <TextInput
                label="Question"
                onChangeFn={event => setQuestionDisplay(event, identifier)}
                value={qState.display}
                customStyle={{
                    container: "w-[100%] lg:w-[calc(80%-1.25rem/2)]",
                    label: "!-order-1 !text-left pl-2 mb-2 !text-[1.2rem]"
                }}
            />
            <SelectInput
                name={"type"}
                label={"Type"}
                options={questionTypes}
                onChangeFn={event => changeQuestionType(event, identifier)}
                value={qState.type}
                customStyle={{
                    container: "w-[100%] lg:w-[calc(20%-1.25rem/2)]",
                    label: "!-order-1 !text-left pl-2 mb-2 !text-[1.2rem]"
                }}
            />
        </div>

        {getConfigRows()}

        <div className="flex flex-col md:flex-row justify-end gap-3">
            <p className="my-auto">Required</p>
            <div className={`w-[40px] h-[20px] bg-zinc-300 my-auto rounded-full flex flex-row relative ${qState.required ? "bg-blue-200" : "bg-zinc-300"} ${transitioner.simple} drop-shadow-md`} onClick={() => toggleRequired(identifier)}>
                <span className={`${transitioner.simple} h-[20px] ${qState.required ? "w-[20px]" : "w-[0px]"}`}></span>
                <span className={`w-[20px] h-[20px] absoulute block rounded-full ${transitioner.simple} ${qState.required ? "bg-blue-400" : "bg-zinc-400"} drop-shadow-md`}></span>
            </div>
            <span className={`material-icons-round ${buttonStyles.primary} text-[1.5rem] !p-2 w-[2.5rem] h-[2.5rem] !rounded-full`} onClick={() => removeQuestion(identifier)}>delete</span>
        </div>
    </div>
}

export default EvaluationQuestion;