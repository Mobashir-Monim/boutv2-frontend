import { textColorStyles, bgColorStyles, borderColorStyles, transitioner } from "../../utils/styles/styles";

export const DateInput = ({ name, label, onChangeFn, minDate, maxDate, value }) => {
    return <>
        <input type="date" name={name} className={`outline-none peer px-3 py-2 ${textColorStyles} ${bgColorStyles.contrast} border-b-2 ${borderColorStyles.simple} hover:border-blue-500 focus:border-blue-500`} value={value} onChange={onChangeFn} min={minDate} max={maxDate} />
        <p className="text-xs peer-focus:text-blue-400 peer-hover:text-blue-400 mt-1 text-right">{label}</p>
    </>
}

export const LineInput = ({ name, label, onChangeFn, value }) => {
    return <>
        <input type="text" name={name} className={`outline-none peer px-3 py-2 ${textColorStyles} ${bgColorStyles.contrast} border-b-2 ${borderColorStyles.simple} hover:border-blue-500 focus:border-blue-500`} onChange={onChangeFn} value={value} />
        <p className="text-xs peer-focus:text-blue-400 peer-hover:text-blue-400 mt-1 text-right">{label}</p>
    </>
}

export const SelectInput = ({ name, label, options, onChangeFn }) => {
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

export const TextInput = ({ label, onChangeFn, value }) => {
    const resizeSelf = event => {
        if (event.keyCode === 8) {
            event.target.style.height = `40px`;
            setTimeout(() => {
                event.target.style.height = `${event.target.scrollHeight}px`;
            }, 100);
        } else {
            event.target.style.height = `${event.target.scrollHeight}px`;
        }
    }

    return <div className="flex flex-col">
        <textarea type="text" className={`resize-none outline-none peer px-3 py-2 ${textColorStyles} ${bgColorStyles.contrast} border-b-2 ${borderColorStyles.simple} hover:border-blue-500 focus:border-blue-500 ${transitioner.simple}`} onChange={onChangeFn} onKeyUp={resizeSelf} value={value} />
        <p className="text-xs peer-focus:text-blue-400 peer-hover:text-blue-400 mt-1 text-right">{label}</p>
    </div>
}