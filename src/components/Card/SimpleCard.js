import CardHeader from "../Headers/CardHeader";
import { cardStyles } from "../../utils/styles/styles";

const SimpleCard = ({ title, children, width }) => {
    return <div className={`${width} ${cardStyles.simple}`}>
        <CardHeader title={title} />
        {children}
    </div>
}

export default SimpleCard;