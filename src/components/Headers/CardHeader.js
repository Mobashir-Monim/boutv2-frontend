import { borderColorStyles } from "../../utils/styles/styles";

const CardHeader = ({ title, customStyle }) => {
    return <h4 className={`text-lg border-b-2 ${borderColorStyles.simple} ${customStyle}`}>{title}</h4>
}

export default CardHeader;