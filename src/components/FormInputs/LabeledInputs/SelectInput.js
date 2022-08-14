import { textColorStyles } from "../../../utils/styles/styles";
import { bgColorStyles } from "../../../utils/styles/styles";
import { borderColorStyles } from "../../../utils/styles/styles";

const SelectInput = ({ name, label, options, onChangeFn }) => {
    let opts = null;

    if (Array.isArray(options)) {
        opts = options.map((opt, optIndex) => <option value={opt} key={`es-${optIndex}`}>{opt}</option>);
    } else {
        opts = Object.keys(options).map((opt, optIndex) => <option value={opt} key={`es-${optIndex}`}>{options[opt]}</option>);
    }

    return <div className="flex flex-col">
        <select name={name} className={` peer px-3 py-2 outline-none ${textColorStyles} ${bgColorStyles.contrast} border-b-2 ${borderColorStyles.simple} hover:border-blue-500  focus:border-blue-500`} onChange={onChangeFn}>
            {opts}
        </select>
        <p className="text-xs peer-focus:text-blue-400 peer-hover:text-blue-400 mt-1 text-right">{label}</p>
    </div>
}

export default SelectInput;