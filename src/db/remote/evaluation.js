import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

import { firestoreSnapshotFormatter } from "../../utils/functions/firestoreSnapshotFormatter";

const evaluationInstancesCollection = "evaluation_instances";
const evaluationQuestionsCollection = "evaluation_questions";
const evaluationSubmissionsCollection = "evaluation_submissions";
const evalInstColRef = collection(db, evaluationInstancesCollection);
const evalQuesColRef = collection(db, evaluationQuestionsCollection);
const evalSubColRef = collection(db, evaluationSubmissionsCollection);


export const getEvaluationInstance = async ({ year, semester, entity = "CSE" }) => {
    let results = [];
    const snapshots = await getDocs(query(
        evalInstColRef,
        where("year", "==", `${year}`),
        where("semester", "==", semester),
        where("entity", "==", entity)
    ));

    return firestoreSnapshotFormatter(snapshots, results);
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

export const getEvaluationQuestions = async ({ evalInstId }) => {
    let results = [];
    const snapshots = await getDocs(query(
        evalQuesColRef,
        where("instance_id", "==", evalInstId)
    ));

    return firestoreSnapshotFormatter(snapshots, results);
}

export const setEvaluationQuestions = async evalQuesObj => {
    let docRef = null;

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

export const addEvaluationSubmission = async ({ offered_section_id, part, response, user_uid }) => {
    const docRef = await addDoc(evalSubColRef, {
        offered_section_id,
        part,
        response,
        user_uid
    });

    return docRef;
}

export const getEvaluationSubmissions = async ({ offered_section_id, offered_section_ids, part }) => {
    let snapshots = null;
    let results = [];

    if (part) {
        if (offered_section_id) {
            snapshots = await getDocs(query(evalSubColRef, where("part", "==", part), where("offered_section_id", "==", offered_section_id)));
        } else {
            snapshots = await getDocs(query(evalSubColRef, where("part", "==", part), where("offered_section_id", "in", offered_section_ids)));
        }
    } else {
        if (offered_section_id) {
            snapshots = await getDocs(query(evalSubColRef, where("offered_section_id", "==", offered_section_id)));
        } else {
            snapshots = await getDocs(query(evalSubColRef, where("offered_section_id", "in", offered_section_ids)));
        }
    }

    return firestoreSnapshotFormatter(snapshots, results);
}





