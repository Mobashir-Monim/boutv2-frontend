import { useState } from "react";
import SemesterSelect from "../../components/Utils/SemesterSelect";

const defaultYears = Array((new Date()).getUTCFullYear() - 2020 + 1).fill().map((_, idx) => `${2020 + idx}`);
const defaultSemesters = ["Spring", "Summer", "Fall"];

export const useSemesterSelect = (confirmCallback, years = defaultYears) => {
    const [yearsValues, _] = useState(years);
    const [selection, setSelection] = useState({ semester: null, year: null });

    const updateSelection = (value, target) => setSelection({ ...selection, [target]: value });
    const hasSelected = _ => selection.year && selection.semester;
    const isValidSelection = _ => yearsValues.includes(selection.year) && defaultSemesters.includes(selection.semester);
    const onConfirm = _ => confirmCallback();

    return {
        values: selection,
        updateSelection,
        hasSelected,
        isValidSelection,
        onConfirm,
        semesterSelect: <SemesterSelect
            semesters={defaultSemesters}
            years={years}
            updateSelection={updateSelection}
            selection={selection}
            confirmCall={onConfirm}
        />
    }
}