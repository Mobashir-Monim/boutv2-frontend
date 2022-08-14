import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SideNav from "./components/SideNav/SideNav";
import UnderDevelopment from "./pages/UnderDevelopment/UnderDevelopment";
import Evaluation from "./pages/Evaluation/Evaluation";
import NotFound from "./pages/Utilities/NotFound";
import EvaluationQuestions from "./pages/Evaluation/Admin/EvaluationQuestions";
import { transitioner } from "./utils/styles/styles";

const App = () => {
    const [sideNavStatus, setSideNavStatus] = useState({ currentRoute: "/", showNav: false });

    const toggleSideNav = () => {
        setSideNavStatus({
            currentRoute: sideNavStatus.currentRoute,
            showNav: !sideNavStatus.showNav
        });
    }

    const collapseNav = () => {
        setSideNavStatus({
            currentRoute: sideNavStatus.currentRoute,
            showNav: false
        });
    }

    return <div className={`min-h-[100vh] bg-[#FDFBF9] dark:bg-[#28282B] text-black dark:text-white ${transitioner.simple}`}>
        <Router>
            <SideNav showNav={sideNavStatus.showNav} toggleNav={toggleSideNav} collapseNav={collapseNav} />
            <div className={`w-[100%] pt-[10vh] md:pt-[7vh] min-h-[100vh] ${sideNavStatus.showNav ? "lg:w-[calc(100vw-250px)]" : "lg:w-[calc(100vw-120px)]"} ml-auto text-black dark:text-white ${transitioner.simple}`}>
                <Routes>
                    <Route path="/" element={<UnderDevelopment />} />
                    <Route path="/dashboard" element={<UnderDevelopment />} />
                    <Route path="/profile" element={<UnderDevelopment />} />
                    <Route path="/evaluation" element={<Evaluation />} />
                    <Route path="/evaluation/questions/:year/:semester" element={<EvaluationQuestions />} />
                    <Route path="/routine" element={<UnderDevelopment />} />
                    <Route path="/course-config" element={<UnderDevelopment />} />
                    <Route path="/obe" element={<UnderDevelopment />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    </div>
}

export default App;