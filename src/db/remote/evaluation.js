import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

const evaluationInstancesCollection = "evaluation_instances";
const evaluationQuestionsCollection = "evaluation_questions";
const evalInstColRef = collection(db, evaluationInstancesCollection);
const evalQuesColRef = collection(db, evaluationQuestionsCollection);


export const getEvaluationInstance = async ({ year, semester, entity = "CSE" }) => {
    const snapshots = await getDocs(query(
        evalInstColRef,
        where("year", "==", `${year}`),
        where("semester", "==", semester),
        where("entity", "==", entity)
    ));

    if (snapshots.size > 0)
        return [snapshots.docs[0].data(), snapshots.docs[0].id];

    return [null, null];
}

export const setEvaluationInstance = async evalObj => {
    let docRef = null;

    if (!evalObj.id) {
        docRef = await createEvaluationInstance(evalObj);
    } else {
        docRef = await updateEvaluationInstance(evalObj);
    }

    return docRef;
}

const createEvaluationInstance = async evalObj => {
    const docRef = await addDoc(evalInstColRef, evalObj);

    return docRef;
}

const updateEvaluationInstance = async ({ id, start, end, initiated, published }) => {
    const docRef = doc(db, evaluationInstancesCollection, id);
    await updateDoc(docRef, {
        start: start,
        end: end,
        initiated: initiated,
        published: published
    });

    return docRef;
}

export const getEvlauationQuestions = async ({ evalInstId }) => {
    const snapshots = await getDocs(query(
        evalQuesColRef,
        where("instance_id", "==", evalInstId)
    ));

    if (snapshots.size > 0)
        return [snapshots.docs[0].data(), snapshots.docs[0].id];

    return [null, null];
}

export const setEvaluationQuestions = async evalQuesObj => {
    let docRef = null;

    console.log(evalQuesObj.id);

    if (!evalQuesObj.id) {
        docRef = await createEvaluationQuestions(evalQuesObj);
    } else {
        docRef = await updateEvaluationQuestions(evalQuesObj);
    }

    return docRef;
}

const createEvaluationQuestions = async ({ evalInstId, questions }) => {
    const docRef = await addDoc(evalQuesColRef, {
        instance_id: evalInstId,
        questions: questions
    });

    return docRef;
}

const updateEvaluationQuestions = async ({ id, questions }) => {
    const docRef = doc(db, evaluationQuestionsCollection, id);

    await updateDoc(docRef, {
        questions: questions
    });

    return docRef;
}