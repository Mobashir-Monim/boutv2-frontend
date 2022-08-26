import { pageLayoutStyles } from "../../utils/styles/styles";

const NotFound = () => {
    return <div className={`${pageLayoutStyles.fixed} flex flex-col justify-center`}>
        <div className="flex flex-col">
            <div className="flex flex-row mx-auto">
                <span className={`material-icons-round text-white text-[5rem] md:text-[7rem] lg:text-[10rem]`}>sentiment_very_dissatisfied</span>
                <span className={`material-icons-round text-white text-[5rem] md:text-[7rem] lg:text-[10rem]`}>sentiment_very_dissatisfied</span>
                <span className={`material-icons-round text-white text-[5rem] md:text-[7rem] lg:text-[10rem]`}>sentiment_very_dissatisfied</span>
            </div>
            <p className="mx-auto text-[1.3rem] lg:text-[1.5rem] mt-10">Your power has rended us useless</p>
            <p className="mx-auto text-[1.3rem] lg:text-[1.5rem]">We are forced to declare</p>
            <span className="text-blue-400 font-semibold text-[2.2rem] mx-auto">404 Not Found</span>
        </div>
    </div>
}

export default NotFound;