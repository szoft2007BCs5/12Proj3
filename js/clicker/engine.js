import * as UI from "./ui.js";
import * as _console from "./console.js";

export let gameState = {
    codeLines: 0,
    totalCodeGenerated: 0,
    inventory: {}, // Pl: { 'keyboard': 5, 'monitor': 1 }
    clickPower: 1,
    status: 'NORMAL', // NORMAL, BSOD, PANIC
    wifiLevel: 100,
    currentLanguage: 'hu',
    level: 0
};

export let upgrades = {
    units: [
        { id: "student", cost: 15, prod: 0.02, level: 1 },
        { id: "nerd", cost: 100, prod: 0.3, level: 2 },
        { id: "chatgpt", cost: 2500, prod: 0.5, level: 3 },
        { id: "indians", cost: 125000, prod: 1, level: 4 }
    ]
}


// --- FUNKCIÓK ---
initGame();

function initGame() {
    // 1. Megpróbálja betölteni a mentést a localStorage-ból
    // 2. Ha nincs, inicializálja az alapértékeket
    // 3. Elindítja a Game Loop-ot
    handleManualClick();
    loadGame();
    UI.renderShop();
    gameLoop();
}

async function gameLoop() {
    // 1. Kiszámolja a passzív termelést (inventory alapján)
    // 2. Levonja a Wi-Fi-t (ha van ilyen mechanika)
    // 3. Lefuttatja a véletlenszerű eseménygenerátort (pl. jön a tanár?)
    // 4. Szól a ui.js-nek, hogy: "Frissíts, mert változtak a számok!"
    let interval = setInterval(() => {
        switch (gameState) {
            case "DSOD": return;
            case "STOP": return;
        }

        gameState.codeLines += passiveIncome();
        UI.updateDisplay();
        console.log("ASD");

        if (Math.random() < 0.0002) { // 1% esély
            triggerBlueScreen();
        }
        saveGame();
    }, 100);
}

function passiveIncome() {
    let income = 0;

    // Végigmegyünk az inventory objektum kulcs-érték párjain (pl. ["student", 5])
    for (const [unitId, quantity] of Object.entries(gameState.inventory)) {

        // Megkeressük az adott egységhez tartozó adatokat az upgrades.units tömbben
        const unitData = upgrades.units.find(unit => unit.id === unitId);

        // Ha megtaláltuk, hozzáadjuk a bevételhez (darabszám * termelés)
        if (unitData) {
            income += quantity * unitData.prod;
        }
    }

    return income;
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
        _console.renderToScreen("Siker");
        upgrades.units.forEach(unit => {
            if (unit.id === key)
                unit.cost = Math.round(unit.cost * 1.5, 2);
        });

        UI.renderShop();
        return;
    }
    _console.renderToScreen("NEM LYÓ");
}

export function triggerBlueScreen() {
    console.log("Kék Halál!");

    // 1. Játék megállítása
    gameState.status = "DSOD";

    // 2. Képernyő megjelenítése
    const blueDeath = document.getElementById("blueDeath-overlay");
    const bsodInput = document.getElementById("bsod-input");
    blueDeath.classList.remove("hidden");

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
            if (beirtSzoveg === "reboot") resolveBlueScreen();
            else bsodInput.value = "";
        }
    });
}

function resolveBlueScreen() {
    console.log("Hiba elhárítva!");

    // 1. Képernyő eltüntetése
    const blueDeath = document.getElementById("blueDeath-overlay");
    blueDeath.classList.add("hidden");

    // 2. Játék folytatása
    gameState.status = "DSOD";
}

function saveGame() {
    if (gameState.codeLines === null || gameState.codeLines === undefined) {
        console.error("HIBA: A codeLines értéke elveszett mentés előtt!", gameState);
        return; // Ne mentsük el a hibás állapotot!
    }
    localStorage.setItem("save", JSON.stringify(gameState));
    console.log("Sikeres mentés:", gameState);
}

function loadGame() {
    const saved = localStorage.getItem("save");
    if (saved) {
        const parsed = JSON.parse(saved);
        // Csak azokat az értékeket írjuk felül, amik megvannak a mentésben
        Object.assign(gameState, parsed);               // HA BESZARIK TÖRÖLT EZT A SORT
    }
}