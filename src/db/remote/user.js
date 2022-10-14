import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

import { firestoreSnapshotFormatter } from "../../utils/functions/firestoreSnapshotFormatter";

const roleUserCollection = "role_user";
const roleUserColRef = collection(db, roleUserCollection);

export const getUserRoles = async (email) => {
    let results = [];

    const snapshots = await getDocs(query(
        roleUserColRef,
        where("email", "==", email),
    ));

    return firestoreSnapshotFormatter(snapshots, results);
}

export const userHasRole = async (email, role) => {
    const snapshots = await getDocs(query(
        roleUserColRef,
        where("email", "==", email),
        where("role", "==", role),
    ));

    return snapshots.size > 0;
}