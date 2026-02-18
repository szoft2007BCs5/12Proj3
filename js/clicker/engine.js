import * as UI from "./ui.js";
import * as Audio from "./audio.js";
import * as _console from "./console.js";
import * as Language from "./language.js";

// --- GAME STATE ---

export let gameState = {
    codeLines: 0,
    totalCodeGenerated: 0,
    inventory: {}, // Pl: { 'keyboard': 5, 'monitor': 1 }
    clickPower: 1,
    passiveIncome: 0,
    status: 'clicker', // clicker, BSOD, menu, settings, information
    lastStatus: '',
    wifiLevel: 100,
    currentLanguage: 'hu',
    level: 1
};

export let upgrades = {
    units: [
        // --- TIER 1: A Kezdetek (Diákélet) ---
        { id: "Student", desc: "Egy mezei diák. Még lelkes, de nem tud semmit.", cost: 15, prod: 0.1, powerincrease: 0, level: 1 },
        { id: "Zsíros Egér", desc: "Az alja ragad, de legalább kattan.", cost: 50, prod: 0, powerincrease: 0.5, level: 1 },
        { id: "Ctrl+C Ctrl+V", desc: "A programozás alapköve.", cost: 120, prod: 0.5, powerincrease: 0, level: 1 },
        { id: "Büfés Kávé", desc: "Kétes eredetű fekete lötty. Ébren tart.", cost: 500, prod: 1.2, powerincrease: 0, level: 1 },
        { id: "Okos Padtárs", desc: "A srác az első padból. Ő tényleg érti.", cost: 1200, prod: 3.5, powerincrease: 0, level: 1 },
        { id: "RGB Ledszalag", desc: "Piros fényben gyorsabb a gép. Ez fizika.", cost: 3000, prod: 0, powerincrease: 5, level: 1 },

        // --- TIER 2: Hardver & Alapok ---
        { id: "Mechanikus Billentyűzet", desc: "Hangos, de mindenki hallja, hogy dolgozol.", cost: 6000, prod: 8, powerincrease: 2, level: 2 },
        { id: "Második Monitor", desc: "Egyiken a kód, másikon az AI.", cost: 15000, prod: 18, powerincrease: 0, level: 2 },
        { id: "ChatGPT Plus", desc: "Megírja helyetted a házit. Okosabb nálad.", cost: 32000, prod: 35, powerincrease: 0, level: 2 },
        { id: "50m UTP Kábel", desc: "A WiFi a gyengék fegyvere. Stabil net.", cost: 70000, prod: 60, powerincrease: 0, level: 2 },
        { id: "T5 Teremkulcs", desc: "Egy másolt kulcs. Meglesheted a Mestert.", cost: 120000, prod: 0, powerincrease: 25, level: 2 },

        // --- TIER 3: Webfejlesztés (Németh G. vonal) ---
        { id: "HTML <br> Tag", desc: "Sortörés mindenhova. A design csúcsa.", cost: 250000, prod: 150, powerincrease: 0, level: 3 },
        { id: "CSS !important", desc: "Ha nem működik, csak erőltesd rá!", cost: 450000, prod: 220, powerincrease: 10, level: 3 },
        { id: "Német Billentyűzet", desc: "Németh G. ajánlásával. Az Y és Z cserélve.", cost: 750000, prod: 350, powerincrease: 0, level: 3 },
        { id: "15 év Németországban", desc: "A tapasztalat átszáll rád. Precíz munka.", cost: 1500000, prod: 600, powerincrease: 0, level: 3 },
        { id: "Reszponzív Design", desc: "Mobilon is működik (néha).", cost: 2800000, prod: 950, powerincrease: 0, level: 3 },
        { id: "Spagetti Kód", desc: "Senki nem tudja mit csinál, de működik.", cost: 5000000, prod: 1500, powerincrease: 0, level: 3 },
        { id: "Németh G. Jóváhagyása", desc: "A tanár úr bólintott. Ez sokat ér.", cost: 8500000, prod: 2200, powerincrease: 150, level: 3 },

        // --- TIER 4: Adatbázis & Nagyvállalat (Marosán O. vonal) ---
        { id: "Excel Táblázat", desc: "A szegény ember adatbázisa.", cost: 14000000, prod: 3500, powerincrease: 0, level: 4 },
        { id: "SELECT * FROM users", desc: "Minden adat a tiéd.", cost: 25000000, prod: 5500, powerincrease: 0, level: 4 },
        { id: "Végtelen Ciklus", desc: "Véletlen volt, de pörög a számláló.", cost: 42000000, prod: 8000, powerincrease: 0, level: 4 },
        { id: "Marosán Szemüvege", desc: "Átlát még a Mátrixon is.", cost: 65000000, prod: 0, powerincrease: 500, level: 4 },
        { id: "Normalizálás", desc: "Rend a lelke mindennek. Nincs redundancia.", cost: 100000000, prod: 15000, powerincrease: 0, level: 4 },
        { id: "Oracle Licensz", desc: "Drága, de Marosán szerint megéri.", cost: 180000000, prod: 24000, powerincrease: 0, level: 4 },
        { id: "Mindent Tudó Aura", desc: "Marosán Ottó tudása. Nincs kérdés válasz nélkül.", cost: 300000000, prod: 35000, powerincrease: 0, level: 4 },

        // --- TIER 5: T5 Hardver & Sysadmin (De lehetne: Sági J. vonal) ---
        { id: "Zajszűrős Fejhallgató", desc: "Hogy ne halld a szerverek zúgását.", cost: 550000000, prod: 55000, powerincrease: 0, level: 5 },
        { id: "Cisco Kábelrengeteg", desc: "Valahova vezet, az biztos.", cost: 900000000, prod: 85000, powerincrease: 0, level: 5 },
        { id: "Kékhalál (BSOD)", desc: "Pihenőidő a gépnek. Újraindítás...", cost: 1500000000, prod: 130000, powerincrease: 0, level: 5 },
        { id: "Agylövés Elleni Sisak", desc: "Sági úr 'agylövése' ellen véd.", cost: 2800000000, prod: 0, powerincrease: 2500, level: 5 },
        { id: "Sági Tanár Úr Humora", desc: "Fárasztó viccek, de edzik az idegrendszert.", cost: 4500000000, prod: 350000, powerincrease: 0, level: 5 },
        { id: "Saját Szerverterem", desc: "A teljes T5 a tiéd. Fűtésre nem kell költeni.", cost: 8000000000, prod: 550000, powerincrease: 0, level: 5 },
        { id: "Rendszergazda Jog", desc: "Te vagy a root. AZ Isten kezet fog veled.", cost: 15000000000, prod: 900000, powerincrease: 5000, level: 5 },

        // --- TIER 6: A Mester Szintje (Házi G. L. & Linux) ---
        { id: "Ubuntu Install CD", desc: "A megvilágosodás első lépése.", cost: 30000000000, prod: 1500000, powerincrease: 0, level: 6 },
        { id: "Pingvin Eleség", desc: "Tux jóllakott. Gyorsabban fut.", cost: 55000000000, prod: 2500000, powerincrease: 0, level: 6 },
        { id: "Csak Terminál", desc: "Egér? Az a gyengéknek való.", cost: 90000000000, prod: 4000000, powerincrease: 15000, level: 6 },
        { id: "Kernel Fordítás", desc: "Fordítod a kernelt. Senki más nem érti.", cost: 150000000000, prod: 6500000, powerincrease: 0, level: 6 },
        { id: "Sudo Parancs", desc: "sudo make me a sandwich. Minden parancs lefut.", cost: 280000000000, prod: 10000000, powerincrease: 30000, level: 6 },
        { id: "A Linux Atyja", desc: "Házi Gábor Lajos áldása veled van.", cost: 500000000000, prod: 18000000, powerincrease: 0, level: 6 },
        { id: "Házi Gábor Lajos", desc: "Maga az Isten. Személyesen írja a kódodat.", cost: 1000000000000, prod: 40000000, powerincrease: 100000, level: 6 },

        // --- ENDGAME ---
        { id: "Diploma", desc: "Megcsináltad. Van papírod. Most mi lesz?", cost: 5000000000000, prod: 100000000, powerincrease: 0, level: 7 },
        { id: "Google Állásajánlat", desc: "Felvettek seniornak. Irány a Szilícium-völgy.", cost: 10000000000000, prod: 250000000, powerincrease: 0, level: 7 },
        { id: "Szingularitás", desc: "Egybeolvadtál a rendszerrel. Te vagy a gép.", cost: 100000000000000, prod: 1000000000, powerincrease: 500000, level: 7 }
    ]
}


// --- FUNKCIÓK ---
initGame();

function initGame() {
    // 1. Megpróbálja betölteni a mentést a localStorage-ból
    // 2. Ha nincs, inicializálja az alapértékeket
    // 3. Elindítja a Game Loop-ot
    // loadGame();
    handleManualClick();
    setupButtons();
    setupGlobalInput();
    UI.activateOverlay();
    Audio.setupAudioSystem();
    Language.setupLanguageSelector();
    if (localStorage.getItem("console_logs")) {
        console.log("ASD")
        _console.loadLogs();
    }
    else{  
        _console.writeLog("start");
    }
    gameLoop();
}

async function gameLoop() {
    // 1. Kiszámolja a passzív termelést (inventory alapján)
    // 2. Levonja a Wi-Fi-t (ha van ilyen mechanika)
    // 3. Lefuttatja a véletlenszerű eseménygenerátort (pl. jön a tanár?)
    // 4. Szól a ui.js-nek, hogy: "Frissíts, mert változtak a számok!"
    setInterval(() => {
        if (gameState.status == "clicker") {
            passiveIncome();
            triggerEvent();
        }
        UI.updateDisplay();
        // saveGame();
    }, 100);
}

function setupButtons() {
    const buttons = document.querySelectorAll(".button");
    buttons.forEach(button => {
        if (button.classList.contains("bt-back")) {
            button.addEventListener("click", () => {
                gameState.status = gameState.lastStatus;
                UI.activateOverlay()
            });
        }
        else {
            button.addEventListener("click", (e) => {
                gameState.lastStatus = gameState.status
                gameState.status = e.target.dataset.target
                UI.activateOverlay()
            });
        }

    });
}

// --- Input ---
function setupGlobalInput() {
    document.addEventListener("keydown", handleKeyDown);
}
function handleKeyDown(e) {
    if (e.key === "Escape") {
        if (gameState.status == "settings") {
            gameState.status = gameState.lastStatus;
            UI.activateOverlay()
        }
        else {
            gameState.lastStatus = gameState.status;
            gameState.status = "settings";
            UI.activateOverlay()
        }
    }

    if (e.key === "Tab") {
        gameState.status = "menu";
        UI.activateOverlay()
    }
}


// --- Gameplay ---
function passiveIncome() {
    let passiveIncome = gameState.passiveIncome;
    gameState.codeLines += passiveIncome;
    gameState.totalCodeGenerated += passiveIncome;
}

function handleManualClick() {
    // Megnézi, kattintható-e a terminál (nincs-e BSOD)
    // Növeli a codeLines értékét

    const clickerButton = document.getElementById("clicker-button");
    clickerButton.addEventListener("click", () => {
        gameState.codeLines += gameState.clickPower;
        gameState.totalCodeGenerated += gameState.clickPower;


    });
}

export function buyUnit(key) {
    // 1. Kiszámolja az aktuális árat (basePrice * multiplier^darabszám)
    // 2. Ha van elég codeLines, levonja és növeli az inventory-t
    // 3. Visszaadja a sikert vagy sikertelenséget

    const unitData = upgrades.units.find(unit => unit.id === key);

    if (gameState.codeLines >= unitData.cost) {
        gameState.codeLines -= unitData.cost;
        if (gameState.inventory[key]) {
            gameState.inventory[key]++;         // Ha van, növeljük
        } else {
            gameState.inventory[key] = 1;       // Ha nincs, létrehozzuk és beállítjuk 1-re
            gameState.level = unitData.level;
        }
        gameState.passiveIncome += unitData.prod;
        gameState.clickPower += unitData.powerincrease;
        _console.renderToScreen("Siker");
        upgrades.units.forEach(unit => {
            if (unit.id === key)
                unit.cost = Math.round(unit.cost ** 1.05, 2);
        });

        UI.renderShop();
        return;
    }
    _console.renderToScreen("NEM LYÓ");
}

export function triggerEvent(event = null) {
    const random = Math.random();

    if ((random < 0.0002 && gameState.status == "clicker")  || event == "blue death") { // 1% esély  || gameState.status == "BSOD"
        console.log("Kék Halál!");

        gameState.status = "BSOD";
        UI.activateOverlay();
        const bsodInput = document.getElementById("bsod-input");

        // Fókuszáljunk az inputra, hogy azonnal tudjon írni
        bsodInput.focus();
        bsodInput.value = ""; // Töröljük a korábbi szöveget

        // Eseményfigyelő
        bsodInput.addEventListener("keyup", function (event) {
            // Ellenőrizzük, hogy Enter-t nyomott-e
            if (event.key === "Enter") {

                // Itt olvassuk ki, mit írt be
                const beirtSzoveg = bsodInput.value;

                console.log("A játékos ezt írta: " + beirtSzoveg);

                // Ellenőrzés (pl. ha azt írja be: "reboot")
                if (beirtSzoveg === "reboot") {
                    gameState.status = "clicker";
                    UI.activateOverlay();
                    console.log("Rendszer újra visszaállt erre: " + gameState.status)
                    bsodInput.value = "";
                    return;
                }
                else bsodInput.value = "";
            }
        });
    }
    else if ((random > 0.9998 && gameState.status == "clicker") || event == "mester") {
        const door = document.getElementById("rpg-entry");

        // Ellenőrizzük, hogy nincs-e rajta már az osztály (hogy ne fusson le többször)
        if (!door.classList.contains("active-state")) {
            console.log("AJTÓ NYÍLIK - Vizuális effekt indul");

            // 1. Vizuális effekt BEKAPCSOLÁSA (hozzáadjuk a class-t)
            door.classList.add("active-state");

            Audio.playAudio("t5-door-tryingToOpen.mp3", "game", false);

            setTimeout(() => {
                // 2. Vizuális effekt KIKAPCSOLÁSA 6 másodperc után
                door.classList.remove("active-state");
                console.log("AJTÓ BEZÁRUL - Vizuális effekt vége");
            }, 6000);
        }
    }
}

export function saveGame() {
    if (gameState.codeLines === null || gameState.codeLines === undefined) {
        console.error("HIBA: A codeLines értéke elveszett mentés előtt!", gameState);
        return; // Ne mentsük el a hibás állapotot!
    }
    localStorage.setItem("save", JSON.stringify(gameState));
}

export function loadGame() {
    const saved = localStorage.getItem("save");
    if (saved) {
        const parsed = JSON.parse(saved);
        // Csak azokat az értékeket írjuk felül, amik megvannak a mentésben
        Object.assign(gameState, parsed);               // HA BESZARIK TÖRÖLT EZT A SORT
    }
}