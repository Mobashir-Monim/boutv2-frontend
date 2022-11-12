import ApprovedApplicationContainer from "./ApprovedApplicationContainer";
import PendingApplication from "./PendingApplication";
import SimpleCard from "../../../components/Card/SimpleCard";
import Spinner from "../../../components/Utils/Spinner";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import { pageLayoutStyles } from "../../../utils/styles/styles";
import { useEffect, useState } from "react";
import { userHasRole } from "../../../db/remote/user";

const FacultyDashboard = ({ user }) => {
    const [canManageThesis, setCanManageThesis] = useState(null);
    const [isThesisCoordinator, setIsThesisCoordinator] = useState(null);

    useEffect(() => {
        (async () => {
            const hasThesisManagementPermission = await userHasRole(user.email, "thesis-manager");
            const hasThesisCoordinationPermission = await userHasRole(user.email, "thesis-coordinator");
            setCanManageThesis(hasThesisManagementPermission);
            setIsThesisCoordinator(hasThesisCoordinationPermission);
        })();
    }, [])

    const getThesisManagementButton = () => {
        if (canManageThesis === null) {
            return <Spinner dimensions={"h-10 w-10"} />;
        } else if (canManageThesis) {
            return <PrimaryButton text="Thesis Registrations" type="link" link={"/thesis/registrations"} />
        } else {
            return <></>
        }
    }

    const getThesisCoordinatorButton = () => {
        if (isThesisCoordinator === null) {
            return <Spinner dimensions={"h-10 w-10"} />;
        } else if (isThesisCoordinator) {
            return <PrimaryButton text="Thesis Coordination" type="link" link={"/thesis/coordinate"} />
        } else {
            return <></>
        }
    }

    return <div className={`${pageLayoutStyles.scrollable} flex flex-col gap-10`}>
        <div className="flex flex-col lg:flex-row w-[100%] gap-10">
            <SimpleCard title="Approved Applications" customStyle={"w-[100%] lg:w-[60%]"}>
                <div className="p-5 h-[40vh] lg:h-[70vh] overflow-y-scroll no-scroll-bar">
                    <ApprovedApplicationContainer />
                </div>
            </SimpleCard>
            <SimpleCard title="Pending Applications" customStyle={"w-[100%] lg:w-[40%]"}>
                <div className="p-5 h-[40vh] lg:h-[70vh] overflow-y-scroll no-scroll-bar">
                    <PendingApplication user={user} />
                </div>
            </SimpleCard>
        </div>
        <div className="flex flex-col md:flex-row gap-5 justify-center">
            {getThesisManagementButton()}
            {getThesisCoordinatorButton()}
        </div>
    </div>
}

export default FacultyDashboard;