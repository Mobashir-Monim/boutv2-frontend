export const firestoreSnapshotFormatter = (snapshots, results) => {
    if (snapshots.size > 0) {
        if (results.length > 0) {
            if (results[0][1] === null)
                delete results[0];
        }

        snapshots.forEach(snapshot => { results.push([snapshot.data(), snapshot.id]) });
    } else if (results.length === 0) {
        results.push([null, null]);
    }

    return results;
}