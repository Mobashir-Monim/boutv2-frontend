import { useState } from "react";
import { deepCopy } from "@firebase/util";
import { transitioner, borderColorStyles } from "../../../../utils/styles/styles";
import { TextInput } from "../../../../components/FormInputs/LabeledInputs";

const ThesisRegistrationApprovalForm = ({ application, user, isThesisCoordinator, level, setPrimaryApplicationApproval, rejectRequest }) => {
    const [approvalStatus, setApprovalStatus] = useState({
        comment: "",
        comment_error: false,
    });

    const updateComment = event => {
        const approvalStatusClone = deepCopy(approvalStatus);
        approvalStatusClone.comment_error = false;
        approvalStatusClone.comment = event.target.value;
        setApprovalStatus(approvalStatusClone);
    }

    const hasComment = () => approvalStatus.comment.trim().replaceAll("\n", "").replaceAll("\t", "") !== "";
    const canProcessApplication = () => level === "supervisor" ?
        application.supervisor_approval === 0 && application.supervisor[0] === user.email :
        application.supervisor_approval === 3 && application.coordinator_approval === 0 && isThesisCoordinator;

    const approveApplication = async () => {
        if (canProcessApplication()) {
            setPrimaryApplicationApproval(level, 3, approvalStatus.comment);
        } else {
            rejectRequest();
        }
    }

    const softRejectApplication = async () => {
        if (!hasComment()) {
            setApprovalStatus({ ...approvalStatus, comment_error: true });
        } else {
            if (canProcessApplication()) {
                setPrimaryApplicationApproval(level, 2, approvalStatus.comment);
            } else {
                rejectRequest();
            }
        }
    }

    const hardRejectApplication = async () => {
        if (!hasComment()) {
            setApprovalStatus({ ...approvalStatus, comment_error: true });
        } else {
            if (canProcessApplication()) {
                setPrimaryApplicationApproval(level, 1, approvalStatus.comment);
            } else {
                rejectRequest();
            }
        }
    }

    return <div className="flex flex-col gap-3">
        <div className={`flex flex-row justify-between border-b-4 mb-2 ${borderColorStyles.simple} pb-2`}>
            <h4 className={`my-auto`}>Registration Approval Form [ {level.slice(0, 1).toUpperCase()}{level.slice(1)} ]</h4>
        </div>
        <div>
            <TextInput label={"Comment"} value={approvalStatus.comment} onChangeFn={event => updateComment(event)} customStyle={{ input: `border-[2px] ${approvalStatus.comment_error ? "!border-rose-500" : "border-rose-500/[0]"}` }} />
        </div>
        <div className="flex flex-col md:flex-row gap-5 md:justify-center">
            <span onClick={() => approveApplication(level)} className={`text-white py-2 px-5 cursor-pointer rounded-3xl bg-teal-600 hover:bg-teal-500 ${transitioner.simple}`}>Approve</span>
            <span onClick={() => softRejectApplication(level)} className={`text-white py-2 px-5 cursor-pointer rounded-3xl bg-orange-600 hover:bg-orange-500 ${transitioner.simple}`}>Soft Reject</span>
            <span onClick={() => hardRejectApplication(level)} className={`text-white py-2 px-5 cursor-pointer rounded-3xl bg-rose-600 hover:bg-rose-500 ${transitioner.simple}`}>Hard Reject</span>
        </div>
    </div>
}

export default ThesisRegistrationApprovalForm;