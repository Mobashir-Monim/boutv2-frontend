import { borderColorStyles } from "../../utils/styles";

const CardHeader = ({ title }) => {
    return <h4 className={`text-lg border-b-2 ${borderColorStyles.simple}`}>{title}</h4>
}

export default CardHeader;