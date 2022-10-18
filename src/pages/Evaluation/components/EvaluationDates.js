import { useEffect } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import { DateInput } from "../../../components/FormInputs/LabeledInputs";
import CardHeader from "../../../components/Headers/CardHeader";
import { cardStyles, modalBg } from "../../../utils/styles/styles";

const EvaluationDates = ({ show, toggleDateModal, setStartDate, setEndDate, startDate, endDate }) => {
    const escapeHandler = ({ keyCode }) => {
        if (keyCode === 27) { toggleDateModal(false); }
    }

    useEffect(() => {
        return () => window.addEventListener("keydown", escapeHandler);
    }, []);


    return <div className={`${modalBg.simple} ${show ? "" : "hidden"}`} onClick={() => { toggleDateModal(false) }}>
        <div className={`${cardStyles.simple} w-[90%] md:w-[70%] z-10 lg:w-[60%] mx-auto p-5`} onClick={event => event.stopPropagation()}>
            <div className="flex flex-row justify-end"><span className="material-icons-round cursor-pointer" onClick={() => { toggleDateModal(false) }}>close</span></div>
            <CardHeader title="Evaluation Dates" />
            <div className="flex flex-col mt-5 md:flex-row w-[100%] gap-5 justify-between">
                <div className="flex flex-col text-left md:w-[47%]">
                    <DateInput
                        name={"start"}
                        label={"Evaluation Start Date"}
                        onChangeFn={setStartDate}
                        minDate={(new Date()).toISOString().split("T")[0]}
                        value={startDate}
                    />
                </div>
                <div className="flex flex-col text-left md:w-[47%]">
                    <DateInput
                        name={"end"}
                        label={"Evaluation End Date"}
                        onChangeFn={setEndDate}
                        minDate={startDate}
                        value={endDate ? endDate : startDate}
                    />
                </div>
            </div>
            {/* <div className="text-right mt-5">
                <PrimaryButton text={"Confirm Dates"} />
            </div> */}
        </div>
    </div>
}

export default EvaluationDates;