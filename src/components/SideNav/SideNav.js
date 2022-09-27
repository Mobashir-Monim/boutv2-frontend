import { Link } from "react-router-dom";
import { transitioner } from "../../utils/styles/styles";

import { useAuth } from "../../utils/contexts/AuthContext";

const SideNav = ({ showNav, toggleNav, collapseNav }) => {
  const { user, logout } = useAuth();

  let widthClasses = "!w-[0%] h-0 overflow-hidden lg:h-[100vh]";
  let arrowClasses = "";
  let arrowContainerClasses = "";

  if (user) {
    widthClasses =
      "w-[100%] lg:px-5 lg:w-[calc(70px+1rem)] h-[70px] lg:h-[100vh]";
    arrowClasses = "rotate-90 lg:rotate-0";
    arrowContainerClasses = "";

    if (showNav) {
      widthClasses = "w-[100%] lg:w-[250px] lg:px-5 h-[100vh] lg:h-[100vh]";
      arrowClasses = "-rotate-90 lg:rotate-180";
      arrowContainerClasses = "lg:mr-auto";
    }
  }

  const navOptions = [
    {
      name: "Dashboard",
      icon: "dashboard",
      action: "/dashboard",
      type: "link",
      classses: {
        name: "",
        icon: "",
      },
    },
    {
      name: "Profile",
      icon: "person",
      action: "/profile",
      type: "link",
      classses: {
        name: "",
        icon: "",
      },
    },
    {
      name: "Student Mapper",
      icon: "share",
      action: "/students/mapper",
      type: "link",
      classses: {
        name: "",
        icon: "",
      },
    },
    {
      name: "Thesis",
      icon: "book",
      action: "/thesis",
      type: "link",
      classses: {
        name: "",
        icon: "",
      },
    },
    {
      name: "Evaluation",
      icon: "analytics",
      action: "/evaluation",
      type: "link",
      classses: {
        name: "",
        icon: "",
      },
    },
    {
      name: "Routine",
      icon: "calendar_month",
      action: "/routine",
      type: "link",
      classses: {
        name: "",
        icon: "",
      },
    },
    {
      name: "Course",
      icon: "auto_stories",
      action: "/course-config",
      type: "link",
      classses: {
        name: "",
        icon: "",
      },
    },
    {
      name: "OBE",
      icon: "bubble_chart",
      action: "/obe",
      type: "link",
      classses: {
        name: "",
        icon: "",
      },
    },
    // {
    //     name: "Settings",
    //     icon: "settings",
    //     action: "/settings",
    //     type: "link",
    //     classses: {
    //         name: "",
    //         icon: ""
    //     },
    // },
    {
      name: "Logout",
      icon: "power_settings_new",
      action: logout,
      type: "function",
      classses: {
        name: "",
        icon: "",
      },
    },
  ];

  return (
    <nav
      className={`${widthClasses} flex flex-col py-2 lg:py-10 gap-1 z-[50] sticky top-0 overflow-hidden bg-blue-700 dark:bg-blue-800 ${transitioner.simple} drop-shadow-lg`}
    >
      <div
        className={`flex flex-row justify-start ${transitioner.simple} ml-6 mt-2 lg:ml-1`}
      >
        <span
          className={`bg-white rounded-full cursor-pointer relative p-2 inline text-center material-icons-round font-bold transition-all duration-500 ease-linear ${arrowContainerClasses}`}
          onClick={toggleNav}
        >
          <span
            className={`material-icons-round font-bold ${transitioner.simple} text-black ${arrowClasses}`}
            onClick={toggleNav}
          >
            arrow_forward_ios
          </span>
        </span>
      </div>

      <div className="mt-10 lg:mt-0 pl-5 lg:pl-0">
        {navOptions.map((navOpt, navOptIndex) => {
          if (navOpt.type === "link") {
            return (
              <div key={`nav-opt-${navOptIndex}`}>
                <Link
                  to={navOpt.action}
                  className={`flex flex-row ${transitioner.simple} lg:hidden`}
                  onClick={collapseNav}
                >
                  <span
                    className={`rounded-full flex cursor-pointer relative p-3 text-center transition-all duration-500 ease-linear`}
                  >
                    <span
                      className={`material-icons-round my-auto font-bold ${transitioner.simple} text-white ${navOpt.classses.icon}`}
                    >
                      {navOpt.icon}
                    </span>
                    <span
                      className={`text-white my-auto ${transitioner.simple} ${
                        showNav
                          ? "text-[0.8rem] opacity-100 ml-4"
                          : "opacity-0 ml-0 text-[0rem]"
                      } ${navOpt.classses.name}`}
                    >
                      {navOpt.name}
                    </span>
                  </span>
                </Link>
                <Link
                  to={navOpt.action}
                  className={`hidden lg:flex flex-row ${transitioner.simple}`}
                >
                  <span
                    className={`rounded-full flex cursor-pointer relative p-3 text-center transition-all duration-500 ease-linear`}
                  >
                    <span
                      className={`material-icons-round my-auto font-bold ${transitioner.simple} text-white ${navOpt.classses.icon}`}
                    >
                      {navOpt.icon}
                    </span>
                    <span
                      className={`text-white my-auto ${transitioner.simple} ${
                        showNav
                          ? "text-[0.8rem] opacity-100 ml-4"
                          : "opacity-0 ml-0 text-[0rem]"
                      } ${navOpt.classses.name}`}
                    >
                      {navOpt.name}
                    </span>
                  </span>
                </Link>
              </div>
            );
          } else {
            return (
              <div key={`nav-opt-${navOptIndex}`}>
                <div
                  className={`flex flex-row ${transitioner.simple} lg:hidden`}
                  onClick={() => {
                    collapseNav();
                    navOpt.action();
                  }}
                >
                  <span
                    className={`rounded-full flex cursor-pointer relative p-3 text-center transition-all duration-500 ease-linear`}
                  >
                    <span
                      className={`material-icons-round my-auto font-bold ${transitioner.simple} text-white ${navOpt.classses.icon}`}
                    >
                      {navOpt.icon}
                    </span>
                    <span
                      className={`text-white my-auto ${transitioner.simple} ${
                        showNav
                          ? "text-[0.8rem] opacity-100 ml-4"
                          : "opacity-0 ml-0 text-[0rem]"
                      } ${navOpt.classses.name}`}
                    >
                      {navOpt.name}
                    </span>
                  </span>
                </div>
                <div
                  className={`hidden lg:flex flex-row ${transitioner.simple}`}
                  onClick={navOpt.action}
                >
                  <span
                    className={`rounded-full flex cursor-pointer relative p-3 text-center transition-all duration-500 ease-linear`}
                  >
                    <span
                      className={`material-icons-round my-auto font-bold ${transitioner.simple} text-white ${navOpt.classses.icon}`}
                    >
                      {navOpt.icon}
                    </span>
                    <span
                      className={`text-white my-auto ${transitioner.simple} ${
                        showNav
                          ? "text-[0.8rem] opacity-100 ml-4"
                          : "opacity-0 ml-0 text-[0rem]"
                      } ${navOpt.classses.name}`}
                    >
                      {navOpt.name}
                    </span>
                  </span>
                </div>
              </div>
            );
          }
        })}
      </div>
    </nav>
  );
};

export default SideNav;
