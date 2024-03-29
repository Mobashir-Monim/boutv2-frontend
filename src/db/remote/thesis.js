import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, orderBy, limit, deleteDoc, getDoc } from "firebase/firestore";

import { firestoreSnapshotFormatter } from "../../utils/functions/firestoreSnapshotFormatter";

const thesisInstanceCollection = "thesis_instances";
const thesisRegCollection = "thesis_registrations";
const thesisInstanceColRef = collection(db, thesisInstanceCollection);
const thesisRegColRef = collection(db, thesisRegCollection);

export const getThesisInstance = async ({ semester = null, year = null, instance_id }) => {
    let results = [];
    let snapshots = null;

    if (semester && year) {
        snapshots = await getDocs(query(
            thesisInstanceColRef,
            where("semester", "==", semester),
            where("year", "==", year),
        ))
    } else if (instance_id) {
        snapshots = await getDoc(doc(db, thesisInstanceCollection, instance_id));

        return [[snapshots.data(), instance_id]];
    } else {
        const now = new Date().getTime()
        snapshots = await getDocs(query(
            thesisInstanceColRef,
            where("end", ">=", now),
        ))
    }

    return firestoreSnapshotFormatter(snapshots, results);
}

const generateRegStats = regs => ({
    total: regs.length,
    projects: countRegType(regs, "project"),
    internships: countRegType(regs, "internship"),
    theses: countRegType(regs, "thesis")
});

const countRegType = (regs, type) => regs.filter(reg => reg[0].type === type).length;

const generateRegProcessStats = (regs, process_level) => ({
    supervisor: regs.filter(reg => reg[0].supervisor_approval === process_level).length,
    coordinator: regs.filter(reg => reg[0].supervisor_approval === 3 && reg[0].coordinator_approval === process_level).length
});

export const getThesisInstanceStats = async id => {
    const regs = await getThesisRegistrations({ instance_id: id });

    if (!regs[0][1])
        regs[0][0] = {};

    return {
        reg_stats: generateRegStats(regs),
        approval_stats: generateRegProcessStats(regs, 3),
        soft_reject_stats: generateRegProcessStats(regs, 2),
        hard_reject_stats: generateRegProcessStats(regs, 1),
        unprocessed_stats: generateRegProcessStats(regs, 0),
    }
}

export const getThesisRegistrations = async ({ member_email, supervisor_email, co_supervisor_email, instance_id }) => {
    let results = [];
    let snapshots = [];

    if (instance_id) {
        snapshots = await getDocs(query(thesisRegColRef, where("instance_id", "==", instance_id)));
    } else if (member_email) {
        snapshots = await getDocs(query(thesisRegColRef, where("member_emails", "array-contains", member_email)));
    } else if (supervisor_email) {
        snapshots = await getDocs(query(thesisRegColRef, where("supervisor", "array-contains", supervisor_email)));
    } else {
        snapshots = await getDocs(query(thesisRegColRef, where("co_supervisor_emails", "array-contains", co_supervisor_email)));
    }

    return firestoreSnapshotFormatter(snapshots, results);
}

export const getPendingThesisRegistrations = async (level, email) => {
    let results = [];
    let snapshots = [];

    if (level === "supervisor") {
        snapshots = await getDocs(query(thesisRegColRef, where("supervisor", "array-contains", email), where("supervisor_approval", "==", 0)));
    } else {
        snapshots = await getDocs(query(thesisRegColRef, where("coordinator_approval", "==", 0), where("supervisor_approval", "==", 3)));
    }

    return firestoreSnapshotFormatter(snapshots, results);
}

export const generateThesisNumber = async (semester, year) => {
    let num = "1";
    let snapshots = await getDocs(query(
        thesisRegColRef,
        where("coordinator_approval_at", "<=", new Date().getTime()),
        where("coordinator_approval_at", ">", -1),
        orderBy("coordinator_approval_at", "desc"),
        limit(1)
    ));

    if (snapshots.size !== 0)
        num = `${parseInt(snapshots.docs[0].data().number.slice(3)) + 1}`;

    let thesisNum = `${year.slice(2)}${semester === "Spring" ? "1" : (semester === "Summer" ? "2" : "3")}`;

    while (thesisNum.length + num.length !== 7)
        thesisNum = `${thesisNum}0`;

    return `${thesisNum}${num}`;
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
    credits_completed = [],
    supervisor_comment = "",
    coordinator_comment = "",
    co_supervisor_emails = [],
    additional_supervision_requests = [],
    additional_supervision_request_types = [],
    instance_id,
    number = "",
    level = "",
    panel = "",
    serial = "",
    coordinator_approval_at = -1
}) => ({
    type,
    title,
    abstract,
    supervisor,
    member_emails,
    supervisor_approval,
    coordinator_approval,
    credits_completed,
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
    coordinator_approval_at
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

export const deleteThesisRegistration = async id => {
    await deleteDoc(doc(db, thesisRegCollection, id));
}