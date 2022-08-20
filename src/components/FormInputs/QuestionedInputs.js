import QuestionCard from "../Card/QuestionCard";
import { inputStyles } from "../../utils/styles/styles";

export const DateInput = ({ name, question, onChangeFn, minDate, maxDate, value }) => {
    return <QuestionCard title={question}>
        <div className="flex flex-col max-w-[350px]">
            <input type="date" name={name} className={`${inputStyles.questioned.input}`} value={value} onChange={onChangeFn} min={minDate} max={maxDate} />
        </div>
    </QuestionCard>
}

export const LineInput = ({ name, question, onChangeFn, value }) => {
    return <QuestionCard title={question}>
        <div className="flex flex-col max-w-[350px]">
            <input type="text" name={name} className={`${inputStyles.questioned.input} text-[0.9rem]`} onChange={onChangeFn} value={value} />
        </div>
    </QuestionCard>
}

export const SelectInput = ({ name, question, options, onChangeFn }) => {
    let opts = null;

    if (Array.isArray(options)) {
        opts = options.map((opt, optIndex) => <option value={opt} key={`es-${optIndex}`}>{opt}</option>);
    } else {
        opts = Object.keys(options).map((opt, optIndex) => <option value={opt} key={`es-${optIndex}`}>{options[opt]}</option>);
    }

    return <QuestionCard title={question}>
        <div className="flex flex-col max-w-[350px]">
            <select name={name} className={`${inputStyles.questioned.input}`} onChange={onChangeFn}>
                {opts}
            </select>
        </div>
    </QuestionCard>
}

export const TextInput = ({ question, onChangeFn, value }) => {
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

    return <QuestionCard title={question}>
        <div className="flex flex-col">
            <textarea type="text" className={`resize-none ${inputStyles.questioned.input} text-[0.9rem]`} onChange={onChangeFn} onKeyUp={resizeSelf} value={value} />
        </div>
    </QuestionCard>
}

export const LinearInput = ({ question, onChangeFn, options, labels, identifier }) => {
    const [minOpt, maxOpt] = options;
    options = [];

    for (let i = minOpt; i <= maxOpt; i++) options.push(i);

    return <QuestionCard title={question}>
        <div className="flex flex-col md:flex-row mt-5 justify-center gap-5 md:gap-10 overflow-scroll">
            <span className={`${inputStyles.questioned.markers}`}>{labels[0]} <b>[{minOpt}]</b></span>
            <div className="flex flex-row justify-center my-auto gap-3 md:gap-10">
                {options.map((opt, optIndex) => <div className="flex flex-col text-center" key={`l-${identifier}-${optIndex}`}>
                    <span className={`${inputStyles.questioned.label}`}>{opt}</span>
                    <input type="radio" className="" value={opt} name={identifier} />
                </div>)}
            </div>
            <span className={`${inputStyles.questioned.markers}`}>{labels[1]} <b>[{maxOpt}]</b></span>
        </div>
    </QuestionCard>
}

export const RadioInput = ({ question, onChangeFn, options, identifier }) => {
    return <QuestionCard title={question}>
        <div className="flex flex-col md:flex-row mt-5 justify-start gap-5 md:gap-10 overflow-scroll">
            <div className="flex flex-col my-auto gap-5">
                {options.map((opt, optIndex) => <div className="flex flex-row text-center gap-3" key={`l-${identifier}-${optIndex}`}>
                    <input type="radio" className="my-auto" value={opt} name={identifier} />
                    <span className={`${inputStyles.questioned.label} !my-auto`}>{opt}</span>
                </div>)}
            </div>
        </div>
    </QuestionCard>
}

export const CheckboxInput = ({ question, onChangeFn, options, identifier }) => {
    return <QuestionCard title={question}>
        <div className="flex flex-col md:flex-row mt-5 justify-start gap-5 md:gap-10 overflow-scroll">
            <div className="flex flex-col my-auto gap-5">
                {options.map((opt, optIndex) => <div className="flex flex-row text-center gap-3" key={`l-${identifier}-${optIndex}`}>
                    <input type="checkbox" className="my-auto text-left" value={opt} name={identifier} />
                    <span className={`${inputStyles.questioned.label} !text-left !my-auto`}>{opt}</span>
                </div>)}
            </div>
        </div>
    </QuestionCard>
}