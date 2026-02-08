// overlay.js
import * as Audio from "./audio.js";

// Állapotkövető változók
let activePage = "main"; 
let returnPage = "main"; 

// --- Publikus függvények ---

export function enableTemplate(selected) {
    // 1. Visszatérési oldal mentése (ha a settingsbe lépünk be)
    if (selected === "settings" && activePage !== "settings") {
        returnPage = activePage;
    }

    // 2. Template keresése és betöltése
    const templateSelected = document.getElementById(`overlay-${selected}`);
    if (!templateSelected) {
        console.error(`Hiba: Nem található overlay-${selected} template!`);
        return;
    }

    const screen = document.getElementById("screen");
    screen.innerHTML = templateSelected.innerHTML;
    activePage = selected;

    // 3. Nyelv frissítése az új elemeken
    changeLanguage(); 

    // 4. Oldal-specifikus logika futtatása
    switch (selected) {
        case "main":
            initMainListeners();
            break;
        case "settings":
            initSettingsListeners();
            break;
        case "info":
            initInfoListeners();
            break;
        case "play":
            initGameIframe();
            break;
    }
}

export function toggleSettings() {
    if (activePage === "settings") {
        // Visszalépés
        enableTemplate(returnPage);
        
        // Ha a játékba lépünk vissza, trükközni kell a fókusszal
        if (returnPage === "play") {
            setTimeout(() => {
                const iframe = document.querySelector('iframe.clicker-iframe');
                if (iframe && iframe.contentWindow) iframe.contentWindow.focus();
            }, 50);
        } else {
            // Sima oldal esetén a főablakra fókuszálunk
            window.focus();
        }
    } else {
        // Megnyitás
        enableTemplate("settings");
    }
}

export function changeLanguage(selected = localStorage.getItem("currentLang")) {
    if (!selected) selected = "Magyar"; // Alapértelmezett

    if (window.lang) {
        for (const key in window.lang) {
            const element = document.getElementById(key);
            if (element && window.lang[key][selected.toLowerCase()]) {
                element.innerHTML = window.lang[key][selected.toLowerCase()];
            }
        }
    }
    localStorage.setItem("currentLang", selected);
}

// --- Belső (privát) segédfüggvények ---

function initMainListeners() {
    const btSettings = document.querySelector(".bt-settings");
    const btInfo = document.querySelector(".bt-info");
    const btPlay = document.querySelector(".bt-play");

    if (btSettings) btSettings.addEventListener("click", () => enableTemplate("settings"));
    if (btInfo) btInfo.addEventListener("click", () => enableTemplate("info"));
    if (btPlay) btPlay.addEventListener("click", () => enableTemplate("play"));
}

function initSettingsListeners() {
    // Vissza gomb
    const btBack = document.querySelector(".bt-back");
    if (btBack) {
        btBack.addEventListener("click", () => enableTemplate(returnPage));
    }

    // Hangerő csúszkák inicializálása
    Audio.setupVolumeControls("music");
    Audio.setupVolumeControls("game");
    Audio.setupVolumeControls("master");
    Audio.setupVolumeControls("other");

    // Nyelvválasztó
    const langSelect = document.getElementById("language-select");
    if (langSelect) {
        langSelect.value = localStorage.getItem("currentLang") || "Magyar";
        langSelect.addEventListener("change", (e) => {
            changeLanguage(e.target.value);
        });
    }
}

function initInfoListeners() {
    const btBack = document.querySelector(".bt-back");
    if (btBack) {
        btBack.addEventListener("click", () => enableTemplate("main"));
    }
}

function initGameIframe() {
    // Rákötjük az ESC gomb figyelését az iframe BELSŐ dokumentumára is.
    setTimeout(() => {
        const iframe = document.querySelector('iframe.clicker-iframe');
        if (iframe) {
            iframe.onload = function () {
                // 1. Fókusz, hogy azonnal működjön a játék
                this.contentWindow.focus();

                // 2. ESC figyelés az iframe-en belül ("Script Injection")
                try {
                    this.contentWindow.document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape') {
                            toggleSettings();
                        }
                    });
                } catch (err) {
                    console.warn("Nem sikerült eseménykezelőt tenni az iframe-re (Cross-origin hiba?):", err);
                }
            };
        }
    }, 50);
}