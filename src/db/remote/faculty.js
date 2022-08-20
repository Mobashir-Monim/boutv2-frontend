import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

const facultyCollection = "faculty_members";
const facultyColRef = collection(db, facultyCollection);

export const getFacultyMember = async ({ email }) => {
    const snapshots = await getDocs(query(
        facultyColRef,
        where("email", "==", email),
    ))

    if (snapshots.size > 0)
        return [snapshots.docs[0].data(), snapshots.docs[0].id];

    return [null, null];
}

export const getFacultyMembers = async ({ entity, email }) => {
    let results = {};

    if (entity) {
        const snapshots = await getDocs(facultyColRef, where("entity", "==", entity));
        snapshots.forEach(snapshot => { results[snapshot.id] = snapshot.data() });
    }

    if (email) {
        const snapshots = await getDocs(facultyColRef, where("email", "==", email));
        snapshots.forEach(snapshot => {
            if (!(snapshot.id in results)) results[snapshot.id] = snapshot.data();
        });
    }

    return results;
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