import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { pageLayoutStyles, bgColorStyles } from "../utils/styles/styles";
import { middlewares } from "./kernel";

const parseCheckString = check => {
    let [callable, param] = check.split(":");
    param = param?.split(",");

    return [callable, param];
}

const Middleware = ({ checks }) => {
    const validationScreen = <div className={`${pageLayoutStyles.fixed} !h-[100vh] fixed top-0 left-0 text-black dark:text-white flex flex-col justify-center bg-[#171717]/[0.7]`}>
        <div className={`${bgColorStyles.contrast} p-10 rounded-xl w-[90%] md:w-[55%] lg:w-[45%] xl:w-[35%] min-h-[20vh] lg:min-h-[30vh] flex flex-col justify-center mx-auto`}>
            <div className="flex flex-row gap-5">
                <svg className="spinner h-10 w-10 md:h-20 md:w-20 stroke-[#000]/[0.5] dark:stroke-[#fff]/[0.5]" viewBox="0 0 50 50">
                    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                </svg>
                <h3 className="my-auto text-[1.2rem] md:text-[1.5rem] lg:text-[1.2rem]">Validating request, please wait</h3>
            </div>
        </div>
    </div>

    const [checkResult, setCheckResult] = useState(validationScreen);
    const location = useLocation();

    useEffect(() => {
        (async () => {
            const res = await (async () => {
                for (let i = 0; i < checks.length; i++) {
                    const [callable, param] = parseCheckString(checks[i]);
                    let checkResult = null;

                    if (middlewares[callable].isAsync) {
                        checkResult = param ? await middlewares[callable].middleware(param) : await middlewares[callable].middleware();
                    } else {
                        checkResult = param ? middlewares[callable].middleware(param) : middlewares[callable].middleware();
                    }

                    if (!checkResult.evaluation)
                        return checkResult.onFail;
                }

                return <Outlet />;
            })();

            setCheckResult(res);
        })();
    }, [location]);

    return checkResult;
}

export default Middleware;