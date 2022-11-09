import { useState } from "react";
import { TextInput } from "../../../components/FormInputs/LabeledInputs";
import { generateThesisNumber, setThesisRegistration } from "../../../db/remote/thesis";
import { useModal } from "../../../utils/contexts/ModalContext";
import { deepClone } from "../../../utils/functions/deepClone";
import { borderColorStyles, transitioner } from "../../../utils/styles/styles";

const ThesisApplicationDetails = ({ application, isThesisCoordinator, user, updatePendingApplicationList, thesis_instance }) => {
    const { showModal, hideModal } = useModal();
    const [approvalStatus, setApprovalStatus] = useState({
        comment: "",
        comment_error: false,
    });

    const mapPeople = (type) => {
        if (application[0][type].length > 0) {
            return application[0][type].map((person, pIndex) => <div className="bg-black/[0.1] gap-2 dark:bg-[#fff]/[0.3] flex flex-col p-3 rounded-xl w-[100%] md:w-[calc(50%-1.25rem/2)] text-[0.9rem]" key={`supervisor-${pIndex}`}>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-3">
                        <span className="material-icons-round">email</span>
                        <span className="my-auto">{person}</span>
                    </div>
                    {type === "member_emails" && application.credits_completed ? <div className="flex flex-row gap-3">
                        <span className="">Credits Completed: </span>
                        <span className="my-auto">{application.credits_completed[pIndex]}</span>
                    </div> : <></>}
                </div>
                {type === "supervisor" ? <span className={`${borderColorStyles.simple} border-t-2 text-right`}>{pIndex === 0 ? "Primary" : "Secondary"}</span> : <></>}
            </div>);
        } else {
            return <div className="bg-black/[0.1] gap-2 dark:bg-[#fff]/[0.3] flex flex-col p-3 rounded-xl w-[100%] md:w-[calc(50%-1.25rem/2)] text-[0.9rem] mx-auto" >
                <div className="flex flex-row gap-3">
                    None Found
                </div>
            </div>
        }
    }

    const updateComment = event => {
        const approvalStatusClone = deepClone(approvalStatus);
        approvalStatusClone.comment_error = false;
        approvalStatusClone.comment = event.target.value;
        setApprovalStatus(approvalStatusClone);
    }

    const rejectRequest = () => showModal("Invalid Request", "The requested changes cannot be made");

    const approveApplication = async level => {
        const flag = level === "supervisor" ?
            application[0].supervisor_approval === 0 && application[0].supervisor[0] === user.email :
            application[0].supervisor_approval === 3 && application[0].coordinator_approval === 0 && isThesisCoordinator;

        if (flag) {
            setPrimaryApplicationApproval(level, 3);
        } else {
            rejectRequest();
        }
    }

    const softRejectApplication = async level => {
        if (approvalStatus.comment.trim() === "") {
            setApprovalStatus({ ...approvalStatus, comment_error: true });
        } else {
            const flag = level === "supervisor" ?
                application[0].supervisor_approval === 0 && application[0].supervisor[0] === user.email :
                application[0].supervisor_approval === 3 && application[0].coordinator_approval === 0 && isThesisCoordinator;

            if (flag) {
                setPrimaryApplicationApproval(level, 2);
            } else {
                rejectRequest();
            }
        }
    }

    const hardRejectApplication = async level => {
        if (approvalStatus.comment.trim() === "") {
            setApprovalStatus({ ...approvalStatus, comment_error: true });
        } else {
            const flag = level === "supervisor" ?
                application[0].supervisor_approval === 0 && application[0].supervisor[0] === user.email :
                application[0].supervisor_approval === 3 && application[0].coordinator_approval === 0 && isThesisCoordinator;

            if (flag) {
                setPrimaryApplicationApproval(level, 1);
            } else {
                rejectRequest();
            }
        }
    }

    const setPrimaryApplicationApproval = async (level, state) => {
        const applicationClone = { ...deepClone(application[0]), id: application[1] };
        applicationClone[`${level}_approval`] = state;
        applicationClone[`${level}_comment`] = approvalStatus.comment;

        if (level === "coordinator" && state === 3) {
            applicationClone.coordinator_approval_at = new Date().getTime();
            applicationClone.number = await generateThesisNumber(thesis_instance[0][0].semester, thesis_instance[0][0].year);
            applicationClone.level = "P1";
        }

        setThesisRegistration(applicationClone);
        updatePendingApplicationList(application[1]);
        hideModal();
    }

    const getPrimaryApprovalForm = (level) => <div className="flex flex-col gap-3">
        <div>
            <TextInput label={"Comment"} value={approvalStatus.comment} onChangeFn={event => updateComment(event)} customStyle={{ input: `border-[2px] ${approvalStatus.comment_error ? "!border-rose-500" : "border-rose-500/[0]"}` }} />
        </div>
        <div className="flex flex-col md:flex-row gap-5 md:justify-center">
            <span onClick={() => approveApplication(level)} className={`text-white py-2 px-5 cursor-pointer rounded-3xl bg-teal-600 hover:bg-teal-500 ${transitioner.simple}`}>Approve</span>
            <span onClick={() => softRejectApplication(level)} className={`text-white py-2 px-5 cursor-pointer rounded-3xl bg-orange-600 hover:bg-orange-500 ${transitioner.simple}`}>Soft Reject</span>
            <span onClick={() => hardRejectApplication(level)} className={`text-white py-2 px-5 cursor-pointer rounded-3xl bg-rose-600 hover:bg-rose-500 ${transitioner.simple}`}>Hard Reject</span>
        </div>
    </div>

    const getSecondaryApprovalForm = (level) => <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-5 md:justify-center">
            <span className={`py-2 px-5 cursor-pointer rounded-3xl bg-teal-600 hover:bg-teal-500 ${transitioner.simple}`}>Approve</span>
            <span className={`py-2 px-5 cursor-pointer rounded-3xl bg-rose-600 hover:bg-rose-500 ${transitioner.simple}`}>Hard Reject</span>
        </div>
    </div>

    const generateApprovalForm = (type, level) => <div>
        <div className={`flex flex-row justify-between border-b-4 mb-2 ${borderColorStyles.simple} pb-2`}>
            <h4 className={`my-auto`}>Approval Form [ {level.toUpperCase()} ]</h4>
        </div>
        <div className="flex flex-col">
            {type === "primary" ? getPrimaryApprovalForm(level) : getSecondaryApprovalForm(level)}
        </div>
    </div>

    const getApprovalForm = () => {
        if (application[0].supervisor_approval === 0 && application[0].supervisor[0] === user.email) {
            return generateApprovalForm("primary", "supervisor");
        } else if (application[0].coordinator_approval === 0 && isThesisCoordinator && application[0].supervisor_approval === 3) {
            return generateApprovalForm("primary", "coordinator");
        } else {
            <></>
        }
    }

    const mapApprovalStatus = (status) => {
        const statusObject = { name: "Approved", color: "text-teal-600" };

        if (status === 1) {
            statusObject.name = "Hard Rejected";
            statusObject.color = "text-rose-600";
        } else if (status === 2) {
            statusObject.name = "Soft Rejected";
            statusObject.color = "text-orange-600";
        }

        return statusObject;
    }

    return <div className="flex flex-col gap-10">
        <div>
            <h4 className={`border-b-4 mb-2 ${borderColorStyles.simple}`}>Abstract</h4>
            <p className="text-justify text-[0.9rem] px-2">{application[0].abstract}</p>
        </div>
        <div>
            <div className={`flex flex-row justify-between border-b-4 mb-2 ${borderColorStyles.simple} pb-2`}>
                <h4 className={`my-auto`}>Supervisor(s)</h4>
                <h4 className={`text-blue-400 font-bold font-mono`}>[ {application[0].supervisor.length} ]</h4>
            </div>
            <div className="flex flex-col md:flex-row gap-5">
                {mapPeople("supervisor")}
            </div>
        </div>
        <div>
            <div className={`flex flex-row justify-between border-b-4 mb-2 ${borderColorStyles.simple} pb-2`}>
                <h4 className={`my-auto`}>Co-supervisor(s)</h4>
                <h4 className={`text-blue-400 font-bold font-mono`}>[ {application[0].co_supervisor_emails.length} ]</h4>
            </div>
            <div className="flex flex-col md:flex-row gap-5">
                {mapPeople("co_supervisor_emails")}
            </div>
        </div>
        <div>
            <div className={`flex flex-row justify-between border-b-4 mb-2 ${borderColorStyles.simple} pb-2`}>
                <h4 className={`my-auto`}>Member(s)</h4>
                <h4 className={`text-blue-400 font-bold font-mono`}>[ {application[0].member_emails.length} ]</h4>
            </div>
            <div className="flex flex-col md:flex-row gap-5 flex-wrap">
                {mapPeople("member_emails")}
            </div>
        </div>

        <div className={`${application[0].supervisor_approval !== 0 ? "" : "hidden"}`}>
            <div className={`flex flex-row justify-between border-b-4 mb-2 ${borderColorStyles.simple} pb-2`}>
                <h4 className={`my-auto`}>Supervisor Approval </h4>
            </div>
            <div className="flex flex-col gap-5">
                <h4 className={`${mapApprovalStatus(application[0].supervisor_approval).color} font-bold font-mono`}>[ {mapApprovalStatus(application[0].supervisor_approval).name} ]</h4>
                <p>Supervisor comment: {application[0].supervisor_comment === "" ? "No comments provided" : application[0].supervisor_comment}</p>
            </div>
        </div>

        <div className={`${application[0].coordinator_approval !== 0 ? "" : "hidden"}`}>
            <div className={`flex flex-row justify-between border-b-4 mb-2 ${borderColorStyles.simple} pb-2`}>
                <h4 className={`my-auto`}>Coordinator Approval </h4>
            </div>
            <div className="flex flex-col gap-5">
                <h4 className={`${mapApprovalStatus(application[0].coordinator_approval).color} font-bold font-mono`}>[ {mapApprovalStatus(application[0].coordinator_approval).name} ]</h4>
                <p>Coordinator comment: {application[0].coordinator_comment === "" ? "No comments provided" : application[0].coordinator_comment}</p>
            </div>
        </div>

        {getApprovalForm()}
    </div>
}

export default ThesisApplicationDetails;