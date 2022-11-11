import { generateThesisNumber, setThesisRegistration } from "../../../db/remote/thesis";
import { useModal } from "../../../utils/contexts/ModalContext";
import { deepClone } from "../../../utils/functions/deepClone";
import { transitioner } from "../../../utils/styles/styles";
import ThesisRegistrationApprovalForm from "./approval/ThesisRegistrationApprovalForm";
import ThesisAbstract from "./displayable/ThesisAbstract";
import ThesisApprovalStatus from "./displayable/ThesisApprovalStatus";
import ThesisMembers from "./displayable/ThesisMembers";

const ThesisApplicationDetails = ({ application, isThesisCoordinator, user, updatePendingApplicationList, thesis_instance }) => {
    const { showModal, hideModal } = useModal();

    const rejectRequest = () => showModal("Invalid Request", "The requested changes cannot be made")

    const setPrimaryApplicationApproval = async (level, state, comment) => {
        const applicationClone = { ...deepClone(application[0]), id: application[1] };
        applicationClone[`${level}_approval`] = state;
        applicationClone[`${level}_comment`] = comment;

        if (level === "coordinator" && state === 3) {
            applicationClone.coordinator_approval_at = new Date().getTime();
            applicationClone.number = await generateThesisNumber(thesis_instance[0][0].semester, thesis_instance[0][0].year);
            applicationClone.level = "P1";
        }

        setThesisRegistration(applicationClone);
        updatePendingApplicationList(application[1]);
        hideModal();
    }

    const getSecondaryApprovalForm = (level) => <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-5 md:justify-center">
            <span className={`py-2 px-5 cursor-pointer rounded-3xl bg-teal-600 hover:bg-teal-500 ${transitioner.simple}`}>Approve</span>
            <span className={`py-2 px-5 cursor-pointer rounded-3xl bg-rose-600 hover:bg-rose-500 ${transitioner.simple}`}>Hard Reject</span>
        </div>
    </div>

    const getLevel = () => {
        if (application[0].supervisor_approval === 0 && application[0].supervisor[0] === user.email) {
            return "supervisor";
        } else if (application[0].coordinator_approval === 0 && isThesisCoordinator && application[0].supervisor_approval === 3) {
            return "coordinator";
        }
    }

    const getApprovalForm = () => {
        if (getLevel()) {
            return <ThesisRegistrationApprovalForm
                application={application[0]}
                user={user}
                isThesisCoordinator={isThesisCoordinator}
                level={getLevel()}
                setPrimaryApplicationApproval={setPrimaryApplicationApproval}
                rejectRequest={rejectRequest}
            />;
        } else {
            <></>;
        }
    }

    return <div className="flex flex-col gap-10">
        <ThesisAbstract application={application[0]} />
        <ThesisMembers application={application[0]} />
        <ThesisApprovalStatus application={application[0]} />

        {getApprovalForm()}
    </div>
}

export default ThesisApplicationDetails;