import * as Engine from "./engine.js";

// Segédfüggvény, ami CSAK kiír, de nem értelmez parancsokat (megelőzi a hurkokat)
export function renderToScreen(text) {
    const terminal = document.getElementById("console-log");
    if (!terminal) return;

    const newElement = document.createElement("p");
    newElement.className = "console-log-item"; // ID helyett class a biztonságért

    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ":" +
        now.getMinutes().toString().padStart(2, '0') + ":" +
        now.getSeconds().toString().padStart(2, '0');

    // Ha a szövegben már benne van az idő (mentésből jön), ne adjuk hozzá újra
    newElement.innerHTML = time + " > " + text;

    terminal.appendChild(newElement);
    terminal.scrollTop = terminal.scrollHeight;
}

export function writeLog(text) {
    if (text === undefined || text === null || text.trim() === "") return;

    const command = text.trim().toLowerCase();

    if (/^add \d+$/.test(text)) {
        Engine.gameState.codeLines += parseInt(text.split(" ")[1]);
        Engine.gameState.totalCodeGenerated += parseInt(text.split(" ")[1]);
        renderToScreen("SYSTEM: Egyenleg feltöltve: " + text.split(" ")[1]);
        return;
    }

    switch (command) {
        /*
        case "stop":
            Engine.gameState.status = "stop";
            return;
        case "start":
            Engine.gameState.status = "start";
            return;
        */
        case "clear":
            clearLogs();
            return;
        case "start":
            renderToScreen("SYSTEM: Üdvözöllek a játékban!");
            renderToScreen("SYSTEM: A te kedves, megbízható rendszered beszél!");
            return;
        case "save":
            Engine.saveGame();
            saveLogs()
            return;
        case "load":
            Engine.loadGame();
            loadLogs();
            return;
        case "blue death":
            Engine.gameState.status = "BSOD";
            Engine.triggerEvent("blue death");
            return;
        case "mester":
            Engine.triggerEvent("mester");
            return;
        case "add /\d/":
            Engine.triggerEvent("mester");
            return;
        default:
            renderToScreen(text);
            return;
    }
}
function clearLogs() {
    const terminal = document.getElementById("console-log");
    terminal.innerHTML = "";
}

function saveLogs() {
    const terminal = document.getElementById("console-log");
    const items = Array.from(terminal.querySelectorAll(".console-log-item"))
        .map(p => p.innerHTML);

    localStorage.setItem("console_logs", JSON.stringify(items));
    renderToScreen("SYSTEM: Logs have been saved!");
}

export function loadLogs() {
    const saved = localStorage.getItem("console_logs");
    if (saved) {
        clearLogs(); // Előbb törlünk, aztán töltünk be
        const reg = /^.*?&gt;/;
        const items = JSON.parse(saved);
        items.forEach(content => {
            console.log(content.replace(reg, ""))
            renderToScreen(content.replace(reg, ""))
        });
        renderToScreen("SYSTEM: Logs have been loaded!");
    } else {
        renderToScreen("SYSTEM: No saved logs found.");
    }
}

// Event Listenerek
const consoleInput = document.getElementById("console-input");
consoleInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        writeLog(consoleInput.value);
        consoleInput.value = "";
    }
});


// ==========================================================
// A PROGRAM FUTÁSI SORRENDJE
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. LÉPÉS: A böngésző teljesen betölti a HTML struktúrát (DOM).
    // Ekkor válik elérhetővé a "console-log" div és a "console-input" mező.

    // 2. LÉPÉS: Meghívódik a writeLog("start") függvény.
    // Ez a függvény elindítja a parancsértelmezőt a "start" kulcsszóval.
    // writeLog("start");

    // 3. LÉPÉS: A writeLog-on belül a switch ág elkapja a "start" parancsot.
    // Meghívja a renderToScreen() függvényt kétszer az üdvözlő szövegekkel.

    // 4. LÉPÉS: A renderToScreen() legenerálja az aktuális időbélyeget (ÓÓ:PP:MP),
    // létrehozza a <p> elemet, majd hozzáfűzi a terminálhoz és az aljára görget.

    // 5. LÉPÉS: A program innentől eseményvezérelt módba vált.
    // Várakozik, amíg a felhasználó le nem nyomja az Enter billentyűt az input mezőben.
});

// A PROGRAM VÉGE



/*
=================================================================
// HASZNÁLATI ÉS MŰKÖDÉSI DOKUMENTÁCIÓ
=================================================================

1. HASZNÁLATI ÚTMUTATÓ (JÁTÉKOSOKNAK):
   -----------------------------------
   - Cél: Kommunikáció a rendszerrel, játékállás mentése/betöltése.
   - Használat: 
     1. Kattints az alsó beviteli mezőbe (Input).
     2. Írd be a parancsot.
     3. Nyomd meg az ENTER-t.

2. ELÉRHETŐ PARANCSOK:
   -----------------------------------
   > start  : Rendszer inicializálása, üdvözlő üzenetek kiírása.
   > save   : A jelenlegi konzol tartalmának mentése a böngészőbe.
   > load   : A korábban mentett üzenetek visszatöltése (felülírja a jelent!).
   > clear  : A képernyő teljes törlése (a mentést nem bántja).
   > [bármi]: Ha nem parancsot írsz, a rendszer naplózza az üzenetedet.

3. TECHNIKAI MŰKÖDÉS (FEJLESZTŐKNEK):
   -----------------------------------
   A) Az oldal betöltésekor (DOMContentLoaded):
      - A böngésző felépíti a DOM-ot.
      - A script meghívja a writeLog("start") függvényt.
      - A konzolon megjelenik az üdvözlés.
   
   B) Üzenetküldés folyamata:
      1. 'keydown' esemény figyeli az Enter billentyűt.
      2. A beírt szöveget a rendszer átveszi, levágja a szóközöket (.trim()) 
         és kisbetűssé alakítja (.toLowerCase()).
      3. A switch() szerkezet ellenőrzi, hogy egyezik-e valamelyik paranccsal.
         - HA IGEN: Lefut a speciális függvény (pl. saveLogs()).
         - HA NEM: Meghívódik a renderToScreen(), ami kiteszi a szöveget.
      4. A renderToScreen() hozzáadja az aktuális időbélyeget [ÓÓ:PP:MP].
      5. A .scrollTop = .scrollHeight parancs az ablak aljára görget.

   C) Adattárolás (LocalStorage):
      - Kulcs: "console_logs"
      - Formátum: JSON string (egy tömb, ami a <p> elemek HTML tartalmát őrzi).
      - Perzisztencia: Az adatok megmaradnak frissítés és bezárás után is.

=================================================================
*/