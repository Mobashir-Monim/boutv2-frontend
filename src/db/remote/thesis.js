import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, orderBy, limit, deleteDoc } from "firebase/firestore";

import { firestoreSnapshotFormatter } from "../../utils/functions/firestoreSnapshotFormatter";

const thesisInstanceCollection = "thesis_instances";
const thesisRegCollection = "thesis_registrations";
const thesisInstanceColRef = collection(db, thesisInstanceCollection);
const thesisRegColRef = collection(db, thesisRegCollection);

export const getThesisInstance = async ({ semester = null, year = null }) => {
    let results = [];
    let snapshots = null;

    if (semester && year) {
        snapshots = await getDocs(query(
            thesisInstanceColRef,
            where("semester", "==", semester),
            where("year", "==", year),
        ))
    } else {
        const now = new Date().getTime()
        snapshots = await getDocs(query(
            thesisInstanceColRef,
            where("end", ">=", now),
        ))
    }

    return firestoreSnapshotFormatter(snapshots, results);
}

export const getThesisRegistrations = async ({ member_email, supervisor_email, co_supervisor_email }) => {
    let results = [];
    let snapshots = [];

    if (member_email) {

        snapshots = await getDocs(query(thesisRegColRef, where("member_emails", "in", [member_email])));
    } else if (supervisor_email) {
        snapshots = await getDocs(query(thesisRegColRef, where("supervisor", "in", [supervisor_email])));
    } else {
        snapshots = await getDocs(query(thesisRegColRef, where("co_supervisor_emails", "in", [co_supervisor_email])));
    }

    return firestoreSnapshotFormatter(snapshots, results);
}

export const setThesisRegistration = async (thesisRegApplication) => {
    let docRef = null;

    if (!thesisRegApplication.id) {
        docRef = await createThesisRegistration(thesisRegApplication);
    } else {
        docRef = await updateThesisRegistration(thesisRegApplication);
    }

    return docRef;
}

const formatThesisApplicationObject = ({
    type,
    title,
    abstract,
    supervisor,
    member_emails,
    supervisor_approval = 0,
    coordinator_approval = 0,
    supervisor_comment = "",
    coordinator_comment = "",
    co_supervisor_emails = [],
    additional_supervision_requests = [],
    additional_supervision_request_types = [],
    instance_id = "",
    number = "",
    level = "",
    panel = "",
    serial = "",
}) => ({
    type,
    title,
    abstract,
    supervisor,
    member_emails,
    supervisor_approval,
    coordinator_approval,
    supervisor_comment,
    coordinator_comment,
    co_supervisor_emails,
    additional_supervision_requests,
    additional_supervision_request_types,
    instance_id,
    number,
    level,
    panel,
    serial,
});

const createThesisRegistration = async (thesisRegApplication) => {
    const docRef = await addDoc(thesisRegColRef, formatThesisApplicationObject(thesisRegApplication));

    return docRef;
}

const updateThesisRegistration = async (thesisRegApplication) => {
    const docRef = doc(db, thesisRegCollection, thesisRegApplication.id);
    await updateDoc(docRef, formatThesisApplicationObject(thesisRegApplication));

    return docRef;
}