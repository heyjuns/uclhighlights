async function pertandinganDOM() {
    console.log("pertandingan DOM");
    const cacheUrl = `${BASEURL}/matches?competitions=2001`;
    return new Promise(async (resolve, reject) => {
        try {
            if ("caches" in window) {
                let objectFromCaches = await (await caches.match(cacheUrl)).json();
                if (objectFromCaches) {
                    console.log(`cache ${cacheUrl} found, load data from cache`);
                    generateDataForPertandingan(objectFromCaches);
                    resolve(objectFromCaches);
                }
            }
        } catch (error) {
            console.log(`cache ${cacheUrl} not found, load data from API`);
            try {
                let objectFromAPI = await jadwalTanding();
                generateDataForPertandingan(objectFromAPI);
                resolve(objectFromAPI);
            } catch (error) {
                reject(error);
            }

        }
    });
};
async function savedClubTeamDOM() {
    const savedData = await getAll();
    console.log(savedData);
    generateDataForSavedTeam(savedData);
}
async function klasemenDOM() {
    const cacheUrl = `${BASEURL}/competitions/2001/standings`;
    return new Promise(async (resolve, reject) => {
        try {
            // mencoba cek apakah caches sudah ada
            if ("caches" in window) {
                let objectFromCaches = await (await caches.match(cacheUrl)).json();
                if (objectFromCaches) {
                    let TOTALTYPE = objectFromCaches.standings.filter(x => x.type === "TOTAL");
                    console.log(`cache ${cacheUrl} found, load data from cache`);
                    generateDataForKlasemen(TOTALTYPE);
                    resolve(TOTALTYPE);
                }
            }
        } catch (error) {
            console.log(`cache ${cacheUrl} not found, load data from API`);
            try {
                let data = await klasemenLiga();
                // Filter array untuk mengambil properti type === "TOTAL"
                let TOTALTYPE = data.standings.filter(x => x.type === "TOTAL");
                generateDataForKlasemen(TOTALTYPE);
                resolve(TOTALTYPE);
            } catch (error) {
                reject(error);
            }
        }
    });
}
function teamDetailDOM() {
    const idParam = new URLSearchParams(window.location.search).get("id");
    const cacheUrl = `${BASEURL}/teams/${idParam}`;
    return new Promise(async (resolve, reject) => {
        try {
            if ("caches" in window) {
                let objectFromCaches = await (await caches.match(cacheUrl)).json();
                if (objectFromCaches) {
                    console.log(`cache ${cacheUrl} found, load data from cache`);
                    generateDataForTeamDetail(objectFromCaches);
                    resolve(objectFromCaches);
                }
            }
        } catch (error) {
            console.log(`cache ${cacheUrl} not found, load data from API`);
            try {
                let objectFromAPI = await TeamDetail(idParam);
                generateDataForTeamDetail(objectFromAPI);
                resolve(objectFromAPI);
            } catch (error) {
                errorDOM();
                reject(error);
            }

        }
    });
}
function errorDOM() {
    let errorHTML = "";
    errorHTML += `
                <div class="row container text-accent-color">
                    <div class="col s12">
                        <h3>
                            Fetch Error. Please Check your connection
                        </h3>
                    </div>
                </div>
                `;
    document.querySelector("#team-detail").innerHTML = errorHTML;
}
async function generateDataForPertandingan(obj) {
    pertandinganHTML = "";
    console.log(obj);

    obj.matches.forEach(element => {
        pertandinganHTML += `
        <div class="col s12 m6">
            <div class="card grey lighten-4">
            <div class="card-content text-accent-color valign center">
                <span class="card-title group-team">${element.group}</span>
                <div class="match-detail">
                    <div class="border-bottom">${element.awayTeam.name}</div>
                    <div>${element.homeTeam.name}</div>
                </div>
                <div>${new Date(element.utcDate).toLocaleString()}</div>
            </div>
            <div class="card-action">
                <a onclick="simpanPertandingan(${JSON.stringify(element).split("\"").join("&quot;")})">Reminder</a>
            </div>
            </div>
        </div>
        `;
    });
    document.querySelector("#pertandingan").innerHTML = pertandinganHTML;
}
function simpanPertandingan(param) {
    console.log(param);
}
function generateDataForTeamDetail(data) {
    teamHTML = "";
    teamHTML += `
    <div class="row container">
        <div class="col s12">
            <div class="card detail-card grey lighten-4">
                <div class="card-image">
                    <img src="${data.crestUrl}">
                </div>
                <div class="card-content text-accent-color">
                    <span class="group-team text-strong card-title">${data.name}</span>
                    <p>Short Name : ${data.shortName}</p>
                    <p>Club Colors : ${data.clubColors}</p>
                    <p>Address : ${data.address}</p>
                    <p>Venue : ${data.venue}</p>
                    <p>email : ${data.email}</p>
                </div>
                <div class="card-action">
                    <a href="${data.website}" target="_blank">website</a>
                    <a href="#" class="activator">See Squad</a>
                    <a href="#" id="saveTeam">Save</a>
                </div>
                <div class="card-reveal text-accent-color">
                    <span class="card-title group-team text-strong">Detail Squad<i class="material-icons right">close</i></span>
                    <table id="team-squad"></table>
                </div>
            </div>
        </div>
    </div>
    `;
    document.querySelector("#team-detail").innerHTML = teamHTML;

    let playerHTML = `
    <thead>
    <tr>
        <th>No</th>
        <th>Name</th>
        <th>Nationality</th>
        <th>Position</th>
    </tr>
    </thead>
    `;
    data.squad.forEach((player, index) => {
        playerHTML += `
      <tbody>
        <tr>
          <td>${index + 1}</td>
          <td>${player.name}</td>
          <td>${player.nationality}</td>
          <td>${player.position}</td>
        </tr>
      </tbody>
        `;
    });
    document.querySelector("#team-squad").innerHTML = playerHTML;
}
function generateDataForKlasemen(obj) {
    let klasemenHTML = "";
    let teamHTML = "";
    obj.forEach(klasemen => {
        klasemenHTML += `
    <div class="col s12 m6">
        <div class="card grey lighten-4">
            <div class="card-content text-accent-color">
                <span class="group-team card-title">${klasemen.group.replace("_", " ")}</span>
                <div class="row klasemen-content"></div>
            </div>
        </div>
    </div>
    
    `;
    });
    document.getElementById("klasemen").innerHTML = klasemenHTML;
    for (let i = 0; i < obj.length; i++) {
        teamHTML += `
    <div class="group-team text-strong">
        <div class="col s5 word-wrap">
            KLUB
        </div>
        <div class="col s1">
            MA
        </div>
        <div class="col s1">
            ME
        </div>
        <div class="col s1">
            KA
        </div>
        <div class="col s1">
            GM
        </div>
        <div class="col s1">
            GA
        </div>
        <div class="col s1">
            SG
        </div>
        <div class="col s1">
            PTS
        </div>
    </div>
    `;
        for (let j = 0; j < obj[i].table.length; j++) {
            const team = obj[i]["table"][j];
            teamHTML += `
            <a href="./teamDetail.html?id=${team.team.id}">
                <div class="col s5 word-wrap">
                    <img src="${team.team.crestUrl}"/>
                    ${team.team.name}
                </div>
                <div class="col s1">
                    ${team.playedGames}
                </div>
                <div class="col s1">
                    ${team.won}
                </div>
                <div class="col s1">
                    ${team.lost}
                </div>
                <div class="col s1">
                    ${team.goalsFor}
                </div>
                <div class="col s1">
                    ${team.goalsAgainst}
                </div>
                <div class="col s1">
                    ${team.goalDifference}
                </div>
                <div class="col s1">
                    ${team.points}
                </div>
            </a>
        `;
        }
        document.getElementsByClassName("klasemen-content")[i].innerHTML = teamHTML;
        teamHTML = "";
    }
}

function generateDataForSavedTeam(obj) {
    savedHTML = "";

    if (obj.length > 0) {
        obj.forEach(data => {
            savedHTML += `
        <div class="col s12 m6">
        <div class="card detail-card grey lighten-4">
        <div class="card-image">
            <img src="${data.crestUrl}">
        </div>
        <div class="card-content text-accent-color">
            <span class="group-team text-strong card-title">${data.name}</span>
            <p>Short Name : ${data.shortName}</p>
            <p>Club Colors : ${data.clubColors}</p>
            <p>Address : ${data.address}</p>
            <p>Venue : ${data.venue}</p>
            <p>email : ${data.email}</p>
        </div>
        <div class="card-action">
            <a href="${data.website}" target="_blank">website</a>
            <a class="activator">See Squad</a>
            <a onclick="deleteTeam(${data.id})">delete</a>
        </div>
        <div class="card-reveal text-accent-color">
            <span class="card-title group-team text-strong">Detail Squad<i class="material-icons right">close</i></span>
            <table class="team-squad"></table>
        </div>
    </div>
        </div>
        `;
        });
        document.querySelector("#savedTeam").innerHTML = savedHTML;

        let playerHTML = `
    <thead>
    <tr>
        <th>No</th>
        <th>Name</th>
        <th>Nationality</th>
        <th>Position</th>
    </tr>
    </thead>
    `;

        for (let i = 0; i < obj.length; i++) {

            const team = obj[i];
            for (let j = 0; j < team.squad.length; j++) {
                const player = team.squad[j];
                playerHTML += `
            <tbody>
              <tr>
                <td>${j + 1}</td>
                <td>${player.name}</td>
                <td>${player.nationality}</td>
                <td>${player.position}</td>
              </tr>
            </tbody>
              `;
            }
            document.getElementsByClassName("team-squad")[i].innerHTML = playerHTML;
            playerHTML = "";
        }
    }else{
        savedHTML +=`
        <div class="row container text-accent-color">
        <div class="col s12">
            <h3>
                Team yang disimpan belum ada. Silahkan Pilih terlebih dahulu
            </h3>
        </div>
    </div>
        `;

        document.querySelector("#savedTeam").innerHTML = savedHTML;
    }
}