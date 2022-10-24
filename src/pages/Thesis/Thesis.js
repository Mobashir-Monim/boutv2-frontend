import { pageLayoutStyles } from "../../utils/styles/styles";
import { useAuth } from "../../utils/contexts/AuthContext";
import ApprovedApplicationContainer from "./components/ApprovedApplicationContainer";
import PendingApplication from "./components/PendingApplication";
import SimpleCard from "../../components/Card/SimpleCard";
import { domainKey, studentDomainValue, staffDomainValue } from "../../utils/contants";
import UnderDevelopment from "../UnderDevelopment/UnderDevelopment";

const Thesis = () => {
    const { user } = useAuth();

    if (user[domainKey] === staffDomainValue) {
        return <div className={`${pageLayoutStyles.scrollable} flex flex-col gap-10`}>
            <div className="flex flex-col lg:flex-row w-[100%] gap-10">
                <SimpleCard title="Approved Applications" customStyle={"w-[100%] lg:w-[60%]"}>
                    <div className="p-5 h-[40vh] lg:h-[60vh] overflow-y-scroll no-scroll-bar">
                        <ApprovedApplicationContainer />
                    </div>
                </SimpleCard>
                <SimpleCard title="Pending Applications" customStyle={"w-[100%] lg:w-[40%]"}>
                    <div className="p-5 h-[40vh] lg:h-[60vh] overflow-y-scroll no-scroll-bar">
                        <PendingApplication />
                    </div>
                </SimpleCard>
            </div>
        </div>
    } else {
        return <UnderDevelopment />
    }

};

export default Thesis;
