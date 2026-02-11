import * as Engine from "./engine.js"

const codeLinesCouner = document.getElementById("codeLinesCouner");

export function updateDisplay() {
    // 1. Lekéri a számokat az engine.js-ből
    // 2. Beírja az elemekbe: document.getElementById('code-count').innerText = gameState.codeLines;
    // 3. Ha BSOD állapot van, hozzáadja a .visible osztályt a kékhalál div-hez

    codeLinesCouner.innerHTML = Engine.gameState.codeLines;
    // 
}
renderShop()
function renderShop() {
    // A GAME_DATA.units alapján legenerálja a gombokat a HTML-ben
    // Beállítja rajtuk a 'click' eseményt, ami hívja az engine.buyUnit()-ot
    const clickerShop = document.getElementById("clicker-shop");

    Engine.upgrades.units.forEach(element => {
        let item = document.createElement("div")
        let name = document.createElement("p")
        let buy = document.createElement("button")
        if (element.level = Engine.gameState.level) {
            item.id = "clicker-shop-item";
            buy.id = "buy-bt"

            name.innerHTML = element.id;

            item.appendChild(name)
            item.appendChild(buy)
            clickerShop.appendChild(item)
        }
    });
}

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