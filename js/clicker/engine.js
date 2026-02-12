import * as UI from "./ui.js";
import * as _console from "./console.js";

export let gameState = {
    codeLines: 1000,
    totalCodeGenerated: 0,
    inventory: { "student": 2, 'nerd': 1 }, // Pl: { 'keyboard': 5, 'monitor': 1 }
    clickPower: 1,
    status: 'NORMAL', // NORMAL, BSOD, PANIC
    wifiLevel: 100,
    currentLanguage: 'hu',
    level: 0
};

export let upgrades = {
    units: [
        { id: "student", cost: 15, prod: 0.1, level: 0 },
        { id: "nerd", cost: 100, prod: 5, level: 1 },
        { id: "chatgpt", cost: 500, prod: 20, level: 2 },
        { id: "indians", cost: 2000, prod: 100, level: 3 }
    ]
}


// --- FUNKCIÓK ---
initGame();

function initGame() {
    // 1. Megpróbálja betölteni a mentést a localStorage-ból
    // 2. Ha nincs, inicializálja az alapértékeket
    // 3. Elindítja a Game Loop-ot
    handleManualClick();
    UI.renderShop();
    gameLoop();
}

function gameLoop() {
    // 1. Kiszámolja a passzív termelést (inventory alapján)
    // 2. Levonja a Wi-Fi-t (ha van ilyen mechanika)
    // 3. Lefuttatja a véletlenszerű eseménygenerátort (pl. jön a tanár?)
    // 4. Szól a ui.js-nek, hogy: "Frissíts, mert változtak a számok!"
    let interval = setInterval(() => {
        gameState.codeLines += passiveIncome()
        UI.updateDisplay();
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
            gameState.inventory[key]++; // Ha van, növeljük
        } else {
            gameState.inventory[key] = 1; // Ha nincs, létrehozzuk és beállítjuk 1-re
        }
        _console.renderToScreen("Siker");
        upgrades.units.forEach(unit => {
            if (unit.id === key)
                unit.cost = Math.round(unit.cost * 1.5, 2)        // Érték helytelen
        });

        UI.renderShop();
        return;
    }
    _console.renderToScreen("NEM LYÓ");
}


function saveGame() {
    // JSON.stringify(gameState) -> localStorage
}