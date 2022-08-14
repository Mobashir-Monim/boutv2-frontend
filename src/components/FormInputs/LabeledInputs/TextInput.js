import { textColorStyles, bgColorStyles, borderColorStyles, transitioner } from "../../../utils/styles/styles";

const TextInput = ({ label, onChangeFn, value }) => {
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

export default TextInput;