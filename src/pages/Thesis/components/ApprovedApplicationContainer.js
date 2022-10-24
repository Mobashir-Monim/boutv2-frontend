import React, { useState } from "react";
import SimpleCard from "../../../components/Card/SimpleCard";
import SimpleCardCustomColor from "../../../components/Card/SimpleCardCustomColor";
import { useModal } from "../../../utils/contexts/ModalContext";
import { thesisStyles, transitioner, applicationTypeColors } from "../../../utils/styles/styles";
import { applicationTypeIcons } from "../../../utils/styles/icons";
import ThesisApplicationDetails from "./ThesisApplicationDetails";

const ApprovedApplicationContainer = () => {
    const { showModal } = useModal();
    const [approvedApplications, setApprovedApplications] = useState([]);

    const showApplicationDetails = (index) => {
        showModal(
            <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between">
                    <p className="text-teal-500 font-bold font-mono my-auto text-[0.9rem]">[ APPROVED {approvedApplications[index][0].type.toUpperCase()} ]</p>
                    <span className={`${thesisStyles.cardIcon}`}>{applicationTypeIcons[approvedApplications[index][0].type]}</span>
                </div>
                <div className="">{approvedApplications[index][0].title}</div>
            </div>,
            <ThesisApplicationDetails application={approvedApplications[index]} />
        )
    }

    const showApprovedApplications = () => approvedApplications.map((approvedApplication, index) => (
        <div className="cursor-pointer" key={index} onClick={() => showApplicationDetails(index)}>
            <SimpleCardCustomColor showTitle={false} customStyle={`${thesisStyles.approved.cardCustomStyle} ${applicationTypeColors[approvedApplication[0].type]} ${transitioner.simple} hover:text-white hover:bg-blue-500`}>
                <div className={`${thesisStyles.approved.cardContent}`}>
                    <h1 className={`${thesisStyles.approved.cardContentTitle}`}>{approvedApplication[0].title}</h1>
                    <p className={`${thesisStyles.approved.cardContentBody}`}>{approvedApplication[0].abstract}</p>
                </div>
                <span className={`${thesisStyles.cardIcon}`}>{applicationTypeIcons[approvedApplication[0].type]}</span>
            </SimpleCardCustomColor>
        </div>
    ));

    const hasApprovedApplications = () => {
        if (approvedApplications[0])
            return approvedApplications[0][1];

        return false;
    }

    return <div className="flex flex-col max-w-[800px]">
        {hasApprovedApplications() ? (
            <div className="flex flex-col items-start gap-5 p-2">
                {showApprovedApplications()}
            </div>
        ) : (
            <SimpleCard showTitle={false} customStyle="border-none h-20 flex items-center">
                <h1 className="p-5">There is currently no approved applications.</h1>
            </SimpleCard>
        )}
    </div>
};

export default ApprovedApplicationContainer;
