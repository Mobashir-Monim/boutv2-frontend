import CardHeader from "../Headers/CardHeader";
import { cardStyles, inputStyles } from "../../utils/styles/styles";

const QuestionCard = ({ title, children, width, titleStyle, customStyle }) => {
    return <div className={`${width} ${cardStyles.question} ${customStyle}`}>
        <CardHeader title={title} customStyle={`mb-10 ${titleStyle} ${inputStyles.questioned.question}`} />
        {children}
    </div>
}

export default QuestionCard;