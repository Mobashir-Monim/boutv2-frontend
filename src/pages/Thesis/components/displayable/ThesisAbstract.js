import { borderColorStyles } from "../../../../utils/styles/styles";

const ThesisAbstract = ({ application }) => {
    return <div>
        <h4 className={`border-b-4 mb-2 ${borderColorStyles.simple}`}>Abstract</h4>
        <p className="text-justify text-[0.9rem] px-2">{application.abstract}</p>
    </div>;
}

export default ThesisAbstract;