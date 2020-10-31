console.log("API CALL");
const BASEURL = "https://api.football-data.org/v2";
const APIKEY = "ca68614c1778414898dfdac44886b575";
const d = new Date();
const today = new Date(d.getFullYear(),d.getMonth(),d.getDate()).toISOString().split("T")[0];
const nextSevenDay = new Date(d.getFullYear(),d.getMonth(),d.getDate()+7).toISOString().split("T")[0];
const ADDITIONALHEADERS = {
    "X-Auth-Token": APIKEY
};

async function jadwalTanding() {
    try {
        let response = await (await fetch(`${BASEURL}/matches?competitions=2001&dateFrom=${today}&dateTo=${nextSevenDay}`, { headers: ADDITIONALHEADERS })).json();
        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function klasemenLiga() {
    try {
        let response = await (await fetch(`${BASEURL}/competitions/2001/standings`, { headers: ADDITIONALHEADERS })).json();
        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(error);
    }

}
async function TeamDetail(id) {
    try {
        let response = await (await fetch(`${BASEURL}/teams/${id}`, { headers: ADDITIONALHEADERS })).json();
        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(error);
    }
}
