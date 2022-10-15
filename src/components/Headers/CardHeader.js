import { borderColorStyles } from "../../utils/styles/styles";

const CardHeader = ({ title, customStyle }) => {
    return <h4 className={`text-lg ${borderColorStyles.simple} ${customStyle}`}>{title}</h4>
}

export default CardHeader;