import { useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import { LineInput, SelectInput } from "../../../components/FormInputs/LabeledInputs";
import { setFacultyInfoUpdateRequest } from "../../../db/remote/faculty";
import { useAuth } from "../../../utils/contexts/AuthContext";
import { useLoadingScreen } from "../../../utils/contexts/LoadingScreenContext";
import { useModal } from "../../../utils/contexts/ModalContext";
import { deepClone } from "../../../utils/functions/deepClone";
import { transitioner } from "../../../utils/styles/styles";

const FacultyInfoUpdateForm = ({ updateRequest, setUpdateRequest, faculty, processSubmittedUpdateRequest }) => {
    const { user } = useAuth();
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const { showModal } = useModal();
    const [informationUpdate, setInformationUpdate] = useState(faculty);

    const updateInformationUpdate = (event, field) => {
        const informationUpdateClone = deepClone(informationUpdate);
        informationUpdateClone[field] = event.target.value;
        setInformationUpdate(informationUpdateClone);
    }

    const infoPoints = [
        {
            id: "pin",
            icon: "badge",
            desc: "Pin",
            width: "sm",
            input: "line",
            type: "number",
        },
        {
            id: "degree",
            icon: "workspace_premium",
            desc: "Degree",
            width: "sm",
            input: "select",
            options: {
                'BS': 'Bachelor of Science (B.Sc)',
                'MS': 'Master of science (M.Sc)',
                'Ph.D': 'Doctor of Philosophy (Ph.D'
            },
        },
        {
            id: "personal_email",
            icon: "alternate_email",
            desc: "Personal Email",
            width: "md",
            input: "line",
            type: "text",
        },
        {
            id: "room",
            icon: "apartment",
            desc: "Room",
            width: "sm",
            input: "line",
            type: "text",
        },
        {
            id: "initials",
            icon: "abc",
            desc: "Initials (from routine sheet)",
            width: "sm",
            input: "line",
            type: "text",
        },
        {
            id: "discord_id",
            icon: "discord",
            desc: "Discord ID",
            width: "md",
            input: "line",
            type: "text",
        },
        {
            id: "phone",
            icon: "phone",
            desc: "Phone",
            width: "md",
            input: "line",
            type: "tel",
        },
    ];

    const getInforUpdateFormFields = () => {
        return <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 flex-wrap justify-between">
            {infoPoints.map((point, pointIndex) => getFormField(point, pointIndex))}
        </div>
    }

    const getFormField = (point, key) => {
        if (point.input === 'select') {
            return <SelectInput
                options={{ "": `Select ${point.desc}`, ...point.options }}
                label={<span className="flex flex-row justify-end gap-3">
                    <span className={`material-icons-round text-[0.9rem]`}>{point.icon}</span>
                    <span className="my-auto">{point.desc}</span>
                </span>}
                customStyle={{ container: `${point.width === "sm" ? "w-full lg:w-[calc(25%-2.5rem/3)]" : "w-full lg:w-[calc(50%-1.25rem/2)]"} lg:my-3` }}
                value={informationUpdate[point.id]}
                onChangeFn={event => updateInformationUpdate(event, point.id)}
                key={key}
            />
        } else if (point.input === 'line') {
            return <LineInput
                label={<span className="flex flex-row justify-end gap-3">
                    <span className={`material-icons-round text-[0.9rem]`}>{point.icon}</span>
                    <span className="my-auto">{point.desc}</span>
                </span>}
                customStyle={{ container: `${point.width === "sm" ? "w-full lg:w-[calc(25%-2.5rem/3)]" : "w-full lg:w-[calc(50%-1.25rem/2)]"} lg:my-3` }}
                value={informationUpdate[point.id]}
                onChangeFn={event => updateInformationUpdate(event, point.id)}
                type={point.type}
                key={key}
                placeholder={point.desc}
            />
        }
    }

    const submitUpdateRequest = async () => {
        showLoadingScreen("Processing request, please wait.")
        const errors = [];
        // const errors = validateInformationUpdate();

        if (errors.length === 0) {
            const message = await setFacultyInfoUpdateRequest(informationUpdate);
            processSubmittedUpdateRequest();
            showLoadingScreen(message);
        } else {
            showModal("Invalid Data in update request", <div className="flex flex-col gap-2">{errors.map((e, eIndex) => <div className="" key={eIndex}>{e}</div>)}</div>)
        }

        hideLoadingScreen();
    }

    return <div className={`flex flex-col gap-2.5 ${updateRequest.showRequestForm ? "h-[700px] md:h-[380px]" : "h-[0px]"} ${transitioner.simple} overflow-hidden`}>
        <div className="flex flex-col mx-auto justify-around">
            <div className={`flex flex-row justify-start rounded-3xl mx-auto`}>
                <span className={`material-icons-round w-[1rem] flex justify-center !h-[1rem] mr-2 text-[1rem] my-auto text-black/[0.5] dark:text-white`}>person</span>
                <span className={`my-auto`}>{user.displayName}</span>
            </div>
            <div className={`flex flex-row justify-start rounded-3xl mx-auto`}>
                <span className={`material-icons-round w-[1rem] flex justify-center !h-[1rem] mr-2 text-[1rem] my-auto text-black/[0.5] dark:text-white`}>email</span>
                <span className={`my-auto`}>{user.email}</span>
            </div>
        </div>

        {getInforUpdateFormFields()}

        <div className="flex flex-row gap-5">
            <PrimaryButton text="Cancel" customStyle="basis-1/2" clickFunction={() => setUpdateRequest({ ...updateRequest, showRequestForm: false })} />
            <SecondaryButton text="Submit" customStyle="basis-1/2" clickFunction={submitUpdateRequest} />
        </div>
    </div>
}

export default FacultyInfoUpdateForm;