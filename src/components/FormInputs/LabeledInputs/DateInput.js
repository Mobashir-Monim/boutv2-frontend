import { textColorStyles, bgColorStyles, borderColorStyles } from "../../../utils/styles/styles";

const DateInput = ({ name, label, onChangeFn, minDate, maxDate, value }) => {
    return <>
        <input type="date" name={name} className={`outline-none peer px-3 py-2 ${textColorStyles} ${bgColorStyles.contrast} border-b-2 ${borderColorStyles.simple} hover:border-blue-500 focus:border-blue-500`} value={value} onChange={onChangeFn} min={minDate} max={maxDate} />
        <p className="text-xs peer-focus:text-blue-400 peer-hover:text-blue-400 mt-1 text-right">{label}</p>
    </>
}

export default DateInput;