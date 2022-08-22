import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { transitioner } from "./utils/styles/styles";
import { app } from "./db/remote/firebase";

import SideNav from "./components/SideNav/SideNav";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import UnderDevelopment from "./pages/UnderDevelopment/UnderDevelopment";
import Evaluation from "./pages/Evaluation/Evaluation";
import NotFound from "./pages/Utilities/NotFound";
import EvaluationQuestions from "./pages/Evaluation/Admin/EvaluationQuestions";
import Login from "./pages/Auth/Login";

import { useAuth } from "./utils/contexts/AuthContext";
import { EvaluationInstanceProvider } from "./utils/contexts/EvaluationContext";
import CourseConfig from "./pages/CourseConfig/CourseConfig";
import EvaluationForm from "./pages/Evaluation/EvaluationForm";

const App = () => {
    const [sideNavStatus, setSideNavStatus] = useState({ currentRoute: "/", showNav: false });
    const { user } = useAuth();

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
        <SideNav showNav={sideNavStatus.showNav} toggleNav={toggleSideNav} collapseNav={collapseNav} />
        <div className={`w-[100%] min-h-[100vh] ${sideNavStatus.showNav ? "lg:w-[calc(100vw-250px)]" : "lg:w-[calc(100vw-70px-1rem)]"} ${user ? "lg:ml-auto pt-[calc(70px+1rem)] lg:pt-5" : "lg:mx-auto"} text-black dark:text-white ${transitioner.simple}`}>
            <Routes>
                <Route path="/" element={<ProtectedRoute />}>
                    <Route path="/" element={<UnderDevelopment />} />
                    <Route path="/dashboard" element={<UnderDevelopment />} />
                    <Route path="/profile" element={<UnderDevelopment />} />
                    <Route path="/" element={<EvaluationInstanceProvider />}>
                        <Route path="/evaluation" element={<Evaluation />} />
                        <Route path="/evaluation/questions" element={<EvaluationQuestions />} />
                    </Route>
                    <Route path="/routine" element={<UnderDevelopment />} />
                    <Route path="/course-config" element={<UnderDevelopment />} />
                    <Route path="/obe" element={<UnderDevelopment />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/evaluation-form" element={<EvaluationForm />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    </div>
}

export default App;