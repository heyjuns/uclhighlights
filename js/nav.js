document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
    loadNav();
    var page = window.location.hash.substr(1);
    if (page == "") page = "klasemen";
    loadPage(page);
});

function loadNav() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status != 200) return;
            // Muat Daftar tautan menu
            document.querySelectorAll(".topnav, .sidenav").forEach(function (elm) {
                elm.innerHTML = xhttp.responseText;
            });
            document.querySelectorAll(".sidenav a, .topnav a").forEach(function (elm) {
                elm.addEventListener("click", function (event) {
                    var sidenav = document.querySelector(".sidenav");
                    M.Sidenav.getInstance(sidenav).close();
                    page = event.target.getAttribute("href").substr(1);
                    loadPage(page);
                });
            });
        }
    };
    xhttp.open("GET", "navigation.html", true);
    xhttp.send();
}

function loadPage(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = async function () {
        if (this.readyState == 4) {
            if (page === "klasemen") {
                klasemenDOM().finally(() => document.querySelector("#preloader").remove());
            } else if (page === "pertandingan") {
                pertandinganDOM().finally(() => document.querySelector("#preloader").remove());
            } else if (page === "saved") {
                savedClubTeamDOM().finally(() => document.querySelector("#preloader").remove());
            }
            var content = document.querySelector("#body-content");
            if (this.status == 200) {
                content.innerHTML = xhttp.responseText;
            } else if (this.status == 404) {
                content.innerHTML = "<p>Halaman tidak dapat ditemukan</p>";
            } else {
                content.innerHTML = "<p>Halaman tidak dapat diakses</p>";
            }
        }
    };
    xhttp.open("GET", "pages/" + page + ".html", true);
    xhttp.send();
}