import { createContext, useContext, useEffect, useState } from "react";
import { getEvaluationQuestions as getEvaluationQuestionsFromRemote } from "../../db/remote/evaluation";
import { getEvaluationQuestions as getEvaluationQuestionsFromLocal, setEvaluationQuestions } from "../../db/local/evaluation";
import { Outlet } from "react-router-dom";

export const EvaluationInstanceContext = createContext(undefined);
export const EvaluationQuestionsContext = createContext(undefined);

export const useEvaluationInstance = () => useContext(EvaluationInstanceContext);
export const useEvaluationQuestions = () => useContext(EvaluationQuestionsContext);

export const EvaluationInstanceProvider = ({ children }) => {
    const [evaluationInstance, setEvaluationInstance] = useState({
        id: null,
        year: null,
        semester: null,
        entity: null,
    });

    const storeEvaluationInstance = ({ id, year, semester, entity }) => {
        setEvaluationInstance({
            id: id,
            year: year,
            semester: semester,
            entity: entity
        });
    }

    const value = {
        evaluationInstance: evaluationInstance,
        storeEvaluationInstance: storeEvaluationInstance
    };

    return <EvaluationInstanceContext.Provider value={value}><Outlet /></EvaluationInstanceContext.Provider>
}

export const EvaluationQuestionsProvider = ({ children }) => {
    const { evaluationInstance } = useEvaluationInstance();
    const [questions, setQuestions] = useState({});

    useEffect(() => {
        (async () => {
            if (!evaluationInstance.id)
                return {};

            let questions = getEvaluationQuestionsFromLocal(evaluationInstance.semester, evaluationInstance.year);

            if (!questions) {
                questions = (await getEvaluationQuestionsFromRemote({ evalInstId: evaluationInstance.id }))[0];
                setEvaluationQuestions(questions[0].questions, evaluationInstance.semester, evaluationInstance.year);
            }

            setQuestions(questions);
        })();
    }, [evaluationInstance]);

    const value = {
        questions: questions
    };

    return <EvaluationQuestionsContext.Provider value={value}><Outlet /></EvaluationQuestionsContext.Provider>
}