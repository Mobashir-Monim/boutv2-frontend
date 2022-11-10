import { borderColorStyles } from "../../../../utils/styles/styles";

const ThesisApprovalStatus = ({ application }) => {
    const approvalAppends = ["supervisor", "coordinator"];
    const approvalStatusMap = [
        { display: "Pending", color: "text-orange-600" },
        { display: "Hard Rejected", color: "text-rose-600" },
        { display: "Soft Rejected", color: "text-orange-600" },
        { display: "Approved", color: "text-teal-600" },
    ];

    return <div>
        <div className={`flex flex-row justify-between border-b-4 mb-2 ${borderColorStyles.simple} pb-2`}>
            <h4 className={`my-auto`}>Registration Approval Status</h4>
        </div>
        <div className="flex flex-col md:flex-row gap-5 flex-wrap">
            {approvalAppends.map(appendText =>
                <div className="bg-black/[0.1] dark:bg-[#fff]/[0.3] flex flex-col p-3 rounded-xl w-[100%] md:w-[calc(50%-1.25rem/2)]" key={appendText}>
                    <h3 className={`border-b-4 ${borderColorStyles.simple}`}>{`${appendText.slice(0, 1).toUpperCase()}${appendText.slice(1)}`}</h3>
                    <div className={`font-bold font-mono text-center rounded-full bg-[#ddd] dark:bg-[#171717]/[0.4] my-2 py-2 ${approvalStatusMap[application[`${appendText}_approval`]].color}`}>
                        [ {approvalStatusMap[application[`${appendText}_approval`]].display} ]
                    </div>
                    <div className={`text-[0.9rem] border-t-4 ${borderColorStyles.simple}`}>
                        {application[`${appendText}_comment`]}
                    </div>
                </div>
            )}
        </div>
    </div>
}

export default ThesisApprovalStatus;