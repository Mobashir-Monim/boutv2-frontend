import SimpleCard from "../../components/Card/SimpleCard";
import { LinearInput, RadioInput, CheckboxInput, TextInput, LineInput, DateInput, SelectInput } from "../../components/FormInputs/QuestionedInputs";
import { allQuestions } from "../../test";
import { pageLayoutStyles } from "../../utils/styles/styles";

const EvaluationForm = () => {
    const questions = allQuestions.theory;

    return <div className={`${pageLayoutStyles.scrollable} py-5 md:py-20`}>
        <div className="w-[90%] lg:w-[80%] xl:w-[70%] flex flex-col gap-10 mx-auto">
            <LinearInput
                question={questions.course["4f9e1c2a-44ea-4f99-8481-c4d8356cbd39"].display}
                // onChangeFn={}
                options={questions.course["4f9e1c2a-44ea-4f99-8481-c4d8356cbd39"].columns}
                labels={questions.course["4f9e1c2a-44ea-4f99-8481-c4d8356cbd39"].rows}
                identifier={"4f9e1c2a-44ea-4f99-8481-c4d8356cbd39"}
            />

            <RadioInput
                question={questions.course["e6bdf26e-5433-40f6-83d7-931f8d54f3a0"].display}
                // onChangeFn={}
                options={questions.course["e6bdf26e-5433-40f6-83d7-931f8d54f3a0"].rows}
                identifier={"e6bdf26e-5433-40f6-83d7-931f8d54f3a0"}
            />

            <CheckboxInput
                question={questions.faculty["de38dbd2-bf7d-43ec-9206-6b14da81ace8"].display}
                // onChangeFn={}
                options={questions.faculty["de38dbd2-bf7d-43ec-9206-6b14da81ace8"].rows}
                identifier={"de38dbd2-bf7d-43ec-9206-6b14da81ace8"}
            />
            <TextInput
                question={questions.faculty["de38dbd2-bf7d-43ec-9206-6b14da81ace8"].display}
                // onChangeFn={}
                options={questions.faculty["de38dbd2-bf7d-43ec-9206-6b14da81ace8"].rows}
                identifier={"de38dbd2-bf7d-43ec-9206-6b14da81ace8"}
            />
            <LineInput
                question={questions.faculty["de38dbd2-bf7d-43ec-9206-6b14da81ace8"].display}
                // onChangeFn={}
                options={questions.faculty["de38dbd2-bf7d-43ec-9206-6b14da81ace8"].rows}
                identifier={"de38dbd2-bf7d-43ec-9206-6b14da81ace8"}
            />
            <DateInput
                question={questions.faculty["de38dbd2-bf7d-43ec-9206-6b14da81ace8"].display}
                // onChangeFn={}
                options={questions.faculty["de38dbd2-bf7d-43ec-9206-6b14da81ace8"].rows}
                identifier={"de38dbd2-bf7d-43ec-9206-6b14da81ace8"}
            />

            <SelectInput
                question={questions.faculty["de38dbd2-bf7d-43ec-9206-6b14da81ace8"].display}
                // onChangeFn={}
                options={questions.faculty["de38dbd2-bf7d-43ec-9206-6b14da81ace8"].rows}
                identifier={"de38dbd2-bf7d-43ec-9206-6b14da81ace8"}
            />
        </div>
    </div>
}

export default EvaluationForm;