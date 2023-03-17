import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { transitioner, textColorStyles } from "./utils/styles/styles";
import { app } from "./db/remote/firebase";

import SideNav from "./components/SideNav/SideNav";
import Modal from "./components/Modal/Modal";

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
import TermsOfService from "./pages/StaticPage/TermsOfService";
import Middleware from "./routes/Middleware";
import Logout from "./pages/Auth/Logout";
import StudentProfileManager from "./pages/Profile/StudentProfileManager";
import StudentProfile from "./pages/Profile/components/StudentProfile";
import ThesisCoordination from "./pages/Thesis/ThesisCoordination";
import ThesisRegistrations from "./pages/Thesis/ThesisRegistrations";
import RoutineConfig from "./pages/Routine/RoutineConfig";
import FacultyProfileManager from "./pages/Profile/FacultyProfileManager";
import FacultyProfile from "./pages/Profile/components/FacultyProfile";


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

        <div className={textColorStyles.simple + " font-normal tracking-wide"}>
            <Modal navShown={sideNavStatus.showNav} />
        </div>
        <div className={`w-[100%] min-h-[100vh] bg-[#FDFBF9] dark:bg-[#28282B] font-normal tracking-tight ${user ? `lg:ml-auto pt-[calc(70px+1rem)] pb-5 lg:py-5 ${sideNavStatus.showNav ? "lg:w-[calc(100vw-250px)]" : "lg:w-[calc(100vw-70px-1rem)]"}` : "lg:mx-auto"} text-[#171717]/[0.7] font-bold dark:text-white ${transitioner.simple}`}>
            <Routes>
                <Route path="/" element={<Middleware checks={["auth"]} />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<Middleware checks={["orgMember"]} />}>
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/thesis" element={<Thesis />} />
                    </Route>

                    <Route path="/" element={<Middleware checks={["hasRole:student-profile-manager"]} />}>
                        <Route path="/profile/manage/students" element={<StudentProfileManager />} />
                        <Route path="/profile/view/student/:email" element={<StudentProfile />} />
                    </Route>

                    <Route path="/" element={<Middleware checks={["hasRole:faculty-profile-manager"]} />}>
                        <Route path="/profile/manage/faculty" element={<FacultyProfileManager />} />
                        <Route path="/profile/view/faculty/:email" element={<FacultyProfile />} />
                    </Route>

                    <Route path="/" element={<Middleware checks={["faculty"]} />}>
                        <Route path="/students/mapper" element={<StudentMapper />} />
                        <Route path="/" element={<EvaluationInstanceProvider />}>
                            <Route path="/" element={<EvaluationQuestionsProvider />}>
                                <Route path="/evaluation" element={<Evaluation />} />
                                <Route path="/evaluation/questions" element={<EvaluationQuestions />} />
                            </Route>
                        </Route>

                        <Route path="/" element={<Middleware checks={["hasRole:thesis-coordinator"]} />}>
                            <Route path="/thesis/coordinate" element={<ThesisCoordination />} />
                        </Route>
                        <Route path="/" element={<Middleware checks={["hasRole:thesis-manager"]} />}>
                            <Route path="/thesis/registrations" element={<ThesisRegistrations />} />
                        </Route>

                        <Route path="/" element={<Middleware checks={["hasRole:routine-team"]} />}>
                            <Route path="/routine/config" element={<RoutineConfig />} />
                        </Route>

                        <Route path="/routine" element={<UnderDevelopment />} />
                        {/* <Route path="/course-config" element={<UnderDevelopment />} /> */}
                        <Route path="/course-config" element={<CourseConfig />} />
                        <Route path="/obe" element={<UnderDevelopment />} />
                    </Route>

                    <Route path="/" element={<Middleware checks={["student"]} />}>
                        <Route path="/thesis/registration" element={<ThesisRegistration />} />
                    </Route>
                </Route>
                <Route path="/logout" element={<Logout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/evaluation/form" element={<EvaluationForm />} />
                <Route path="/evaluation-form" element={<EvaluationForm />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    </>
}

export default App;