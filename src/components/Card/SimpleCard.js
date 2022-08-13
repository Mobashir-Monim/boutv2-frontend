import CardHeader from "../Headers/CardHeader";
import { cardStyles } from "../../utils/styles";

const SimpleCard = ({ title, children, width }) => {
    return <div className={`${width} ${cardStyles.simple}`}>
        <CardHeader title={title} />
        <div className="flex flex-row flex-wrap mt-5 gap-3">
            {children}
        </div>
    </div>
}

export default SimpleCard;