import { transitioner } from "../../utils/styles/styles";
import { useAuth } from "../../utils/contexts/AuthContext";
import { appendStaffNavOptions, appendStudentNavOptions, generateFunctionNavOption, generateLinkNavOption } from "./utils/NavOption";
import { domainKey, studentDomainValue, staffDomainValue } from "../../utils/contants";

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
            arrowContainerClasses = "lg:mx-auto";
        }

        if (user[domainKey] == staffDomainValue) {
            appendStaffNavOptions(navOptions);
        } else if (user[domainKey] == studentDomainValue) {
            appendStudentNavOptions(navOptions);
        }

        navOptions.push({
            name: "Logout",
            icon: "power_settings_new",
            action: "/logout",
            type: "link",
        });
    }

    return <nav className={`${widthClasses} flex flex-col py-2 lg:py-10 gap-1 z-[50] fixed top-0 overflow-hidden bg-blue-700 dark:bg-blue-800 ${transitioner.simple} drop-shadow-lg !tracking-tight`}>
        <div className={`flex flex-row justify-start ${transitioner.simple} mt-1 lg:w-[100%] mx-auto ${showNav ? "bg-[#fff]/[0.3] hover:bg-[#171717]/[0.4]" : "bg-[#171717]/[0.4] hover:bg-[#fff]/[0.3]"} rounded-full lg:rounded-xl cursor-pointer`} onClick={toggleNav}>
            <span className={`mx-auto relative px-3 py-3 lg:py-2 inline text-center material-icons-round font-bold transition-all duration-500 ease-linear ${arrowContainerClasses}`}>
                <span className={`material-icons-round font-bold ${transitioner.simple} text-white ${arrowClasses}`} onClick={toggleNav}>arrow_forward_ios</span>
            </span>
        </div>

        <div className="mt-5 px-5 lg:px-0">
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
