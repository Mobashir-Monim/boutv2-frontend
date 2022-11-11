import React, { useEffect, useState } from "react";
import SimpleCard from "../../../components/Card/SimpleCard";
import { applicationTypeColors, thesisStyles } from "../../../utils/styles/styles";
import { applicationTypeIcons } from "../../../utils/styles/icons";
import { useModal } from "../../../utils/contexts/ModalContext";
import ThesisApplicationDetails from "./ThesisApplicationDetails";
import { userHasRole } from "../../../db/remote/user";
import { deepClone } from "../../../utils/functions/deepClone";
import { useLoadingScreen } from "../../../utils/contexts/LoadingScreenContext";
import { getPendingThesisRegistrations } from "../../../db/remote/thesis";

const PendingApplication = ({ user, coordinatorPending, thesis_instance }) => {
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const { showModal } = useModal();
    const [registrationInstances, setRegistrationInstances] = useState([]);
    const [isThesisCoordinator, setIsThesisCoordinator] = useState(false);
    const [pendingApplications, setPendingApplications] = useState([]);

    useEffect(() => {
        (async () => {
            showLoadingScreen("Loading registrations, please wait");
            const isCoordinator = await userHasRole(user.email, "thesis-coordinator");
            setIsThesisCoordinator(isCoordinator);

            if (coordinatorPending) {
                const pendingApps = await getPendingThesisRegistrations("coordinator", user.email);
                setPendingApplications(pendingApps);
            } else {
                const pendingApps = await getPendingThesisRegistrations("supervisor", user.email);
                setPendingApplications(pendingApps);
            }
            hideLoadingScreen();
        })();
    }, [])


    const updatePendingApplicationList = id => {
        let pendingApplicationsClone = [];

        for (let i in pendingApplications) {
            if (pendingApplications[i][1] !== id)
                pendingApplicationsClone.push([deepClone(pendingApplications[i][0]), pendingApplications[i][1]]);
        }

        setPendingApplications(pendingApplicationsClone);
    }

    const getModalHeading = index => <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between">
            <p className="text-orange-500 font-bold font-mono my-auto text-[0.9rem]">[ PENDING {pendingApplications[index][0].type.toUpperCase()} ]</p>
            <span className={`${thesisStyles.cardIcon}`}>{applicationTypeIcons[pendingApplications[index][0].type]}</span>
        </div>
        <div className="">{pendingApplications[index][0].title}</div>
    </div>

    const getRegistrationInstance = index => {

    }

    const showApplicationDetails = (index) => {
        showModal(
            getModalHeading(index),
            <ThesisApplicationDetails
                application={pendingApplications[index]}
                isThesisCoordinator={isThesisCoordinator}
                user={user}
                updatePendingApplicationList={updatePendingApplicationList}
                thesis_instance={thesis_instance}
            />
        )
    }

    const hasPendingApplications = () => {
        if (pendingApplications[0])
            return pendingApplications[0][1];

        return false;
    }

    return <div className="flex flex-col max-w-[800px]">
        {hasPendingApplications() ? (
            <div className="flex flex-col gap-2">
                {pendingApplications.map((pendingApplication, index) => (
                    <div className={`${thesisStyles.pending.container}`} key={index} onClick={() => showApplicationDetails(index)}>
                        <span className={`${thesisStyles.pending.icon} ${applicationTypeColors[pendingApplication[0].type]}`}>
                            {applicationTypeIcons[pendingApplication[0].type]}
                        </span>

                        <div className="flex flex-col gap-2 justify-start flex-1">
                            <p className={`${thesisStyles.pending.title}`}>
                                {pendingApplication[0].title}
                            </p>
                            <div className="flex flex-row items-center">
                                <div className="flex flex-row items-center text-xs">
                                    <span className={`material-icons-round text-[0.8rem] ${thesisStyles.pending.textColor}`}>person</span>
                                    <span className={`ml-1 ${thesisStyles.pending.textColor}`}>{pendingApplication[0].member_emails.length}</span>
                                </div>
                                <span className={`${thesisStyles.pending.details}`}>
                                    <div className="w-1 h-1 rounded-full bg-gray-600 dark:bg-gray-200"></div>
                                    {pendingApplication[0].type}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <SimpleCard showTitle={false} customStyle="border-none h-20 flex items-center">
                <h1 className="p-5">There is currently no pending applications.</h1>
            </SimpleCard>
        )}
    </div>
};

export default PendingApplication;
