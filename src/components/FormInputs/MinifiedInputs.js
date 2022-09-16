import { inputStyles } from "../../utils/styles/styles";

export const DateInput = ({ name, onChangeFn, minDate, maxDate, value, customStyle }) => {
    return <input type="date" name={name} className={`${inputStyles.minified.input} ${customStyle}`} value={value} onChange={onChangeFn} min={minDate} max={maxDate} />
}

export const LineInput = ({ name, onChangeFn, value, customStyle }) => {
    return <input type="text" name={name} className={`${inputStyles.minified.input} ${customStyle}`} onChange={onChangeFn} value={value} />
}

export const SelectInput = ({ name, options, onChangeFn, customStyle }) => {
    let opts = null;

    if (Array.isArray(options)) {
        opts = options.map((opt, optIndex) => <option value={opt} key={`es-${optIndex}`}>{opt}</option>);
    } else {
        opts = Object.keys(options).map((opt, optIndex) => <option value={opt} key={`es-${optIndex}`}>{options[opt]}</option>);
    }

    return <select name={name} className={`${inputStyles.minified.input} ${customStyle}`} onChange={onChangeFn}>
        {opts}
    </select>
}

export const TextInput = ({ onChangeFn, value, customStyle }) => {
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

    return <textarea type="text" className={`resize-none ${inputStyles.minified.input} ${customStyle}`} onChange={onChangeFn} onKeyUp={resizeSelf} value={value} />
}