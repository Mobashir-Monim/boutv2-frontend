import { Link } from "react-router-dom";
import SimpleCard from "../../../components/Card/SimpleCard";
import { textColorStyles, transitioner } from "../../../utils/styles/styles";

const NonMemberDashboard = ({ user }) => {
    return <div className="w-[100%] md:w-[70%] lg:w-[50%] mx-auto">
        <SimpleCard title={`Hello ${user.displayName}`} customStyle="rounded-xl">
            <div className="p-5">
                <p className="text-center mb-5">
                    This application is for members of the CSE Department of BracU only.
                </p>
            </div>
        </SimpleCard>
    </div>
}

export default NonMemberDashboard;