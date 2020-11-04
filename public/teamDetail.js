if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("/service-worker.js").then(function () {
            console.log('Pendaftaran SW Berhasil');
        }).catch(function () {
            console.log('Pendaftaran SW Gagal');
        })
    })
} else {
    console.log('SW belum didukung di browser ini');
}
document.addEventListener("DOMContentLoaded", async function () {
    const teamDetail = await teamDetailDOM().finally(() => {
        document.querySelector("#preloader").remove();;
    })
    const saveTeam = document.getElementById("saveTeam");
    saveTeam.onclick = function () {
        saveClubTeam(teamDetail);
        console.log('save clicked');
    }
})