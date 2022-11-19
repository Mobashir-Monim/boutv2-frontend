import PrimaryButton from "../Buttons/PrimaryButton";
import SimpleCard from "../Card/SimpleCard";
import { SelectInput } from "../FormInputs/LabeledInputs";

const SemesterSelect = ({ semesters, years, selection, updateSelection, confirmCall }) => {
    const optionsGenerator = (target, optionsContainer) => selection[target] ?
        optionsContainer :
        [`Select ${target.slice(0, 1).toUpperCase()}${target.slice(1)}`, ...optionsContainer];


    return <SimpleCard title={"Semester"}>
        <div className="p-5 flex flex-col gap-5">
            <SelectInput
                onChangeFn={event => updateSelection(event.target.value, "semester")}
                options={optionsGenerator("semester", semesters)}
                label="Semester"
                value={selection.semester}
            />
            <SelectInput
                onChangeFn={event => updateSelection(event.target.value, "year")}
                options={optionsGenerator("year", years)}
                label="Year"
                value={selection.year}
            />
            <PrimaryButton text={"Confirm Semester"} clickFunction={confirmCall} />
        </div>
    </SimpleCard>
}

export default SemesterSelect;