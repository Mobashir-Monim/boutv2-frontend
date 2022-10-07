import { inputStyles } from "../../utils/styles/styles";

export const DateInput = ({ name, label, onChangeFn, minDate, maxDate, value }) => {
    return <div className="flex flex-col">
        <input type="date" name={name} className={`${inputStyles.labeled.input}`} value={value ? value : ""} onChange={onChangeFn} min={minDate} max={maxDate} />
        <p className={`${inputStyles.labeled.label}`}>{label}</p>
    </div>
}

export const LineInput = ({ name, label, onChangeFn, value, customStyle = {}, placeholder }) => {
    return <div className={`flex flex-col ${customStyle.container}`}>
        <input type="text" name={name} className={`${inputStyles.labeled.input} ${customStyle.input}`} onChange={onChangeFn} value={value ? value : ""} placeholder={placeholder} />
        <p className={`${inputStyles.labeled.label} ${customStyle.label}`}>{label}</p>
    </div>
}

export const SelectInput = ({ name, label, options, onChangeFn, value, customStyle = {} }) => {
    let opts = null;

    if (Array.isArray(options)) {
        opts = options.map((opt, optIndex) => <option value={opt} key={`es-${optIndex}`}>{opt}</option>);
    } else {
        opts = Object.keys(options).map((opt, optIndex) => <option value={opt} key={`es-${optIndex}`}>{options[opt]}</option>);
    }

    return <div className={`flex flex-col ${customStyle.container}`}>
        <select name={name} className={`${inputStyles.labeled.input} ${customStyle.input}`} onChange={onChangeFn} value={value ? value : ""}>
            {opts}
        </select>
        <p className={`${inputStyles.labeled.label} ${customStyle.label}`}>{label}</p>
    </div>
}

export const TextInput = ({ label, onChangeFn, value, customStyle = {}, placeholder, disabled = false }) => {
    const resizeSelf = event => {
        if (event.key === "Backspace") {
            event.target.style.height = `40px`;
            setTimeout(() => {
                event.target.style.height = `${event.target.scrollHeight}px`;
            }, 100);
        } else {
            event.target.style.height = `${event.target.scrollHeight}px`;
        }
    }

    return <div className={`flex flex-col ${customStyle.container}`}>
        <textarea type="text" className={`resize-none ${inputStyles.labeled.input} ${customStyle.input} !rounded-xl`} onChange={onChangeFn} onKeyUp={resizeSelf} value={value ? value : ""} placeholder={placeholder} disabled={disabled ? "disabled" : ""} />
        <p className={`${inputStyles.labeled.label}`}>{label}</p>
    </div>
}