import * as UI from "./ui.js";
import * as Audio from "./audio.js";
import * as _console from "./console.js";
import * as Language from "./language.js";

export let gameState = {
    codeLines: 0,
    totalCodeGenerated: 0,
    inventory: {}, // Pl: { 'keyboard': 5, 'monitor': 1 }
    clickPower: 1,
    passiveIncome: 0,
    status: 'menu', // clicker, BSOD, menu, settings, information
    lastStatus: '',
    wifiLevel: 100,
    currentLanguage: 'hu',
    level: 0
};

export let upgrades = {
    units: [
        { id: "student", cost: 15, prod: 0.02, powerincrease: 1, level: 1 },
        { id: "nerd", cost: 100, prod: 0.3, powerincrease: 0, level: 2 },
        { id: "chatgpt", cost: 2500, prod: 0.5, powerincrease: 0, level: 3 },
        { id: "indians", cost: 125000, prod: 1, powerincrease: 0, level: 4 }
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

    if (e.key === "m") {
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

export function triggerEvent() {
    const random = Math.random();

    if (random < 0.0002 && gameState.status == "clicker") { // 1% esély  || gameState.status == "BSOD"
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
    else if (random > 0.99 && gameState.status == "clicker") {
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

function saveGame() {
    if (gameState.codeLines === null || gameState.codeLines === undefined) {
        console.error("HIBA: A codeLines értéke elveszett mentés előtt!", gameState);
        return; // Ne mentsük el a hibás állapotot!
    }
    localStorage.setItem("save", JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem("save");
    if (saved) {
        const parsed = JSON.parse(saved);
        // Csak azokat az értékeket írjuk felül, amik megvannak a mentésben
        Object.assign(gameState, parsed);               // HA BESZARIK TÖRÖLT EZT A SORT
    }
}