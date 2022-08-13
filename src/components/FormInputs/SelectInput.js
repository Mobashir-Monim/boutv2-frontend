import { textColorStyles } from "../../utils/styles";
import { bgColorStyles } from "../../utils/styles";
import { borderColorStyles } from "../../utils/styles";

const SelectInput = ({ name, label, options, onChangeFn }) => {
    return <>
        <select name={name} className={` peer px-3 py-2 ${textColorStyles} ${bgColorStyles.contrast} border-b-2 ${borderColorStyles.simple} hover:border-blue-500`} onChange={onChangeFn}>
            {options.map((opt, optIndex) => <option value={opt} key={`es-${optIndex}`}>{opt}</option>)}
        </select>
        <p className="text-xs peer-focus:text-blue-400 peer-hover:text-blue-400 mt-1 text-right">{label}</p>
    </>
}

export default SelectInput;