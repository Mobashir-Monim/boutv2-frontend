import { useState } from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import SelectInput from "../../components/FormInputs/SelectInput";
import CardHeader from "../../components/Headers/CardHeader";
import SimpleCard from "../../components/Card/SimpleCard";
import { cardStyles } from "../../utils/styles";

const Evaluation = () => {
    const years = Array((new Date()).getUTCFullYear() - 2022 + 1).fill().map((_, idx) => (new Date()).getUTCFullYear() + idx);
    const semesters = ["Spring", "Summer", "Fall"];

    const [pageState, setPageState] = useState({
        evaluationViewForm: { year: years[0], semester: semesters[0] }
    })

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
            <SimpleCard title="Evaluation Admin" width="w-[100%] lg:w-[35%]">
                <SecondaryButton text={"Dates"} link={"/evaluation/dates"} />
                <SecondaryButton text={"Questions"} link={"/evaluation/questions"} />
                <SecondaryButton text={"Analysis"} link={"/evaluation/analysis"} />
            </SimpleCard>
        </div>
    </div>
}

export default Evaluation;