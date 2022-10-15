import SimpleCard from "../../../components/Card/SimpleCard";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";

import { LineInput } from "../../../components/FormInputs/LabeledInputs";
import { borderColorStyles, transitioner, textColorStyles, bgColorStyles } from "../../../utils/styles/styles";

const allowedUsers = [
    "rrsTypQVyAVwMy6cxrP6VUXOsQO2",
    "l4atJwQZBcQ0btAgfINubI8qxBt1",
    "EXVVTq0Hv5WsiP998CSzIvm1Iwj1",
    "T7SlIkIiKBaKFmnwfdD1axqWCEJ3",
    "36QlTRZox2Oc6QEqVFdSSK8eg4y1",
    "y5fNJVA9VYVYH3G2PaQPwKQySv42",
    "QnNrtpRAj9hMwlxlcBiBOU16XZB2",
]

const EvaluationSearchPanel = ({ user, evaluationState, setSearchPhraseCode, setSearchPhraseSection, setSearchPhraseLink, setSearchPhraseFaculty, setOfferedSectionInstructor, searchOfferedSection, setOfferedSectionInstructorState, showReport }) => {
    return <div className={`${allowedUsers.includes(user.uid) && evaluationState.id ? "" : "hidden"} w-[100%] ${transitioner.simple}`}>
        <SimpleCard title={`Evaluation Search Panel`}>
            <div className="flex flex-col p-5">
                <div className="flex flex-col gap-5 mb-10">
                    <div className="flex flex-col md:flex-row justify-between md:w-[100%] gap-5">
                        <div className="md:w-[47%] flex flex-row gap-5">
                            <div className="w-[75%]">
                                <LineInput label="Course Code" onChangeFn={setSearchPhraseCode} />
                            </div>
                            <div className="w-[25%]">
                                <LineInput label="Section" onChangeFn={setSearchPhraseSection} />
                            </div>
                        </div>
                        <div className="md:w-[47%]">
                            <LineInput label="Evaluation Code" onChangeFn={setSearchPhraseLink} />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between md:w-[100%] gap-5">
                        <div className="md:w-[47%]">
                            <LineInput label="Faculty Email" onChangeFn={setSearchPhraseFaculty} />
                        </div>
                        <div className="md:w-[37%] justify-center flex my-auto">
                            <PrimaryButton text="Fetch Data" customStyle={"w-[100%]"} type="button" clickFunction={searchOfferedSection} />
                        </div>
                    </div>
                </div>
                {Object.keys(evaluationState.search.results).map(part =>
                    Object.keys(evaluationState.search.results[part]).map(identifier => {
                        if (evaluationState.search.results[part][identifier][`${part}_instructor_names`].length === 0)
                            return <span className="hidden" key={identifier}></span>;

                        return <div className={`border-b-2 pb-10 ${borderColorStyles.simple} flex flex-col gap-10`} key={`${identifier}`}>
                            <div className={`flex flex-col md:flex-row mt-5 gap-7 md:gap-32`}>
                                <div className="md:w-[20%] my-auto h-10 flex flex-col">
                                    <div>
                                        <p className={`border-b-2 ${borderColorStyles.simple} text-center`}>
                                            {evaluationState.search.results[part][identifier].code} - {evaluationState.search.results[part][identifier].section}
                                            <span className="text-blue-500 dark:text-blue-400 ml-2">{part[0].toUpperCase()}</span>
                                        </p>
                                        <p className="font-['Source_Code_Pro'] text-center text-blue-500 dark:text-blue-400">
                                            {evaluationState.search.results[part][identifier][`${part}_evaluation_link`]}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col w-[100%] md:w-[70%] gap-3 md:max-w-[400px]">
                                    {evaluationState.search.results[part][identifier][`${part}_instructor_emails`].map((_, iIndex) => <div key={`${identifier}-${iIndex}`}>
                                        <div className="flex flex-row">
                                            <div className="w-[65px]"><LineInput customStyle={{ input: "text-[0.9rem] border-2 border-b-[1px] border-r-[1px] rounded-none rounded-tl-xl", label: "hidden" }} label="Initials" value={evaluationState.search.results[part][identifier][`${part}_instructor_initials`][iIndex]} onChangeFn={event => setOfferedSectionInstructorState(part, identifier, "initials", iIndex, event)} /></div>
                                            <div className="min-w-[200px] w-[100%]"><LineInput customStyle={{ input: "text-[0.9rem] border-2 border-b-[1px] border-l-[1px] rounded-none rounded-tr-xl", label: "hidden" }} label="Name" value={evaluationState.search.results[part][identifier][`${part}_instructor_names`][iIndex]} onChangeFn={event => setOfferedSectionInstructorState(part, identifier, "names", iIndex, event)} /></div>
                                        </div>
                                        <div className="w-[100%] flex flex-row">
                                            <div className="w-[90%]">
                                                <LineInput customStyle={{ input: "text-[0.9rem] border-2 border-2 border-t-[1px] border-r-[1px] rounded-none rounded-b-xl rounded-r-none", label: "hidden" }} label="Email" value={evaluationState.search.results[part][identifier][`${part}_instructor_emails`][iIndex]} onChangeFn={event => setOfferedSectionInstructorState(part, identifier, "emails", iIndex, event)} />
                                            </div>
                                            <div
                                                className={`flex w-[10%] p-2 h-[2.55rem] border-2 ${borderColorStyles.simple} border-l-[1px] border-t-[1px] rounded-br-xl my-auto justify-center !bg-[#fff]/[0.7] dark:!bg-[#171717]/[0.3] ${textColorStyles.clickable} cursor-pointer ${transitioner.simple}`}
                                                onClick={() => showReport(
                                                    evaluationState.search.results[part][identifier].code,
                                                    evaluationState.search.results[part][identifier].section,
                                                    evaluationState.search.results[part][identifier][`${part}_instructor_emails`][iIndex],
                                                    part
                                                )}
                                            >
                                                <span className="material-icons-round">description</span>
                                            </div>
                                        </div>
                                    </div>)}
                                </div>
                            </div>
                            {user.uid === "36QlTRZox2Oc6QEqVFdSSK8eg4y1" ? <div className="my-auto">
                                <PrimaryButton text="Save Changes" customStyle={"w-[100%]"} type="button" clickFunction={() => setOfferedSectionInstructor(identifier)} />
                            </div> : <></>}
                        </div>
                    })
                )}
            </div>
        </SimpleCard>
    </div>
}

export default EvaluationSearchPanel;