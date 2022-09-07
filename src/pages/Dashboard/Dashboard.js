import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SimpleCard from "../../components/Card/SimpleCard";
import { useAuth } from "../../utils/contexts/AuthContext";
import { pageLayoutStyles } from "../../utils/styles/styles";

const Dashboard = () => {
    const { user } = useAuth();

    return <div className={`${pageLayoutStyles.scrollable} flex flex-col justify-center`}>
        <div className="w-[100%] md:w-[70%] lg:w-[50%] mx-auto">
            <SimpleCard title={`Hello ${user.displayName}!!`} customStyle="rounded-xl">
                <div className="mt-5">
                    <p className="text-center mb-5">What would you like to do today?</p>
                    <div className="flex flex-row flex-wrap justify-center gap-5">
                        <PrimaryButton text={"Evaluation Panel"} link="/evaluation" />
                        <PrimaryButton text={"Student Mapper"} link="/students/mapper" />
                    </div>
                </div>
            </SimpleCard>
        </div>
    </div>
}

export default Dashboard;