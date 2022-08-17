import { useLocation } from "react-router-dom";
import { pageLayoutStyles } from "../../utils/styles/styles";

const UnderDevelopment = () => {
    const location = useLocation();

    return <div className={`${pageLayoutStyles.fixed} flex flex-col justify-center`}>
        <h1 className="text-[1.5rem] lg:text-[2rem] mx-auto text-center">The feature <span className="text-red-400 font-bold">"{location.pathname.split("/")[1]}"</span> is currently under development</h1>
        <h1 className="text-[1.3rem] lg:text-[1.5rem] mx-auto text-center">Thank you for your patience!</h1>
    </div>
}

export default UnderDevelopment;