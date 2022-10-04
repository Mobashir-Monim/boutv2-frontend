import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { middlewares } from "./kernel";

const parseCheckString = check => {
    let [collable, param] = check.split(":");
    param = param?.split(",");

    return [collable, param];
}

const Middleware = ({ checks }) => {
    const [checkResult, setCheckResult] = useState(null);
    const location = useLocation();

    useEffect(() => {
        setCheckResult((() => {
            for (let i = 0; i < checks.length; i++) {
                const [callable, param] = parseCheckString(checks[i]);
                const checkResult = param ? middlewares[callable](param) : middlewares[callable]();

                if (!checkResult.evaluation)
                    return checkResult.onFail;
            }

            return <Outlet />;
        })());
    }, [location]);

    return checkResult;
}

export default Middleware;