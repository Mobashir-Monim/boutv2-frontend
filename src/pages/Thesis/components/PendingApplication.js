import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SimpleCard from "../../../components/Card/SimpleCard";
import { transitioner } from "../../../utils/styles/styles";

const PendingApplication = () => {
    const navigate = useNavigate();
    const [pendingApplications, setPendingApplications] = useState([
        {
            type: "project",
            abstract:
                "This paper examines the role of silent movies as a mode of shared experience in the US during the early twentieth century. At this time, high immigration rates resulted in a significant percentage of non-English-speaking citizens. These immigrants faced numerous economic and social obstacles, including exclusion from public entertainment and modes of discourse (newspapers, theater, radio).Incorporating evidence from reviews, personal correspondence, and diaries, this study demonstrates that silent films were an affordable and inclusive source of entertainment. It argues for the accessible economic and representational nature of early cinema. These concerns are particularly evident in the low price of admission and in the democratic nature of the actors’ exaggerated gestures, which allowed the plots and action to be easily grasped by a diverse audience despite language barriers.",
            title: "Deep learning",
            id: "8da0e570-8468-4fa8-9f23-9cd0f2f4119f",
            members: 4,
        },
        {
            type: "internship",
            abstract:
                "This paper examines the role of silent movies as a mode of shared experience in the US during the early twentieth century. At this time, high immigration rates resulted in a significant percentage of non-English-speaking citizens. These immigrants faced numerous economic and social obstacles, including exclusion from public entertainment and modes of discourse (newspapers, theater, radio).Incorporating evidence from reviews, personal correspondence, and diaries, this study demonstrates that silent films were an affordable and inclusive source of entertainment. It argues for the accessible economic and representational nature of early cinema. These concerns are particularly evident in the low price of admission and in the democratic nature of the actors’ exaggerated gestures, which allowed the plots and action to be easily grasped by a diverse audience despite language barriers.",
            title: "Deep learning",
            id: "158df454-85a7-4ed0-9370-381fba721dbd",
            members: 1,
        },
        {
            type: "thesis",
            abstract:
                "This paper reveals the struggle for regulatory balance between ensuring progressive innovation and stifling fraudulent sophistry in the emerging disruptive blockchain economy. With a particular focus on cryptocurrencies, it envisions a practical solution in technological advancement that combines economic considerations and monetary policy in the roll-out of and implementation of a framework for the health of the financial economy - the Competitive Popularity Approach (CPA).The CPA framework is a three-part framework that draws from elements of market capitalisation, competitive business strategies and technological advancement to encourage innovation while maintaining regulatory supervision over the financial sector. It considers the possibility of harnessing technological advancement by providing a theoretical incentive for developing a multi-dimensional, self-regulating ecosystem through the promising potential of blockchain technology in order to achieve a semblance of the balance we desire.With the state adoption of the core tenets of this framework on a sufficiently international scale, the financial sector may witness an exponential transformation for the better.The framework essentially directs us to create, integrate and regulate. This may sound simple but is in fact a complex, intricate web of details which are not as easy to achieve. The paper discusses this framework in a manner that is neither perfect nor complete. At best, it could be described as skeletal. This is necessarily the consequence of the relatively nascent state of the technology in spite of its ground-breaking potential.There is still a lot about the technology that we have to uncover, uncertainties about the effectiveness of legal manoeuvres we have to experiment, and a number of factors we may have not even foreseen yet to even regard as worth considering.The debate has only just begun. Whether or not the blockchain economy will live up to the revolution it is predicted to create is still riddled with uncertainty. Yet regardless of what policymakers ultimately decide, there is no denying that this phenomenon is not disappearing anytime soon. It is hoped that the CPA framework will jumpstart a chain reaction for a discussion that will inspire us to take a step towards a bold new normal financially ever after.",
            title:
                "Financially Ever After: A Thesis on Cryptocurrency and the Global Financial Economy",
            id: "6fbc6538-d7f8-461e-8650-b58fd2616206",
            members: 3,
        },
        {
            type: "thesis",
            abstract:
                "This paper reveals the struggle for regulatory balance between ensuring progressive innovation and stifling fraudulent sophistry in the emerging disruptive blockchain economy. With a particular focus on cryptocurrencies, it envisions a practical solution in technological advancement that combines economic considerations and monetary policy in the roll-out of and implementation of a framework for the health of the financial economy - the Competitive Popularity Approach (CPA).The CPA framework is a three-part framework that draws from elements of market capitalisation, competitive business strategies and technological advancement to encourage innovation while maintaining regulatory supervision over the financial sector. It considers the possibility of harnessing technological advancement by providing a theoretical incentive for developing a multi-dimensional, self-regulating ecosystem through the promising potential of blockchain technology in order to achieve a semblance of the balance we desire.With the state adoption of the core tenets of this framework on a sufficiently international scale, the financial sector may witness an exponential transformation for the better.The framework essentially directs us to create, integrate and regulate. This may sound simple but is in fact a complex, intricate web of details which are not as easy to achieve. The paper discusses this framework in a manner that is neither perfect nor complete. At best, it could be described as skeletal. This is necessarily the consequence of the relatively nascent state of the technology in spite of its ground-breaking potential.There is still a lot about the technology that we have to uncover, uncertainties about the effectiveness of legal manoeuvres we have to experiment, and a number of factors we may have not even foreseen yet to even regard as worth considering.The debate has only just begun. Whether or not the blockchain economy will live up to the revolution it is predicted to create is still riddled with uncertainty. Yet regardless of what policymakers ultimately decide, there is no denying that this phenomenon is not disappearing anytime soon. It is hoped that the CPA framework will jumpstart a chain reaction for a discussion that will inspire us to take a step towards a bold new normal financially ever after.",
            title:
                "Financially Ever After: A Thesis on Cryptocurrency and the Global Financial Economy",
            id: "6fbc6538-d7f8-461e-8650-b58fd2616206",
            members: 3,
        },
        {
            type: "thesis",
            abstract:
                "This paper reveals the struggle for regulatory balance between ensuring progressive innovation and stifling fraudulent sophistry in the emerging disruptive blockchain economy. With a particular focus on cryptocurrencies, it envisions a practical solution in technological advancement that combines economic considerations and monetary policy in the roll-out of and implementation of a framework for the health of the financial economy - the Competitive Popularity Approach (CPA).The CPA framework is a three-part framework that draws from elements of market capitalisation, competitive business strategies and technological advancement to encourage innovation while maintaining regulatory supervision over the financial sector. It considers the possibility of harnessing technological advancement by providing a theoretical incentive for developing a multi-dimensional, self-regulating ecosystem through the promising potential of blockchain technology in order to achieve a semblance of the balance we desire.With the state adoption of the core tenets of this framework on a sufficiently international scale, the financial sector may witness an exponential transformation for the better.The framework essentially directs us to create, integrate and regulate. This may sound simple but is in fact a complex, intricate web of details which are not as easy to achieve. The paper discusses this framework in a manner that is neither perfect nor complete. At best, it could be described as skeletal. This is necessarily the consequence of the relatively nascent state of the technology in spite of its ground-breaking potential.There is still a lot about the technology that we have to uncover, uncertainties about the effectiveness of legal manoeuvres we have to experiment, and a number of factors we may have not even foreseen yet to even regard as worth considering.The debate has only just begun. Whether or not the blockchain economy will live up to the revolution it is predicted to create is still riddled with uncertainty. Yet regardless of what policymakers ultimately decide, there is no denying that this phenomenon is not disappearing anytime soon. It is hoped that the CPA framework will jumpstart a chain reaction for a discussion that will inspire us to take a step towards a bold new normal financially ever after.",
            title:
                "Financially Ever After: A Thesis on Cryptocurrency and the Global Financial Economy",
            id: "6fbc6538-d7f8-461e-8650-b58fd2616206",
            members: 3,
        },
    ]);

    return (
        <div className="flex flex-col max-w-[800px]">
            {/* <div className="flex flex-row items-center justify-between mb-5">
                <h1 className="text-white uppercase">Pending Applications</h1>
                <PrimaryButton
                    text={"SEE ALL"}
                    link="/thesis/pending/applications/view"
                    customStyle={"text-xs"}
                />
            </div> */}
            {pendingApplications ? (
                <div className="flex flex-col gap-8">
                    {pendingApplications.map((pendingApplication, index) => (
                        <div className="flex flex-row items-center gap-4" key={index}>
                            {pendingApplication.type === "thesis" && (
                                <span
                                    className={`material-icons-round text-2xl bg-[#fcf3fd] dark:bg-[#9AB086] px-2 py-1 rounded-full`}
                                >
                                    import_contacts
                                </span>
                            )}
                            {pendingApplication.type === "internship" && (
                                <span
                                    className={`material-icons-round text-2xl bg-[#F7FAE9] dark:bg-[#9C7FAD] px-2 py-1 rounded-full`}
                                >
                                    group
                                </span>
                            )}
                            {pendingApplication.type === "project" && (
                                <span
                                    className={`material-icons-round text text-2xl bg-[#ffefe2] dark:bg-[#7BAAB3] px-2 py-1 rounded-full`}
                                >
                                    computer
                                </span>
                            )}

                            <div className="flex flex-col gap-2 justify-start flex-1">
                                <h1
                                    className="line-clamp-1 lg:line-clamp-2 text-lg font-bold cursor-pointer hover:text-blue-400"
                                    onClick={() => {
                                        navigate(
                                            `/thesis/pending/applications/view/${pendingApplication.id}`
                                        );
                                    }}
                                >
                                    {pendingApplication.title}
                                </h1>
                                <div className="flex flex-row items-center">
                                    <div className="flex flex-row items-center text-xs">
                                        <span className={`material-icons-round text-white text-sm`}>
                                            person
                                        </span>
                                        <span className="ml-1">{pendingApplication.members}</span>
                                    </div>
                                    <span className="ml-2 text-gray-200 uppercase text-sm flex flex-row items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-gray-200"></div>{" "}
                                        {pendingApplication.type}
                                    </span>
                                </div>
                            </div>
                            <div className="text-2xl flex flex-row items-center gap-1">
                                <span
                                    className={`material-icons-round text-green-500 text-2xl cursor-pointer`}
                                >
                                    check_circle
                                </span>
                                <span
                                    className={`material-icons-round text-red-500 text-2xl ml-6 cursor-pointer`}
                                >
                                    cancel
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <SimpleCard
                    showTitle={false}
                    customStyle="border-none h-20 flex items-center"
                >
                    <h1 className="p-5">There is currently no pending applications.</h1>
                </SimpleCard>
            )}
        </div>
    );
};

export default PendingApplication;
