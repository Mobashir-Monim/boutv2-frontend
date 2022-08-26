export const firestoreSnapshotFormatter = (snapshots, results) => {
    if (snapshots.size > 0) {
        snapshots.forEach(snapshot => { results.push([snapshot.data(), snapshot.id]) });
    } else {
        results.push([null, null]);
    }

    return results;
}