import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";

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

const getUserRole = async (email, role) => await getDocs(query(
    roleUserColRef,
    where("email", "==", email),
    where("role", "==", role),
));

export const userHasRole = async (email, role) => (await getUserRole(email, role)).size > 0;
export const attachRole = async (email, role) => {
    const snapshots = await getUserRole(email, role);

    if (snapshots.size === 0)
        await addDoc(roleUserColRef, { email, role });
}
export const dettachRole = async (email, role) => {
    const snapshots = await getUserRole(email, role);

    if (snapshots.size > 0)
        await deleteDoc(doc(db, roleUserCollection, snapshots[0].id));
}
