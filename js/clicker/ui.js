import * as Engine from "./engine.js"

const codeLinesCounter = document.getElementById("codeLinesCounter");

export function updateDisplay() {
    // 1. Lekéri a számokat az engine.js-ből
    // 2. Beírja az elemekbe: document.getElementById('code-count').innerText = gameState.codeLines;
    // 3. Ha BSOD állapot van, hozzáadja a .visible osztályt a kékhalál div-hez

    codeLinesCounter.innerHTML = Math.round(Engine.gameState.codeLines);
}

export function activateOverlay() {
    const overlays = document.querySelectorAll(".overlay");
    let activeStatus = Engine.gameState.status

    overlays.forEach((overlay) => {
        
        if (overlay.id == "settings-overlay") renderShop();

        if (overlay.id != `${activeStatus}-overlay`) {
            overlay.style.display = "none";
            overlay.style.height = "0";
            overlay.style.width = "0";
        }
        else {
            overlay.style.display = "flex";
            overlay.style.height = "100dvh";
            overlay.style.width = "100dvw";
        }
    });


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
                    <div id="clicker-shop-item-left">
                        <h1 id="clicker-item-count">${inventory[unit.id]}</h1>
                    </div>
                    <div id="clicker-shop-item-right">
                        <h1>${unit.id}</h1>
                        <div id="clicker-shop-item-description">
                            <h2>Ár: ${unit.cost}<h2>
                        </div>
                        <p>${(unit.prod * inventory[unit.id] * 10).toFixed(1)}/sec</p>
                        <button id="buy-bt" draggable="false">Kattints rám!</button>
                    </div>`;
            else
                div.innerHTML = `
                    <div id="clicker-shop-item-left">
                        <h1 id="clicker-item-count">0</h1>
                    </div>
                    <div id="clicker-shop-item-right">
                        <h1>${unit.id}</h1>
                        <div id="clicker-shop-item-description">
                            <h2>Ár: ${unit.cost}<h2>
                        </div>
                        <button id="buy-bt" draggable="false">Kattints rám!</button>
                    </div>`;


            clickerShop.appendChild(div)
            div.addEventListener("click", (e) => {
                if (e.target.closest("#buy-bt"))
                    Engine.buyUnit(unit.id);
            });
        };
    });
}


export function renderDoor(){

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