import { transitioner, navStyles } from "../../../utils/styles/styles";
import { Link } from "react-router-dom";

const profile = {
    name: "Profile",
    icon: "person",
    action: "/profile",
    type: "link",

};

const thesis = {
    name: "Thesis",
    icon: "biotech",
    action: "/thesis",
    type: "link",

};

const studentMapper = {
    name: "Student Mapper",
    icon: "share",
    action: "/students/mapper",
    type: "link",

};

const evaluation = {
    name: "Evaluation",
    icon: "analytics",
    action: "/evaluation",
    type: "link",

};

const routine = {
    name: "Routine",
    icon: "calendar_month",
    action: "/routine",
    type: "link",

};

const courseConfig = {
    name: "Course",
    icon: "auto_stories",
    action: "/course-config",
    type: "link",

};

const obe = {
    name: "OBE",
    icon: "bubble_chart",
    action: "/obe",
    type: "link",

};

const settings = {
    name: "Settings",
    icon: "settings",
    action: "/settings",
    type: "link",
};

export const appendStaffNavOptions = navOptions => {
    navOptions.push(profile);
    navOptions.push(thesis);
    navOptions.push(studentMapper);
    navOptions.push(evaluation);
    navOptions.push(routine)
    navOptions.push(courseConfig)
    navOptions.push(obe);
};

export const appendStudentNavOptions = navOptions => {
    navOptions.push(profile);
    navOptions.push(thesis);
}

const getNavOption = (navOpt, showNav) => <span className={navStyles.optionContainer}>
    <span className={navStyles.optionIcon}>{navOpt.icon}</span>
    <span className={`${navStyles.optionText.base} ${transitioner.simple} ${showNav ? navStyles.optionText.shown : navStyles.optionText.hidden}`}>
        {navOpt.name}
    </span>
</span>

export const generateLinkNavOption = (navOptIndex, navOpt, collapseNav, showNav) => <div key={`nav-opt-${navOptIndex}`}>
    <Link to={navOpt.action} className={`flex flex-row ${transitioner.simple} lg:hidden`} onClick={collapseNav}>
        {getNavOption(navOpt, showNav)}
    </Link>
    <Link to={navOpt.action} className={`hidden lg:flex flex-row ${transitioner.simple}`}>
        {getNavOption(navOpt, showNav)}
    </Link>
</div >;

export const generateFunctionNavOption = (navOptIndex, navOpt, collapseNav, showNav) => <div key={`nav-opt-${navOptIndex}`}>
    <div className={`flex flex-row ${transitioner.simple} lg:hidden`} onClick={() => { collapseNav(); navOpt.action(); }}>
        {getNavOption(navOpt, showNav)}
    </div>
    <div className={`hidden lg:flex flex-row ${transitioner.simple}`} onClick={navOpt.action}>
        {getNavOption(navOpt, showNav)}
    </div>
</div>