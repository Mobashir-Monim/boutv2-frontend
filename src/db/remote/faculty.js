import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

import { firestoreSnapshotFormatter } from "../../utils/functions/firestoreSnapshotFormatter";

const facultyCollection = "faculty_members";
const facultyColRef = collection(db, facultyCollection);

export const getFacultyMember = async ({ email }) => {
    let results = []
    const snapshots = await getDocs(query(facultyColRef, where("email", "==", email)));

    return firestoreSnapshotFormatter(snapshots, results);
}

export const getFacultyMembers = async ({ entity }) => {
    let results = [];
    const snapshots = await getDocs(facultyColRef, where("entity", "==", entity));

    return firestoreSnapshotFormatter(snapshots, results);
}

export const setFaculty = async faculty => {
    let docRef = null;

    if (!faculty.id) {
        docRef = await createFaculty(faculty);
    } else {
        docRef = await updateFaculty(faculty);
    }

    return docRef;
}

const createFaculty = async ({ entity, name, email, initials }) => {
    const docRef = await addDoc(facultyColRef, { entity, name, email, initials });

    return docRef;
}

const updateFaculty = async ({ id, entity, name, email, initials }) => {
    const docRef = doc(db, facultyCollection, id);
    await updateDoc(docRef, { entity, name, email, initials });

    return docRef;
}