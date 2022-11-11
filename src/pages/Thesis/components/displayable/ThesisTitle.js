import { borderColorStyles } from "../../../../utils/styles/styles";

const ThesisTitle = ({ application }) => {
    return <div>
        <h4 className={`border-b-4 mb-2 ${borderColorStyles.simple}`}>Title</h4>
        <p className="text-justify text-[0.9rem] px-2">{application.title}</p>
    </div>;
}

export default ThesisTitle;