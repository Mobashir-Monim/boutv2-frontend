import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

import { firestoreSnapshotFormatter } from "../../utils/functions/firestoreSnapshotFormatter";

const studentsCollection = "students";
const studentsColRef = collection(db, studentsCollection);

export const getStudents = async ({ official_emails = [], personal_emails = [], student_ids = [], usernames = [] }) => {
    let snapshots = { size: 0 }, results = [];
    let target = null;

    if (official_emails.length) {
        target = { param: official_emails, call: getStudentsByOfficialEmails };
    } else if (personal_emails.length) {
        target = { param: personal_emails, call: getStudentsByPersonalEmails };
    } else if (student_ids.length) {
        target = { param: student_ids, call: getStudentsByStudentIDs };
    } else {
        target = { param: usernames, call: getStudentsByUsernames };
    }

    for (let i = 0; i < target.param.length; i += 10) {
        snapshots = await target.call(target.param.slice(i, i + 10));
        firestoreSnapshotFormatter(snapshots, results);
    }


    return results;
}

const getStudentsByOfficialEmails = async emails => await getDocs(query(
    studentsColRef,
    where("official_email", "in", emails),
));

const getStudentsByPersonalEmails = async emails => await getDocs(query(
    studentsColRef,
    where("personal_email", "in", emails),
));

const getStudentsByStudentIDs = async student_ids => await getDocs(query(
    studentsColRef,
    where("student_id", "in", student_ids),
));

const getStudentsByUsernames = async usernames => await getDocs(query(
    studentsColRef,
    where("lms_username", "in", usernames),
));

export const setStudent = async student => {
    let docRef = null;

    if (!student.id) {
        docRef = createStudent(student)
    } else {
        docRef = updateStudent(student);
    }

    return docRef;
}

const createStudent = async ({
    department = "",
    lms_username = "",
    name,
    official_email,
    personal_email = "",
    phone = "",
    program = "",
    school = "",
    student_id
}) => {
    const docRef = await addDoc(studentsColRef, {
        department,
        lms_username,
        name,
        official_email,
        personal_email,
        phone,
        program,
        school,
        student_id
    });

    return docRef;
}

const updateStudent = async ({
    id,
    department = "",
    lms_username = "",
    name,
    official_email,
    personal_email = "",
    phone = "",
    program = "",
    school = "",
    student_id
}) => {
    const docRef = doc(db, studentsCollection, id);
    await updateDoc(docRef, {
        department,
        lms_username,
        name,
        official_email,
        personal_email,
        phone,
        program,
        school,
        student_id
    });

    return docRef;
}