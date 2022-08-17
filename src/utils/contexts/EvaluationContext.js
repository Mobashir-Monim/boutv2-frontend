import { createContext, useContext, useState } from "react";
import { Outlet } from "react-router-dom";

export const EvaluationInstanceContext = createContext(undefined);

export const useEvaluationInstance = () => useContext(EvaluationInstanceContext);

export const EvaluationInstanceProvider = () => {
    const [evaluationInstance, setEvaluationInstance] = useState({
        id: null,
        year: null,
        semester: null,
        entity: null,
    });

    const storeEvaluationInstance = ({ id, year, semester, entity }) => {
        setEvaluationInstance({
            id: id ? id : evaluationInstance.id,
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