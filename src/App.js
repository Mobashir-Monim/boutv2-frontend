import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { transitioner, textColorStyles } from "./utils/styles/styles";
import { app } from "./db/remote/firebase";

import SideNav from "./components/SideNav/SideNav";
import Modal from "./components/Modal/Modal";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import UnderDevelopment from "./pages/UnderDevelopment/UnderDevelopment";
import Evaluation from "./pages/Evaluation/Evaluation";
import NotFound from "./pages/Utilities/NotFound";
import EvaluationQuestions from "./pages/Evaluation/EvaluationQuestions";
import Login from "./pages/Auth/Login";

import { useAuth } from "./utils/contexts/AuthContext";
import CourseConfig from "./pages/CourseConfig/CourseConfig";
import EvaluationForm from "./pages/Evaluation/EvaluationForm";
import Dashboard from "./pages/Dashboard/Dashboard";
import StudentMapper from "./pages/StudentMapper/StudentMapper";
import { EvaluationInstanceProvider, EvaluationQuestionsProvider } from "./utils/contexts/EvaluationContext";
import Thesis from "./pages/Thesis/Thesis";
import ThesisRegistration from "./pages/Thesis/ThesisRegistration";
import PrivacyPolicy from "./pages/StaticPage/PrivacyPolicy";
import Profile from "./pages/Profile/Profile";

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

    return <>
        <SideNav showNav={sideNavStatus.showNav} toggleNav={toggleSideNav} collapseNav={collapseNav} />

        <div className={textColorStyles.simple}>
            <Modal navShown={sideNavStatus.showNav} />
        </div>
        <div className={`w-[100%] min-h-[100vh] bg-[#FDFBF9] dark:bg-[#28282B] text-black dark:text-white ${user ? `lg:ml-auto pt-[calc(70px+1rem)] pb-5 lg:py-5 ${sideNavStatus.showNav ? "lg:w-[calc(100vw-250px)]" : "lg:w-[calc(100vw-70px-1rem)]"}` : "lg:mx-auto"} text-black dark:text-white ${transitioner.simple}`}>
            <Routes>
                <Route path="/" element={<ProtectedRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/students/mapper" element={<StudentMapper />} />
                    <Route path="/thesis" element={<Thesis />} />
                    <Route path="/" element={<EvaluationInstanceProvider />}>
                        <Route path="/" element={<EvaluationQuestionsProvider />}>
                            <Route path="/evaluation" element={<Evaluation />} />
                            <Route path="/evaluation/questions" element={<EvaluationQuestions />} />
                        </Route>
                    </Route>
                    <Route path="/routine" element={<UnderDevelopment />} />
                    <Route path="/thesis" element={<UnderDevelopment />} />
                    {/* <Route path="/thesis" element={<Thesis />} /> */}
                    {/* <Route path="/thesis/registration" element={<ThesisRegistration />} /> */}
                    <Route path="/course-config" element={<UnderDevelopment />} />
                    <Route path="/obe" element={<UnderDevelopment />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/evaluation/form" element={<EvaluationForm />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    </>
}

export default App;