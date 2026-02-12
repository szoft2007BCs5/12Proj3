import * as Engine from "./engine.js"

const codeLinesCounter = document.getElementById("codeLinesCounter");

export function updateDisplay() {
    // 1. Lekéri a számokat az engine.js-ből
    // 2. Beírja az elemekbe: document.getElementById('code-count').innerText = gameState.codeLines;
    // 3. Ha BSOD állapot van, hozzáadja a .visible osztályt a kékhalál div-hez

    codeLinesCounter.innerHTML = Math.round(Engine.gameState.codeLines);
}

export function renderShop() {
    // A GAME_DATA.units alapján legenerálja a gombokat a HTML-ben
    // Beállítja rajtuk a 'click' eseményt, ami hívja az engine.buyUnit()-ot

    const clickerShop = document.getElementById("clicker-shop");
    clickerShop.innerHTML = "";

    const units = Engine.upgrades.units;
    const inventory = Engine.gameState.inventory;

    units.forEach((unit) => {
        if (unit.level <= Engine.gameState.level + 1) {

            let div = document.createElement("div")
            div.classList = "clicker-shop-item"

            if (inventory[unit.id])
                div.innerHTML = `
                    <h1>${unit.id}</h1>
                    <div id="clicker-shop-item-description">
                        <h2>Ár: ${unit.cost}<h2>
                        <h2>Db: ${inventory[unit.id]}</h2>
                    </div>
                    <button id="buy-bt" draggable="false">Kattints rám!</button>`;
            else
                div.innerHTML = `
                    <h1>${unit.id}</h1>
                    <div id="clicker-shop-item-description">
                        <h2>Ár: ${unit.cost}</h2>
                        <h2>Db: 0</h2>
                    </div>
                    <button id="buy-bt" draggable="false">Kattints rám!</button>`;


            clickerShop.appendChild(div)
            div.addEventListener("click", (e) => {
                if (e.target.closest("#buy-bt"))
                    Engine.buyUnit(unit.id);
            });
        };
    });
}

console.log("Frissült");


/*
export function renderShop() {
    // A GAME_DATA.units alapján legenerálja a gombokat a HTML-ben
    // Beállítja rajtuk a 'click' eseményt, ami hívja az engine.buyUnit()-ot
    const clickerShop = document.getElementById("clicker-shop");
    clickerShop.innerHTML = "";
    console.log("Frissült")


    for (const key in Engine.gameState.inventory) {
        let div = document.createElement("div")
        div.classList = "clicker-shop-item"
        let p = document.createElement("p")

        const unitData = Engine.upgrades.units.find(unit => unit.id === key);

        p.innerHTML = key + " ár: " + unitData.cost + " db: " + Engine.gameState.inventory[key];

        let button = document.createElement("button")
        button.innerHTML = "Kattints rám!"
        button.id = "buy-bt"
        button.draggable = false;
        button.addEventListener("click", () => Engine.buyUnit(key))

        div.appendChild(p)
        div.appendChild(button)
        clickerShop.appendChild(div)
    }
}
*/

function playSound(soundId) {
    // Lejátsza a kattintás, hiba vagy modem hangot az assets/sounds-ból
}

// --- ESEMÉNYFIGYELŐK ---

/*
document.getElementById('terminal-btn').addEventListener('click', () => {
    engine.handleManualClick();
    ui.updateDisplay();
    ui.playSound('click');
});

// Pánik gomb (ESC vagy SPACE)
window.addEventListener('keydown', (e) => {
    if(e.code === 'Space') {
        // Váltás Excel módba
    }
});
*/