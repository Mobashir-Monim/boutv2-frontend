import QuestionCard from "../../components/Card/QuestionCard";
import { useEffect, useState } from "react";
import { LinearInput, RadioInput, CheckboxInput, TextInput, LineInput, DateInput, SelectInput, RadioGridInput } from "../../components/FormInputs/QuestionedInputs";
import { bgColorStyles, buttonStyles, pageLayoutStyles, transitioner } from "../../utils/styles/styles";
import { deepClone } from "../../utils/functions/deepClone";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";

import { getOfferedSections } from "../../db/remote/course";
import { getEvaluationInstance, getEvaluationQuestions, addEvaluationSubmission } from "../../db/remote/evaluation";
import { auth } from "../../db/remote/firebase"

import { signInAnonymously } from "firebase/auth";

const EvaluationForm = () => {
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    useEffect(() => {
        if (!auth.currentUser) {
            signInAnonymously(auth)
                .then(() => { })
                .catch((error) => {
                    alert("Something went wrong. Please refresh the page and check if you have access to the internet");
                });
        }
    });

    const buildQuestions = (questions, facultyMembers) => {
        const printableQuestions = { course: {}, faculty: {} };
        const parts = ["course", "faculty"];

        for (let part in parts) {
            if (parts[part] === "course") {
                for (let identifier in questions[parts[part]]) {
                    printableQuestions[parts[part]][`${parts[part]}--${identifier}`] = questions[parts[part]][identifier];
                }
            } else {
                for (let f in facultyMembers) {
                    for (let identifier in questions[parts[part]]) {
                        printableQuestions[parts[part]][`${parts[part]}--${f}--${identifier}`] = {
                            ...questions[parts[part]][identifier],
                            display: <>
                                <span className="block">{questions[parts[part]][identifier].display}</span>
                                <span className="block text-[0.9rem]">Faculty Name: <b className="text-orange-600">{facultyMembers[f].name}</b></span>
                                <span className="block text-[0.9rem]">Faculty Initials: <b className="text-orange-400">{facultyMembers[f].initials}</b></span>
                            </>
                        };

                    }
                }
            }
        }

        return printableQuestions;
    }

    const createResponseObject = questions => {
        let responses = {};

        for (let part in questions) {
            for (let identifier in questions[part]) {
                if (
                    questions[part][identifier].type === "short"
                    || questions[part][identifier].type === "paragraph"
                    || questions[part][identifier].type === "radio"
                    || questions[part][identifier].type === "dropdown"
                    || questions[part][identifier].type === "linear"
                ) {
                    responses[identifier] = ""
                } else if (questions[part][identifier].type === "checkbox") {
                    responses[identifier] = []
                } else if (
                    questions[part][identifier].type === "radioGrid"
                    || questions[part][identifier].type === "checkboxGrid"
                ) {
                    responses[identifier] = {};
                    for (let i = 0; i < questions[part][identifier].rows.length; i++) {
                        responses[identifier][`${identifier}--${i}`] =
                            questions[part][identifier].type === "radioGrid" ? "" : [];
                    }
                }
            }
        }

        return responses;
    }

    const [formState, setFormState] = useState({
        questions: {},
        semester: null,
        year: null,
        code: "",
        responses: {},
        offered_section: [null, null],
        part: null,
        invalid_code: null,
        submitted: false,
    });

    const generateInstructorsObject = (offeredSection, part) => {
        let instructors = [];

        for (let i in offeredSection[`${part}_instructor_emails`]) {
            instructors.push({
                initials: offeredSection[`${part}_instructor_initials`][i],
                email: offeredSection[`${part}_instructor_emails`][i],
                name: offeredSection[`${part}_instructor_names`][i],
            });
        }

        return instructors;
    }

    const showForm = async (evalInstId, evaluationInstance, offeredSection, offeredSectionId) => {
        const formStateClone = deepClone(formState);
        formStateClone.part = formState.code === offeredSection.theory_evaluation_link ? "theory" : "lab";
        formStateClone.year = evaluationInstance.year;
        formStateClone.semester = evaluationInstance.semester;
        formStateClone.offered_section = [offeredSection, offeredSectionId];
        let [questions] = (await getEvaluationQuestions({ evalInstId: evalInstId }))[0];
        formStateClone.questions = buildQuestions(JSON.parse(questions.questions)[formStateClone.part], generateInstructorsObject(offeredSection, formStateClone.part));
        formStateClone.responses = createResponseObject(formStateClone.questions);
        setFormState(formStateClone);
    }

    const isFilled = identifier => {
        const question = formState.questions[identifier.split("--")[0]][identifier];
        let filled = true;

        if (
            question.type === "short"
            || question.type === "paragraph"
            || question.type === "radio"
            || question.type === "dropdown"
            || question.type === "linear"
        ) {
            filled = filled && formState.responses[identifier] !== "";
        } else if (question.type === "checkbox") {
            filled = filled && formState.responses[identifier].length !== 0;
        } else if (
            question.type === "radioGrid"
            || question.type === "checkboxGrid"
        ) {
            for (let p in formState.responses[identifier]) {
                if (question.type === "radioGrid") {
                    filled = filled && formState.responses[identifier][p] !== "";
                } else {
                    filled = filled && formState.responses[identifier][p].length !== 0;
                }
            }
        }

        return filled;
    }

    const isSubmittable = () => {
        let submittable = true;

        for (let part in formState.questions) {
            for (let identifier in formState.questions[part]) {
                if (formState.questions[part][identifier].required)
                    submittable = submittable && isFilled(identifier);
            }
        }

        return submittable;
    }

    const submitEvaluation = async () => {
        if (isSubmittable()) {
            showLoadingScreen("Submitting evaluation, please wait");

            await addEvaluationSubmission({
                offered_section_id: formState.offered_section[1],
                part: formState.part,
                response: formState.responses,
                user_uid: auth.currentUser.uid
            });

            const formStateClone = deepClone(formState);
            formStateClone.submitted = true;

            setFormState(formStateClone);
            hideLoadingScreen();
        } else {
            alert("Please fill up all the required questions");
        }

    }

    const validateCode = async () => {
        showLoadingScreen("Validating code, please wait");
        let flag = false;

        if (formState.code.length === 10) {
            const [section, section_id] = (await getOfferedSections({ link_code: formState.code }))[0];
            if (section_id) {
                const [evaluationInstance, evalInstId] = (await getEvaluationInstance({ year: section.year, semester: section.semester }))[0];

                if (evalInstId) {
                    const now = (new Date()).getTime();

                    if (
                        now > (new Date(`${evaluationInstance.start}T00:00:01.000+06:00`)).getTime()
                        && now < (new Date(`${evaluationInstance.end}T23:59:59.000+06:00`).getTime())
                        && evaluationInstance.initiated
                        && !evaluationInstance.published
                    ) {
                        flag = true;
                        showForm(evalInstId, evaluationInstance, section, section_id);
                    }
                }
            }
        }

        if (!flag)
            setFormState({ ...formState, invalid_code: true });

        hideLoadingScreen();
    }

    const setStringInput = (event, identifier, row = undefined) => {
        const formStateClone = deepClone(formState);

        if (row !== undefined) {
            formStateClone.responses[identifier][`${identifier}--${row}`] = event.target.value;
        } else {
            if (typeof formStateClone.responses[identifier] !== "object") {
                formStateClone.responses[identifier] = event.target.value;
            }
        }

        setFormState(formStateClone);
    }

    const setCheckboxInput = (event, identifier) => {
        const formStateClone = deepClone(formState);

        if (formStateClone.responses[identifier].indexOf(event.target.value) !== -1) {
            let temp = [...formStateClone.responses[identifier]];
            temp.splice(temp.indexOf(event.target.value), 1);
            formStateClone.responses[identifier] = temp;
        } else {
            formStateClone.responses[identifier].push(event.target.value);
        }

        setFormState(formStateClone);
    }

    const enterCode = event => setFormState({ ...formState, code: event.target.value, invalid_code: false });
    const getLinearInput = (question, identifier) => <LinearInput required={question.required && !isFilled(identifier)} question={question.display} onChangeFn={event => setStringInput(event, identifier)} options={question.columns} labels={question.rows} identifier={identifier} />
    const getRadioInput = (question, identifier) => <RadioInput required={question.required && !isFilled(identifier)} question={question.display} onChangeFn={event => setStringInput(event, identifier)} options={question.rows} identifier={identifier} />
    const getCheckboxInput = (question, identifier) => <CheckboxInput required={question.required && !isFilled(identifier)} question={question.display} onChangeFn={event => setCheckboxInput(event, identifier)} options={question.rows} identifier={identifier} />
    const getTextInput = (question, identifier) => <TextInput required={question.required && !isFilled(identifier)} question={question.display} onChangeFn={event => setStringInput(event, identifier)} options={question.rows} identifier={identifier} />
    const getLineInput = (question, identifier) => <LineInput required={question.required && !isFilled(identifier)} preventPaste={true} question={question.display} onChangeFn={event => setStringInput(event, identifier)} options={question.rows} identifier={identifier} />
    const getDateInput = (question, identifier) => <DateInput required={question.required && !isFilled(identifier)} question={question.display} onChangeFn={event => setStringInput(event, identifier)} options={question.rows} identifier={identifier} />
    const getSelectInput = (question, identifier) => <SelectInput required={question.required && !isFilled(identifier)} question={question.display} onChangeFn={event => setStringInput(event, identifier)} options={question.rows} identifier={identifier} />
    const getRadioGridInput = (question, identifier) => <RadioGridInput required={question.required && !isFilled(identifier)} question={question.display} onChangeFn={(event, row) => setStringInput(event, identifier, row)} labels={question.rows} options={question.columns} identifier={identifier} />

    const getPrintableQuestion = target => {
        let printables = [];

        for (let identifier in formState.questions[target]) {
            switch (formState.questions[target][identifier].type) {
                case "radio":
                    printables.push(getRadioInput(formState.questions[target][identifier], identifier));
                    break;
                case "checkbox":
                    printables.push(getCheckboxInput(formState.questions[target][identifier], identifier));
                    break;
                case "dropdown":
                    printables.push(getSelectInput(formState.questions[target][identifier], identifier));
                    break;
                case "linear":
                    printables.push(getLinearInput(formState.questions[target][identifier], identifier));
                    break;
                case "radioGrid":
                    printables.push(getRadioGridInput(formState.questions[target][identifier], identifier));
                    break;
                case "paragraph":
                    printables.push(getTextInput(formState.questions[target][identifier], identifier));
                    break;
                case "short":
                    printables.push(getLineInput(formState.questions[target][identifier], identifier));
                    break;
                default:
                    break;
            }
        }

        return printables;
    }

    const resetForm = () => {
        setFormState({
            questions: {},
            semester: null,
            year: null,
            code: "",
            responses: {},
            offered_section: [null, null],
            part: null,
            invalid_code: null,
            submitted: false,
        });
    }

    const getEvaluationForm = () => <div className="w-[90%] lg:w-[80%] xl:w-[70%] flex flex-col gap-10 mx-auto">
        <QuestionCard title={`Evaluation Form for ${formState.year} ${formState.semester}`} />
        {getPrintableQuestion("course").map((q, qIndex) => <div key={`course-q-${qIndex}`}>{q}</div>)}
        {getPrintableQuestion("faculty").map((q, qIndex) => <div key={`faculty-q-${qIndex}`}>{q}</div>)}
        <button type="button" className={`${buttonStyles.primary}`} onClick={submitEvaluation}>Submit Evaluation</button>
    </div>

    const getCodeInput = () => <div className="w-[90%] lg:w-[60%] xl:w-[40%] flex flex-col gap-10 mx-auto">
        <LineInput question={"Please enter evaluation code:"} customStyle={{ input: "font-['Source_Code_Pro']" }} max="10" min="10" preventPaste={window.location.hostname !== "localhost"} placeholder="Evaluation Code" onChangeFn={enterCode} />

        {<p className={`text-center ${bgColorStyles.contrast} rounded-full py-2 text-rose-500 ${formState.invalid_code ? "opacity-100" : "opacity-0"} ${transitioner.simple}`}>Invalid code entered</p>}

        <button type="button" className={`${buttonStyles.primary}`} onClick={validateCode}>Confirm Code</button>
    </div>

    const getPostSubmit = () => <div className="w-[90%] lg:w-[60%] xl:w-[40%] flex flex-col gap-10 mx-auto">
        <QuestionCard title={<span className="text-[1.5rem] text-blue-600 dark:text-blue-400">Evaluation submitted</span>}>
            <div className="flex flex-col gap-10 mt-5">
                Thank you for submitting the evaluation!!

                <button type="button" className={`${buttonStyles.primary}`} onClick={resetForm}>Evaluate another course</button>
            </div>
        </QuestionCard>
    </div>

    const getPageContent = () => {
        if (formState.submitted) {
            return getPostSubmit();
        } else if (
            formState.code.length < 10
            || formState.invalid_code
            || formState.semester === null
            || formState.year === null
        ) {
            return getCodeInput();
        } else {
            return getEvaluationForm();
        }
    }

    return <div className={`${pageLayoutStyles.scrollable} justify-center flex flex-col py-10 md:py-20`}>
        {getPageContent()}
    </div>
}

export default EvaluationForm;