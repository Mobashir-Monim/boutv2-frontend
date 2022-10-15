import SimpleCard from "../../../components/Card/SimpleCard";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";

const FacultyDashboard = ({ user }) => {
    return <div className="w-[100%] md:w-[70%] lg:w-[50%] mx-auto">
        <SimpleCard title={`Hello ${user.displayName}!!`} customStyle="rounded-xl">
            <div className="p-5">
                <p className="text-center mb-5">What would you like to do today?</p>
                <div className="flex flex-row flex-wrap justify-center gap-5">
                    <PrimaryButton text={"Evaluation Panel"} link="/evaluation" />
                    <PrimaryButton text={"Student Mapper"} link="/students/mapper" />
                </div>
            </div>
        </SimpleCard>
    </div>
}

export default FacultyDashboard;