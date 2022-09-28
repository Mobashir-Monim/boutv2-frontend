import CardHeader from "../Headers/CardHeader";
import { cardStyles } from "../../utils/styles/styles";

const SimpleCardCustomColor = ({ title, children, width = "w-[100%]", customStyle, showTitle = true }) => {
    return <div className={` ${cardStyles.simpleCustomBg} ${customStyle}`}>
        {showTitle ? <CardHeader title={title} /> : <></>}
        {children}
    </div>
}

export default SimpleCardCustomColor;