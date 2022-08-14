import { textColorStyles, bgColorStyles, borderColorStyles } from "../../../utils/styles/styles";

const LineInput = ({ name, label, onChangeFn, value }) => {
    return <>
        <input type="text" name={name} className={`outline-none peer px-3 py-2 ${textColorStyles} ${bgColorStyles.contrast} border-b-2 ${borderColorStyles.simple} hover:border-blue-500 focus:border-blue-500`} onChange={onChangeFn} value={value} />
        <p className="text-xs peer-focus:text-blue-400 peer-hover:text-blue-400 mt-1 text-right">{label}</p>
    </>
}

export default LineInput;