import React, { useState } from "react";
import { pageLayoutStyles, transitioner } from "../../utils/styles/styles";
import { useAuth } from "../../utils/contexts/AuthContext";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";
import ApprovedApplicationContainer from "./components/ApprovedApplicationContainer";
import PendingApplication from "./components/PendingApplication";
import SimpleCard from "../../components/Card/SimpleCard";

const Thesis = () => {
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const { user } = useAuth();
    const [notification, setNotification] = useState(true);
    return (
        <div className={`${pageLayoutStyles.scrollable} flex flex-col gap-10`}>
            {/* <div className="flex flex-row mt-5 justify-between items-center">
                <div className="font-bold text-lg">Welcome {user.displayName}</div>
                <span
                    className={`material-icons-round my-auto font-bold ${transitioner.simple
                        } text-white bg-gray-700 p-2 rounded-md cursor-pointer ${notification
                            ? "before:block before:w-3 before:h-3 before:mr-4 before:bg-red-500 before:rounded-full before:absolute before:left-[30px] before:top-[-4px]"
                            : ""
                        }`}
                >
                    notifications
                </span>
            </div> */}
            <div className="flex flex-col lg:flex-row w-[100%] gap-10">
                <SimpleCard title="Approved Applications" customStyle={"w-[100%] lg:w-[60%]"}>
                    <div className="mt-5 h-[25vh] lg:h-[50vh] overflow-y-scroll no-scroll-bar">
                        <ApprovedApplicationContainer />
                    </div>
                </SimpleCard>
                <SimpleCard title="Pending Applications" customStyle={"w-[100%] lg:w-[40%]"}>
                    <div className="mt-5 h-[25vh] lg:h-[50vh] overflow-y-scroll no-scroll-bar">
                        <PendingApplication />
                    </div>
                </SimpleCard>
            </div>
        </div>
    );
};

export default Thesis;
