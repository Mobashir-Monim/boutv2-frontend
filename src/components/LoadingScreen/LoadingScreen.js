import { useEffect } from "react";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";
import { bgColorStyles, pageLayoutStyles } from "../../utils/styles/styles";

const LoadingScreen = () => {
    const { loadingScreenState } = useLoadingScreen();

    useEffect(() => { console.log(loadingScreenState.isLoading); });

    return <div className={`${pageLayoutStyles.fixed} !h-[100vh] fixed top-0 left-0 ${loadingScreenState.isLoading ? "z-50" : "-z-50 hidden"} text-black dark:text-white flex flex-col justify-center bg-[#171717]/[0.7]`}>
        <div className={`${bgColorStyles.contrast} p-10 rounded-xl w-[90%] md:w-[55%] lg:w-[45%] xl:w-[35%] min-h-[20vh] lg:min-h-[30vh] flex flex-col justify-center mx-auto`}>
            <div className="flex flex-row gap-5">
                <svg className="spinner h-10 w-10 md:h-20 md:w-20 stroke-[#000]/[0.5] dark:stroke-[#fff]/[0.5]" viewBox="0 0 50 50">
                    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                </svg>
                <h3 className="my-auto text-[1.2rem] md:text-[1.5rem] lg:text-[1.2rem]">{loadingScreenState.message}</h3>
            </div>
        </div>
    </div>
}

export default LoadingScreen;