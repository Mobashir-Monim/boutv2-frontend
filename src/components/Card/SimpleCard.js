import CardHeader from "../Headers/CardHeader";
import { cardStyles } from "../../utils/styles/styles";

const SimpleCard = ({ title, children, width = "w-[100%]", customStyle }) => {
    return <div className={`${width} ${cardStyles.simple} ${customStyle}`}>
        <CardHeader title={title} />
        {children}
    </div>
}

export default SimpleCard;