import { borderColorStyles } from "../../utils/styles/styles";

const CardHeader = ({ title, customStyle }) => {
    return <>
        <h4 className={`text-lg mb-3 ${borderColorStyles.simple} ${customStyle}`}>{title}</h4>
        <div className="w-[90%] mx-auto mb-5 h-[0.4rem] bg-[#ddd] dark:bg-[#171717]/[0.3] rounded-full"></div>
    </>
}

export default CardHeader;