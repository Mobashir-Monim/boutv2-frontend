import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

import { firestoreSnapshotFormatter } from "../../utils/functions/firestoreSnapshotFormatter";

const coursesCollection = "courses";
const offeredSectionsCollection = "offered_sections";
const courseColRef = collection(db, coursesCollection);
const offeredSectionColRef = collection(db, offeredSectionsCollection);

export const getCourse = async ({ entity, code }) => {
    let results = [];
    const snapshots = await getDocs(query(
        courseColRef,
        where("entity", "==", entity),
        where("code", "==", code),
    ))

    return firestoreSnapshotFormatter(snapshots, results);
}

export const getCourses = async ({ entity, code }) => {
    let results = [], queryVar = null;
    if (entity) { queryVar = where("entity", "==", entity) }
    else { queryVar = where("code", "==", code) }

    const snapshots = await getDocs(courseColRef, queryVar);
    return firestoreSnapshotFormatter(snapshots, results);
}

export const setCourse = async course => {
    let docRef = null;

    if (!course.id) {
        docRef = await createCourse(course);
    } else {
        docRef = await updateCourse(course);
    }

    return docRef;
}

const createCourse = async ({ entity, code, name }) => {
    const docRef = await addDoc(courseColRef, { entity, code, name });

    return docRef;
}

const updateCourse = async ({ id, entity, code, name }) => {
    const docRef = doc(db, coursesCollection, id);
    await updateDoc(docRef, { entity, code, name });

    return docRef;
}

export const getOfferedSections = async ({ section, code, year, semester, link_code, faculty }) => {
    let snapshots = { size: 0 }, results = [];

    if (section && year && semester && code) {
        snapshots = await getOfferedSection(section, code, year, semester);
    } else if (year && semester && code) {
        snapshots = await getOfferedSectionsByCode(code, year, semester);
    } else if (link_code) {
        snapshots = await getOfferedSectionByLinkCode(link_code);
    } else if (faculty) {
        snapshots = await getDocs(query(offeredSectionColRef, where("theory_instructor_emails", "array-contains", faculty)));
        firestoreSnapshotFormatter(snapshots, results);
        snapshots = await getDocs(query(offeredSectionColRef, where("lab_instructor_emails", "array-contains", faculty)));
    } else {
        snapshots = await getOfferedSectionsInSemester(year, semester);
    }

    return firestoreSnapshotFormatter(snapshots, results);
}

export const getDelinkableSections = async (semester, year) => {
    let snapshots = null, results = [];
    snapshots = await getDocs(query(offeredSectionColRef, where("theory_evaluation_link", "!=", "")));
    results = firestoreSnapshotFormatter(snapshots, results);
    snapshots = await getDocs(query(offeredSectionColRef, where("lab_evaluation_link", "!=", "")));

    return firestoreSnapshotFormatter(snapshots, results);
}

export const getLinkableSections = async (semester, year) => {
    let results = []
    const snapshots = await getDocs(query(
        offeredSectionColRef,
        where("year", "==", `${year}`),
        where("semester", "==", semester),
        where("lab_evaluation_link", "==", ""),
        where("theory_evaluation_link", "==", ""),
    ));

    return firestoreSnapshotFormatter(snapshots, results);
}

const getOfferedSection = async (section, code, year, semester) => await getDocs(query(
    offeredSectionColRef,
    where("code", "==", code),
    where("year", "==", `${year}`),
    where("semester", "==", semester),
    where("section", "==", `${section}`),
))

const getOfferedSectionByLinkCode = async link_code => {
    let snapshots = await getOfferedTheorySectionByLinkCode(link_code);

    if (snapshots.size === 0)
        snapshots = await getOfferedLabSectionByLinkCode(link_code);

    return snapshots;
}

const getOfferedTheorySectionByLinkCode = async link_code => await getDocs(query(
    offeredSectionColRef,
    where("theory_evaluation_link", "==", link_code),
));

const getOfferedLabSectionByLinkCode = async link_code => await getDocs(query(
    offeredSectionColRef,
    where("lab_evaluation_link", "==", link_code),
));

const getOfferedSectionsByCode = async (code, year, semester) => await getDocs(query(
    offeredSectionColRef,
    where("code", "==", code),
    where("year", "==", `${year}`),
    where("semester", "==", semester),
));

const getOfferedSectionsInSemester = async (year, semester) => await getDocs(query(
    offeredSectionColRef,
    where("year", "==", `${year}`),
    where("semester", "==", semester),
));

export const getOfferedSectionsByFaculty = async (email, semester, year) => {
    let snapshots = { theory: [], lab: [] };



    let theory = await getDocs(query(offeredSectionColRef, where("theory_instructor_emails", "array-contains", email)));
    let lab = await getDocs(query(offeredSectionColRef, where("lab_instructor_emails", "array-contains", email)));

    if (semester && year) {
        theory = await getDocs(query(offeredSectionColRef, where("theory_instructor_emails", "array-contains", email), where("semester", "==", semester), where("year", "==", year)));
        lab = await getDocs(query(offeredSectionColRef, where("lab_instructor_emails", "array-contains", email), where("semester", "==", semester), where("year", "==", year)));
    } else {
        theory = await getDocs(query(offeredSectionColRef, where("theory_instructor_emails", "array-contains", email)));
        lab = await getDocs(query(offeredSectionColRef, where("lab_instructor_emails", "array-contains", email)));
    }

    theory.forEach(t => snapshots.theory.push([t.data(), t.id]));
    lab.forEach(l => snapshots.lab.push([l.data(), l.id]));

    return snapshots;
}

export const setOfferedSection = async section => {
    let docRef = null;

    if (!section.id) {
        docRef = await createOfferedSection(section);
    } else {
        docRef = await updateOfferedSection(section);
    }

    return docRef;
}

const createOfferedSection = async ({
    code,
    section,
    semester,
    year,
    lab_instructor_names,
    lab_instructor_emails,
    lab_instructor_initials,
    lab_evaluation_link = "",
    theory_instructor_names,
    theory_instructor_emails,
    theory_instructor_initials,
    theory_evaluation_link = "",
}) => {
    const docRef = await addDoc(offeredSectionColRef, {
        code,
        section,
        semester,
        year,
        lab_evaluation_link,
        theory_evaluation_link,
        lab_instructor_names,
        lab_instructor_emails,
        lab_instructor_initials,
        theory_instructor_names,
        theory_instructor_emails,
        theory_instructor_initials,
        lab_evaluation: "",
        theory_evaluation: "",
    });

    return docRef;
}

const updateOfferedSection = async ({
    code,
    section,
    semester,
    year,
    lab_evaluation_link = "",
    theory_evaluation_link = "",
    lab_instructor_names,
    lab_instructor_emails,
    lab_instructor_initials,
    theory_instructor_names,
    theory_instructor_emails,
    theory_instructor_initials,
    lab_evaluation = "",
    theory_evaluation = "",
    id }) => {
    const docRef = doc(db, offeredSectionsCollection, id);
    await updateDoc(docRef, {
        code,
        section,
        semester,
        year,
        lab_evaluation_link,
        theory_evaluation_link,
        lab_instructor_names,
        lab_instructor_emails,
        lab_instructor_initials,
        theory_instructor_names,
        theory_instructor_emails,
        theory_instructor_initials,
        lab_evaluation,
        theory_evaluation
    });

    return docRef;
}