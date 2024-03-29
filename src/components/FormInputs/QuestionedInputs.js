import QuestionCard from "../Card/QuestionCard";
import { inputStyles } from "../../utils/styles/styles";

export const DateInput = ({ name, question, onChangeFn, minDate, maxDate, value, required }) => {
    return <QuestionCard title={required ? <>{question}<div className="italic text-right text-red-400 font-bold text-[0.8rem]">[ Response Required ]</div></> : question}>
        <div className="flex flex-col max-w-[350px]">
            <input type="date" name={name} className={`${inputStyles.questioned.input}`} value={value} onChange={onChangeFn} min={minDate} max={maxDate} />
        </div>
    </QuestionCard>
}

export const LineInput = ({ name, question, onChangeFn, value, placeholder = "Your Response", max, min, required, preventPaste, customStyle = {} }) => {
    if (preventPaste) {
        preventPaste = event => { event.preventDefault(); return false; }
    } else {
        preventPaste = () => { }
    }


    return <QuestionCard title={required ? <>{question}<div className="italic text-right text-red-400 font-bold text-[0.8rem]">[ Response Required ]</div></> : question}>
        <div className="flex flex-col max-w-[700px]">
            <input type="text" name={name} onPaste={preventPaste} className={`${inputStyles.questioned.input} text-[0.9rem] ${customStyle.input}`} onChange={onChangeFn} value={value} placeholder={placeholder} maxLength={max} minLength={min} />
        </div>
    </QuestionCard>
}

export const SelectInput = ({ name, question, options, onChangeFn, required, customStyle = {} }) => {
    let opts = null;

    if (Array.isArray(options)) {
        opts = options.map((opt, optIndex) => <option value={opt} key={`es-${optIndex}`}>{opt}</option>);
    } else {
        opts = Object.keys(options).map((opt, optIndex) => <option value={opt} key={`es-${optIndex}`}>{options[opt]}</option>);
    }

    return <QuestionCard title={required ? <>{question}<div className={`italic text-right text-red-400 font-bold text-[0.8rem]`} customStyle={customStyle.card}>[ Response Required ]</div></> : question}>
        <div className="flex flex-col max-w-[350px]">
            <select name={name} className={`${inputStyles.questioned.input} ${customStyle.input}`} onChange={onChangeFn}>
                {opts}
            </select>
        </div>
    </QuestionCard>
}

export const TextInput = ({ question, onChangeFn, value, placeholder = "Your Response", required }) => {
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

    return <QuestionCard title={required ? <>{question}<div className="italic text-right text-red-400 font-bold text-[0.8rem]">[ Response Required ]</div></> : question}>
        <div className="flex flex-col max-w-[700px]">
            <textarea type="text" className={`resize-none ${inputStyles.questioned.input} text-[0.9rem]`} onChange={onChangeFn} onKeyUp={resizeSelf} value={value} placeholder={placeholder} />
        </div>
    </QuestionCard>
}

export const LinearInput = ({ question, onChangeFn, options, labels, identifier, required }) => {
    const [minOpt, maxOpt] = options;
    options = [];

    for (let i = minOpt; i <= maxOpt; i++) options.push(i);

    return <QuestionCard title={required ? <>{question}<div className="italic text-right text-red-400 font-bold text-[0.8rem]">[ Response Required ]</div></> : question}>
        <div className="flex flex-col md:flex-row mt-5 justify-center gap-5 md:gap-10 overflow-scroll no-scroll-bar">
            <span className={`${inputStyles.questioned.markers}`}>{labels[0]} <b>[{minOpt}]</b></span>
            <div className="flex flex-row justify-center my-auto gap-3 md:gap-10">
                {options.map((opt, optIndex) => <div className="flex flex-col text-center" key={`l-${identifier}-${optIndex}`}>
                    <span className={`${inputStyles.questioned.label}`}>{opt}</span>
                    <input type="radio" className="" value={opt} name={identifier} onChange={onChangeFn} />
                </div>)}
            </div>
            <span className={`${inputStyles.questioned.markers}`}>{labels[1]} <b>[{maxOpt}]</b></span>
        </div>
    </QuestionCard>
}

export const RadioInput = ({ question, onChangeFn, options, identifier, required }) => {
    return <QuestionCard title={required ? <>{question}<div className="italic text-right text-red-400 font-bold text-[0.8rem]">[ Response Required ]</div></> : question}>
        <div className="flex flex-col md:flex-row mt-5 justify-start gap-5 md:gap-10 overflow-scroll no-scroll-bar">
            <div className="flex flex-col my-auto gap-5">
                {options.map((opt, optIndex) => <div className="flex flex-row text-center gap-3" key={`l-${identifier}-${optIndex}`}>
                    <input type="radio" className="my-auto" value={opt} name={identifier} onChange={onChangeFn} />
                    <span className={`${inputStyles.questioned.label} !my-auto`}>{opt}</span>
                </div>)}
            </div>
        </div>
    </QuestionCard>
}

export const CheckboxInput = ({ question, onChangeFn, options, identifier, required, values, customStyle = {} }) => {
    let opts = null;

    if (Array.isArray(options)) {
        opts = options.map((opt, optIndex) => <div className="flex flex-row text-center gap-2 cursor-pointer" key={`l-${optIndex}`} value={opt} onClick={() => onChangeFn(opt)}>
            <input type="checkbox" className={`${inputStyles.labeled.input} ${inputStyles.labeled.checkbox} ${values.includes(opt) ? `${inputStyles.labeled.checked}` : ""} ${customStyle.input}`} checked={values.includes(opt)} onChange={() => { }} />
            <span className={`${inputStyles.labeled.label} !text-left !my-auto ${customStyle.label} order-1`}>{opt}</span>
        </div>);
    } else {
        opts = Object.keys(options).map((opt, optIndex) => <div className="flex flex-row text-center gap-2 cursor-pointer" key={`l-${optIndex}`} value={opt} onClick={() => onChangeFn(opt)}>
            <input type="checkbox" className={`${inputStyles.labeled.input} ${inputStyles.labeled.checkbox} ${values.includes(opt) ? `${inputStyles.labeled.checked}` : ""} ${customStyle.input}`} checked={values.includes(opt)} onChange={() => { }} />
            <span className={`${inputStyles.labeled.label} !text-left !my-auto ${customStyle.label} order-1`}>{options[opt]}</span>
        </div>);
    }

    // return <div className={`flex flex-col md:flex-row mt-5 justify-start gap-5 md:gap-10 overflow-scroll no-scroll-bar ${customStyle.container}`}>
    //     <div className={`flex flex-col my-auto gap-5 ${customStyle.labels_container}`}>
    //         {opts}
    //         {/* {opts.map((opt, optIndex) => <div className="flex flex-row text-center gap-3 cursor-pointer" key={`l-${name}-${optIndex}`} onClick={onChangeFn}>
    //             <input type="checkbox" className={`${inputStyles.labeled.input} ${inputStyles.labeled.checkbox} ${values.includes(opt) ? inputStyles.labeled.checked : ""} ${customStyle.input}`} checked={values.includes(opt)} name={name} onChange={() => { }} />
    //             <span className={`${inputStyles.labeled.label} !text-left !my-auto ${customStyle.label}`}>{opt}</span>
    //         </div>)} */}
    //     </div>
    //     <p className={`${inputStyles.labeled.label} ${customStyle.label}`}>{label}</p>
    // </div>
    return <QuestionCard title={required ? <>{question}<div className="italic text-right text-red-400 font-bold text-[0.8rem]">[ Response Required ]</div></> : question}>
        <div className="flex flex-col md:flex-row mt-5 justify-start gap-5 md:gap-10 overflow-scroll no-scroll-bar">
            <div className="flex flex-col my-auto gap-5">
                {opts}
                {/* {options.map((opt, optIndex) => <div className="flex flex-row text-center gap-3" key={`l-${identifier}-${optIndex}`}>
                    <input type="checkbox" className="my-auto text-left" value={opt} name={identifier} onChange={onChangeFn} />
                    <span className={`${inputStyles.questioned.label} !text-left !my-auto`}>{opt}</span>
                </div>)} */}
            </div>
        </div>
    </QuestionCard>
}

export const RadioGridInput = ({ question, onChangeFn, options, labels, identifier, required }) => {
    return <QuestionCard title={required ? <>{question}<div className="italic text-right text-red-400 font-bold text-[0.8rem]">[ Response Required ]</div></> : question}>
        <div className="flex flex-col mt-5 justify-center gap-2 overflow-scroll no-scroll-bar">
            {labels.map((label, lIndex) => <div className="flex flex-col md:flex-row mt-5 gap-3 md:gap-5 bg-blue-100/[0.6] dark:bg-blue-100/[0.3] -[1px] border-blue-400 px-2 md:px-5 py-5 md:justify-between rounded-xl" key={`radio-grid-${identifier}-${lIndex}`}>
                <span className={`${inputStyles.questioned.markers} md:w-[30%]`}>{label} </span>
                <div className="flex flex-row justify-start my-auto gap-3 md:gap-10 overflow-scroll no-scroll-bar">
                    {options.map((opt, optIndex) => <div className="flex flex-col text-center" key={`l-${identifier}-${optIndex}`}>
                        <span className={`${inputStyles.questioned.label}`}>{opt}</span>
                        <input type="radio" className="" value={opt} name={`${identifier}-${lIndex}`} onChange={event => onChangeFn(event, lIndex)} />
                    </div>)}
                </div>
            </div>)}
        </div>
    </QuestionCard>
}