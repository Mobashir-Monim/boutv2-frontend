import CardHeader from "../Headers/CardHeader";
import { cardStyles } from "../../utils/styles/styles";

const SimpleCard = ({ title, children, width = "w-[100%]", customStyle, showTitle = true }) => {
    return <div className={`${width} ${cardStyles.simple} ${customStyle} drop-shadow-2xl`}>
        {showTitle ? <CardHeader title={title} customStyle="p-5 pb-3" /> : <></>}
        {showTitle ? <div className="w-[100%] mx-auto h-[0.4rem] bg-[#ddd] dark:bg-[#232323]"></div> : <></>}
        {children}
    </div>
}

export default SimpleCard;