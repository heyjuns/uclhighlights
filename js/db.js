var dbPromised = idb.open("klub-bola", 1, function (upgradeDb) {
    var articlesObjectStore = upgradeDb.createObjectStore("club", {
        keyPath: "id"
    });
    articlesObjectStore.createIndex("name", "name", { unique: false });
});

async function saveClubTeam(team) {
    try {
        const promise = await dbPromised;
        const transaction = await promise.transaction("club", "readwrite").objectStore("club");
        await transaction.add(team);
        await transaction.complete;
        return alert("Berhasil menyimpan team");
    } catch (error) {
        alert(("Team yang ingin disimpan sudah ada"));
    }
}

async function deleteTeam(id) {
    try {
        const promise = await dbPromised;
        const transaction = await promise.transaction("club", "readwrite").objectStore("club");
        await transaction.delete(id);
        await transaction.complete;
        alert("Berhasil menghapus Team");
        return savedClubTeamDOM();
    } catch (error) {
        alert(`Gagal menghapus Team. Error: ${error}`);
    }
}

function getAll() {
    return new Promise(async function (resolve, reject) {
        try {
            const promise = await dbPromised;
            const transaction = promise.transaction("club", "readonly").objectStore("club").getAll();
            resolve(transaction);
            return transaction;
        } catch (error) {
            reject(error);
        }
    });
}
