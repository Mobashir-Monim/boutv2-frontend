import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, orderBy, limit, deleteDoc } from "firebase/firestore";

import { firestoreSnapshotFormatter } from "../../utils/functions/firestoreSnapshotFormatter";

const studentsCollection = "students";
const studentInfoUpdateRequestCollection = "student_info_update_requests";
const studentsColRef = collection(db, studentsCollection);
const studentInfoUpdateRequestColRef = collection(db, studentInfoUpdateRequestCollection);

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
    student_id,
    discord_id = "",
    advising_verification_code = "",
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
        student_id,
        discord_id,
        advising_verification_code,
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
    student_id,
    discord_id = "",
    advising_verification_code = "",
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
        student_id,
        discord_id,
        advising_verification_code,
    });

    return docRef;
}

export const getStudentsInfoUpdateRequest = async email => {
    let results = [];
    const snapshots = await getDocs(query(studentInfoUpdateRequestColRef, where("email", "==", email)));

    return firestoreSnapshotFormatter(snapshots, results);
}

export const getStudentsInfoUpdateRequests = async () => {
    let results = [];
    const snapshots = await getDocs(query(studentInfoUpdateRequestColRef, orderBy("email", "desc"), limit(5)));

    return firestoreSnapshotFormatter(snapshots, results);
}

export const setStudentInfoUpdateRequest = async updateRequest => {
    const existingReq = await getStudentsInfoUpdateRequest(updateRequest.email);

    if (!existingReq[0][1]) {
        await addDoc(studentInfoUpdateRequestColRef, { ...updateRequest });
        return "Successfully placed update request.";
    } else {
        return "You already have an existing request, please wait for it to be processed."
    }
}

export const deleteStudentInfoUpdateRequest = async id => {
    await deleteDoc(doc(db, studentInfoUpdateRequestCollection, id));
}