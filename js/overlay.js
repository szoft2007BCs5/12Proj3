import * as Audio from "./audio.js";


// Állapotkövető változók
let activePage = "main"; // Hol vagyunk most
let returnPage = "main"; // Hova lépjünk vissza ESC-re

export function AddBtEventListeners() {
    // Főoldal gombjainak eseménykezelőinek hozzáadása
    // Fontos: Ezt mindig meg kell hívni, amikor a main oldalt betöltjük!
    const btSettings = document.getElementsByClassName("bt-settings")[0];
    const btInfo = document.getElementsByClassName("bt-info")[0];
    const btPlay = document.getElementsByClassName("bt-play")[0];

    if (btSettings) {
        btSettings.addEventListener("click", () => {
            enableTemplate("settings");
        });
    }

    if (btInfo) {
        btInfo.addEventListener("click", () => {
            enableTemplate("info");
        });
    }

    if (btPlay) {
        btPlay.addEventListener("click", () => {
            enableTemplate("play");
        });
    }
}

export function enableTemplate(selected) {
    // 1. Logika: Ha beállításokra megyünk, mentsük el, honnan jöttünk
    if (selected === "settings" && activePage !== "settings") {
        returnPage = activePage;
    }

    // 2. kiválasztott oldal betöltése
    const templateSelected = document.getElementById(`overlay-${selected}`);
    if (!templateSelected) throw new Error(`Nem található ${selected} template`);
    
    const screen = document.getElementById("screen");   //oldal tartalma
    screen.innerHTML = templateSelected.innerHTML;      //kiválasztott oldal betöltése

    // 3. Aktív oldal frissítése
    activePage = selected;
    changeLanguage(); // Nyelv beállítása az új elemeken

    // 4. Eseménykezelők (gombok) újraaktiválása az adott oldalhoz
    if (selected == "settings") {
        //settings oldal eseménykezelőinek hozzáadása
        document
            .getElementsByClassName("bt-back")[0] //vissza a main oldalra
            .addEventListener("click", () => {
                enableTemplate(returnPage);
            });

            // Csúszkák beállítása
        Audio.setupVolumeControls("music");
        Audio.setupVolumeControls("game");
        Audio.setupVolumeControls("master");
        Audio.setupVolumeControls("other");

        const langSelect = document.getElementById("language-select"); //nyelv választó eseménykezelője
        langSelect.value = localStorage.getItem("currentLang"); //aktuális nyelv beállítása
        langSelect.addEventListener("change", (x) => {
            changeLanguage(x.target.value);
        }); //nyelv változtatása
    } 
    
    else if (selected == "main") {
        AddBtEventListeners(); //main oldal eseménykezelőinek újra hozzáadása, mivel a main oldal újratöltődik
    } 
    
    else if (selected == "info") {
        document
            .getElementsByClassName("bt-back")[0] //vissza a main oldalra
            .addEventListener("click", () => {
                enableTemplate("main");
            });
    }
}

export function changeLanguage(selected = localStorage.getItem("currentLang")) {
    for (const e in window.lang) {
        //minden elemre a lang fájlban
        if (document.getElementById(e))
            document.getElementById(e).innerHTML =
                window.lang[e][selected.toLowerCase()];
    }
    localStorage.setItem("currentLang", selected); //aktuális nyelv elmentése
}

// Ezt hívja majd az input.js az ESC gombra
export function toggleSettings() {
    if (activePage === "settings") {
        enableTemplate(returnPage); // Vissza az előzőre
    } else {
        enableTemplate("settings"); // Beállítások megnyitása
    }
}
