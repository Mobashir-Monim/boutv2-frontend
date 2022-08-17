import { inputStyles } from "../../utils/styles/styles";

export const DateInput = ({ name, onChangeFn, minDate, maxDate, value }) => {
    return <div className="flex flex-col">
        <input type="date" name={name} className={`${inputStyles.minified.input}`} value={value} onChange={onChangeFn} min={minDate} max={maxDate} />
    </div>
}

export const LineInput = ({ name, onChangeFn, value }) => {
    return <div className="flex flex-col">
        <input type="text" name={name} className={`${inputStyles.minified.input}`} onChange={onChangeFn} value={value} />
    </div>
}

export const SelectInput = ({ name, options, onChangeFn }) => {
    let opts = null;

    if (Array.isArray(options)) {
        opts = options.map((opt, optIndex) => <option value={opt} key={`es-${optIndex}`}>{opt}</option>);
    } else {
        opts = Object.keys(options).map((opt, optIndex) => <option value={opt} key={`es-${optIndex}`}>{options[opt]}</option>);
    }

    return <div className="flex flex-col">
        <select name={name} className={`${inputStyles.minified.input}`} onChange={onChangeFn}>
            {opts}
        </select>
    </div>
}

export const TextInput = ({ onChangeFn, value }) => {
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
        <textarea type="text" className={`resize-none ${inputStyles.minified.input}`} onChange={onChangeFn} onKeyUp={resizeSelf} value={value} />
    </div>
}