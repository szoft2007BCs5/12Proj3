import * as Engine from "./engine.js";

// =========================================================================
// KONZOL KIÍRATÁS ÉS LOGIKA
// =========================================================================

export function renderToScreen(text) {
    const terminal = document.getElementById("console-log");
    if (!terminal) return;

    const newElement = document.createElement("p");
    newElement.className = "console-log-item"; 

    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ":" +
        now.getMinutes().toString().padStart(2, '0') + ":" +
        now.getSeconds().toString().padStart(2, '0');

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

// =========================================================================
// MENTÉS ÉS BETÖLTÉS (LOCALSTORAGE)
// =========================================================================

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
        clearLogs(); 
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

// =========================================================================
// ESEMÉNYFIGYELŐK ÉS DOKUMENTÁCIÓ
// =========================================================================

const consoleInput = document.getElementById("console-input");
consoleInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        writeLog(consoleInput.value);
        consoleInput.value = "";
    }
});

/*
=================================================================
// HASZNÁLATI ÉS MŰKÖDÉSI DOKUMENTÁCIÓ
=================================================================
1. HASZNÁLATI ÚTMUTATÓ (JÁTÉKOSOKNAK):
   - Cél: Kommunikáció a rendszerrel, játékállás mentése/betöltése.
   - Használat: Kattints az alsó beviteli mezőbe, írj, nyomj ENTER-t.
2. ELÉRHETŐ PARANCSOK:
   > start, save, load, clear
3. TECHNIKAI MŰKÖDÉS (FEJLESZTŐKNEK): ...
=================================================================
*/