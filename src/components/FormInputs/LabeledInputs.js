import { inputStyles } from "../../utils/styles/styles";

export const DateInput = ({ name, label, onChangeFn, minDate, maxDate, value }) => {
    return <div className="flex flex-col">
        <input type="date" name={name} className={`${inputStyles.labeled.input}`} value={value} onChange={onChangeFn} min={minDate} max={maxDate} />
        <p className={`${inputStyles.labeled.label}`}>{label}</p>
    </div>
}

export const LineInput = ({ name, label, onChangeFn, value }) => {
    return <div className="flex flex-col">
        <input type="text" name={name} className={`${inputStyles.labeled.input}`} onChange={onChangeFn} value={value} />
        <p className={`${inputStyles.labeled.label}`}>{label}</p>
    </div>
}

export const SelectInput = ({ name, label, options, onChangeFn }) => {
    let opts = null;

    if (Array.isArray(options)) {
        opts = options.map((opt, optIndex) => <option value={opt} key={`es-${optIndex}`}>{opt}</option>);
    } else {
        opts = Object.keys(options).map((opt, optIndex) => <option value={opt} key={`es-${optIndex}`}>{options[opt]}</option>);
    }

    return <div className="flex flex-col">
        <select name={name} className={`${inputStyles.labeled.input}`} onChange={onChangeFn}>
            {opts}
        </select>
        <p className={`${inputStyles.labeled.label}`}>{label}</p>
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
        <textarea type="text" className={`resize-none ${inputStyles.labeled.input}`} onChange={onChangeFn} onKeyUp={resizeSelf} value={value} />
        <p className={`${inputStyles.labeled.label}`}>{label}</p>
    </div>
}