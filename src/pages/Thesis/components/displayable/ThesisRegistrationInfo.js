import { applicationTypeIcons } from "../../../../utils/styles/icons";
import { applicationTypeColors, borderColorStyles } from "../../../../utils/styles/styles";

const ThesisRegistrationInfo = ({ thesis_instance, registration_instance }) => {
    return <div>
        <div className={`flex flex-row justify-between border-b-4 mb-2 ${borderColorStyles.simple} pb-2`}>
            <h4 className={`my-auto`}>Registration Information</h4>
            {/* <h4 className={`text-blue-400 font-bold font-mono`}>[ {application[type.container].length} ]</h4> */}
        </div>
        <div className="flex flex-col md:flex-row gap-5 flex-wrap">
            <div className={`gap-2 ${applicationTypeColors[registration_instance.type]} flex flex-row p-3 rounded-xl`}>
                <span className="material-icons-round">{applicationTypeIcons[registration_instance.type]}</span>
                <span>{registration_instance.type.slice(0, 1).toUpperCase()}{registration_instance.type.slice(1)}</span>
            </div>
            <div className="bg-black/[0.1] gap-2 dark:bg-[#fff]/[0.3] flex flex-row p-3 rounded-xl">
                <span className="material-icons-round">event</span>
                <span>{thesis_instance.year} {thesis_instance.semester}</span>
            </div>
        </div>
    </div>;
}

export default ThesisRegistrationInfo;