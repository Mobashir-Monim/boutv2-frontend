import { useState } from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import SelectInput from "../../components/FormInputs/SelectInput";
import CardHeader from "../../components/Headers/CardHeader";
import SimpleCard from "../../components/Card/SimpleCard";
import { cardStyles } from "../../utils/styles";
import EvaluationDates from "./Admin/EvaluationDates";

const Evaluation = () => {
    const years = Array((new Date()).getUTCFullYear() - 2022 + 1).fill().map((_, idx) => (new Date()).getUTCFullYear() + idx);
    const semesters = ["Spring", "Summer", "Fall"];

    const [pageState, setPageState] = useState({
        evaluationViewForm: { year: years[0], semester: semesters[0] },
        evaluationViewDates: { show: false, start: (new Date()).toISOString().split("T")[0], end: null }
    });

    const toggleEvaluationDatesModal = (show) => {
        show = typeof (show) === "boolean" ? show : !pageState.evaluationViewDates.show;
        setPageState({
            ...pageState,
            evaluationViewDates: { ...pageState.evaluationViewDates, show: show }
        })
    }

    const fetchEvaluationSemesterData = event => {
        alert("Feature not complete yet")
        event.preventDefault();
    }

    const selectEvaluationSemester = event => {
        setPageState({
            ...pageState,
            evaluationViewForm: { ...pageState.evaluationViewForm, semester: event.target.value }
        })
    }

    const selectEvaluationYear = event => {
        setPageState({
            ...pageState,
            evaluationViewForm: { ...pageState.evaluationViewForm, year: event.target.value }
        })
    }

    const setStartDate = event => {
        setPageState({
            ...pageState,
            evaluationViewDates: { ...pageState.evaluationViewDates, start: event.target.value }
        })
    }

    const setEndDate = event => {
        setPageState({
            ...pageState,
            evaluationViewDates: { ...pageState.evaluationViewDates, end: event.target.value }
        })
    }

    return <div className="w-[90%] mx-auto min-h-[95vh]">
        <div className="flex flex-col md:flex-row gap-y-10 md:justify-between">
            <form className={`w-[100%] lg:w-[60%] ${cardStyles.simple}`} onSubmit={fetchEvaluationSemesterData}>
                <CardHeader title="Select evaluation semester" />
                <div className="flex flex-col mt-5 md:flex-row w-[100%] justify-between">
                    <div className="flex flex-col text-left md:w-[47%]">
                        <SelectInput name={"year"} label={"Evaluation Year"} options={years} onChangeFn={selectEvaluationYear} />
                    </div>
                    <div className="flex flex-col text-left md:w-[47%]">
                        <SelectInput name={"semester"} label={"Evaluation Semester"} options={semesters} onChangeFn={selectEvaluationSemester} />
                    </div>
                </div>
                <div className="text-right mt-5">
                    <PrimaryButton text="Confirm semester" type="submit" />
                </div>
            </form>
            <SimpleCard title="Evaluation Admin Checklist" width="w-[100%] lg:w-[35%]">
                <div className="flex flex-row flex-wrap mt-5 justify-between gap-5 mx-auto">
                    <SecondaryButton text={"Set Questions"} link={"/evaluation/questions"} />
                    <SecondaryButton text={"Set Dates"} clickFunction={toggleEvaluationDatesModal} />
                    <SecondaryButton text={"Set Matrix"} link={"/evaluation/analysis"} />
                    <SecondaryButton text={"Initiate Collection"} link={"/evaluation/initiate"} />
                    <SecondaryButton text={"Publish Results"} link={"/evaluation/publish"} />
                </div>
            </SimpleCard>
        </div>
        <EvaluationDates
            show={pageState.evaluationViewDates.show}
            toggleDateModal={toggleEvaluationDatesModal}
            startDate={pageState.evaluationViewDates.start}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
        />
    </div>
}

export default Evaluation;