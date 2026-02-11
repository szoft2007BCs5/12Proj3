import * as UI from "./ui.js";

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
        { id: "student", cost: 15, prod: 0.5, level: 0 },
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
    shopEventListeners();
    gameLoop();
}

function gameLoop() {
    // 1. Kiszámolja a passzív termelést (inventory alapján)
    // 2. Levonja a Wi-Fi-t (ha van ilyen mechanika)
    // 3. Lefuttatja a véletlenszerű eseménygenerátort (pl. jön a tanár?)
    // 4. Szól a ui.js-nek, hogy: "Frissíts, mert változtak a számok!"
    let interval = setInterval(() => {
        UI.updateDisplay();
    }, 100);

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

function buyUnit() {
    // 1. Kiszámolja az aktuális árat (basePrice * multiplier^darabszám)
    // 2. Ha van elég codeLines, levonja és növeli az inventory-t
    // 3. Visszaadja a sikert vagy sikertelenséget

    console.log("click")
}

function shopEventListeners() {
    // 1. Rárakja az eventListenereket a shop gombjaira
    const shopButton = document.querySelectorAll("#buy-bt");
    shopButton.forEach(e => {
        e.addEventListener("onclick", () => buyUnit())
    });
}

function saveGame() {
    // JSON.stringify(gameState) -> localStorage
}