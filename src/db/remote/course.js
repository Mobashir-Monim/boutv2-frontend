import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

const coursesCollection = "courses";
const offeredSectionsCollection = "offered_sections";
const courseColRef = collection(db, coursesCollection);
const offeredSectionColRef = collection(db, offeredSectionsCollection);

export const getCourse = async ({ entity, code }) => {
    const snapshots = await getDocs(query(
        courseColRef,
        where("entity", "==", entity),
        where("code", "==", code),
    ))

    if (snapshots.size > 0)
        return [snapshots.docs[0].data(), snapshots.docs[0].id];

    return [null, null];
}

export const getCourses = async ({ entity, code }) => {
    let results = {};
    let query = null;
    if (entity) { query = where("entity", "==", entity) }
    else { query = where("code", "==", code) }

    const snapshots = await getDocs(courseColRef, query);

    snapshots.forEach(snapshot => { results[snapshot.id] = snapshot.data() });

    return results;
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

export const getOfferedSections = async ({ section, code, year, semester, link_code }) => {
    let snapshots = { size: 0 };

    if (section && year && semester && code) {
        snapshots = await getOfferedSection(section, code, year, semester);
    } else if (year && semester && code) {
        snapshots = await getOfferedSectionsByCode(code, year, semester);
    } else if (link_code) {
        snapshots = await getOfferedSectionByLinkCode(link_code);
    } else {
        snapshots = await getOfferedSectionsInSemester(year, semester);
    }

    if (snapshots.size > 0) {
        if (snapshots.size > 1) {
            return snapshots;
        } else {
            return [snapshots.docs[0].data(), snapshots.docs[0].id];
        }
    }

    return [null, null];
}

const getOfferedSection = async (section, code, year, semester) => await getDocs(query(
    offeredSectionColRef,
    where("code", "==", code),
    where("year", "==", `${year}`),
    where("semester", "==", semester),
    where("section", "==", `${section}`),
));

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

export const setOfferedSection = async section => {
    let docRef = null;

    if (!section.id) {
        docRef = await createOfferedSection(section);
    } else {
        docRef = await updateOfferedSection(section);
    }

    return docRef;
}

const createOfferedSection = async ({ code, section, semester, year, lab_instructors, lab_evaluation_link, theory_instructors, theory_evaluation_link }) => {
    const docRef = await addDoc(offeredSectionColRef, {
        code,
        section,
        semester,
        year,
        lab_evaluation_link,
        theory_evaluation_link,
        lab_instructors,
        theory_instructors,
        lab_evaluation: "",
        theory_evaluation: "",
    });

    return docRef;
}

const updateOfferedSection = async ({ code, section, semester, year, lab_instructors, lab_evaluation_link, theory_instructors, theory_evaluation_link, lab_evaluation = "", theory_evaluation = "", id }) => {
    const docRef = doc(db, offeredSectionsCollection, id);
    await updateDoc(docRef, {
        code,
        section,
        semester,
        year,
        lab_instructors,
        lab_evaluation_link,
        theory_instructors,
        theory_evaluation_link,
        lab_evaluation,
        theory_evaluation
    });

    return docRef;
}