import { Link } from "react-router-dom";
import { transitioner } from "../../utils/styles/styles";

import { useAuth } from "../../utils/contexts/AuthContext";
import { getAuth } from "firebase/auth";
import { appendStaffNavOptions, appendStudentNavOptions, generateFunctionNavOption, generateLinkNavOption } from "./utils/NavOption";

const auth = getAuth();

const SideNav = ({ showNav, toggleNav, collapseNav }) => {
    const { user, logout } = useAuth();

    let widthClasses = "!w-[0%] h-0 overflow-hidden lg:h-[100vh]";
    let arrowClasses = "";
    let arrowContainerClasses = "";
    let navOptions = [
        {
            name: "Dashboard",
            icon: "dashboard",
            action: "/dashboard",
            type: "link",
        },
    ];

    if (user) {
        widthClasses = "w-[100%] lg:px-5 lg:w-[calc(70px+1rem)] h-[70px] lg:h-[100vh]";
        arrowClasses = "rotate-90 lg:rotate-0";
        arrowContainerClasses = "";

        if (showNav) {
            widthClasses = "w-[100%] lg:w-[250px] lg:px-5 h-[100vh] lg:h-[100vh]";
            arrowClasses = "-rotate-90 lg:rotate-180";
            arrowContainerClasses = "lg:mr-auto";
        }

        if (auth.currentUser.email.endsWith("@bracu.ac.bd")) {
            appendStaffNavOptions(navOptions);
        } else if (auth.currentUser.email.endsWith("@g.bracu.ac.bd")) {
            appendStudentNavOptions(navOptions);
        }

        navOptions.push({
            name: "Logout",
            icon: "power_settings_new",
            action: logout,
            type: "function",
        });
    }

    return <nav className={`${widthClasses} flex flex-col py-2 lg:py-10 gap-1 z-[50] fixed top-0 overflow-hidden bg-blue-700 dark:bg-blue-800 ${transitioner.simple} drop-shadow-lg`}>
        <div className={`flex flex-row justify-start ${transitioner.simple} ml-6 mt-2 lg:ml-1`}>
            <span className={`bg-white rounded-full cursor-pointer relative p-2 inline text-center material-icons-round font-bold transition-all duration-500 ease-linear ${arrowContainerClasses}`} onClick={toggleNav}>
                <span className={`material-icons-round font-bold ${transitioner.simple} text-black ${arrowClasses}`} onClick={toggleNav}>arrow_forward_ios</span>
            </span>
        </div>

        <div className="mt-10 lg:mt-0 pl-5 lg:pl-0">
            {navOptions.map((navOpt, navOptIndex) => {
                if (navOpt.type === "link") {
                    return generateLinkNavOption(navOptIndex, navOpt, collapseNav, showNav);
                } else {
                    return generateFunctionNavOption(navOptIndex, navOpt, collapseNav, showNav);
                }
            })}
        </div>
    </nav>
};

export default SideNav;
