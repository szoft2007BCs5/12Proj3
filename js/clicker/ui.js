import * as Engine from "./engine.js"

const codeLinesCounter = document.getElementById("codeLinesCounter");

export function updateDisplay() {
    // 1. Lekéri a számokat az engine.js-ből
    // 2. Beírja az elemekbe: document.getElementById('code-count').innerText = gameState.codeLines;
    // 3. Ha BSOD állapot van, hozzáadja a .visible osztályt a kékhalál div-hez

    codeLinesCounter.innerHTML = formatNumber(Engine.gameState.codeLines);
}

export function activateOverlay() {
    const overlays = document.querySelectorAll(".overlay");
    let activeStatus = Engine.gameState.status

    overlays.forEach((overlay) => {

        if (overlay.id == "clicker-overlay") renderShop();

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

    // --- 1. LÉPÉS: Kiszámoljuk, meddig jutott a játékos ---
    // Alapból az 1-es szint elérhető
    let maxVisibleLevel = 1;

    // Végigmegyünk a szinteken 1-től 7-ig (vagy ameddig vannak itemek)
    for (let lvl = 1; lvl < 10; lvl++) {
        // Kiválogatjuk az adott szint itemjeit
        const itemsInLevel = units.filter(u => u.level === lvl);

        // Ha nincs ilyen szint (pl. elfogytak az itemek), megállunk
        if (itemsInLevel.length === 0) break;

        // Megnézzük, hogy ezen a szinten megvan-e MINDEN itemből legalább 1 db
        const isLevelComplete = itemsInLevel.every(u =>
            inventory[u.id] && inventory[u.id] > 0
        );

        // Ha kész a szint, a következő szint is láthatóvá válik
        if (isLevelComplete) {
            maxVisibleLevel = lvl + 1;
        } else {
            // Ha ez a szint nincs kész, akkor a következőket már nem nézzük meg
            break;
        }
    }

    // Opcionális: A gameState-ben is frissítjük a szintet, ha kell máshova
    Engine.gameState.level = maxVisibleLevel;

    const unitsToRender = units.filter(u => u.level <= maxVisibleLevel);

    unitsToRender.forEach((unit) => {

        let div = document.createElement("div");
        div.classList = "clicker-shop-item";

        if (inventory[unit.id])
            div.innerHTML = `
                    <div id="clicker-shop-item-left">
                        <h1 id="clicker-item-count">${inventory[unit.id]}</h1>
                    </div>
                    <div class="clicker-shop-item-center" id="level-${unit.level}">
                        <div id="clicker-shop-item-title">
                            <h1>${unit.id}</h1>
                            <p>${unit.desc}</p>
                        </div>
                        <div  id="clicker-shop-item-mid">
                            <div id="clicker-shop-item-description">
                                <h2>Ár: ${formatNumber(unit.cost)}</h2>
                            </div>
                            
                             <div id="clicker-shop-item-prod">
                                <p>+${formatNumber((unit.prod * inventory[unit.id] * 10))}/sec</p>
                                <p>+${formatNumber((unit.powerincrease * inventory[unit.id]))}/click</p>
                                <p style="font-size: 0.8em; color: #4b4b4b;">(Alap: ${unit.prod * 10}/s, ${unit.powerincrease}/c)</p>
                            </div>
                        </div>
                    </div>
                    <div class="clicker-shop-item-right">
                        <button id="buy-bt" class="button" draggable="false">+</button>
                    </div>`;
        else
            div.innerHTML = `
                    <div id="clicker-shop-item-left">
                        <h1 id="clicker-item-count">0</h1>
                    </div>
                    <div class="clicker-shop-item-center" id="level-${unit.level}">
                        <div id="clicker-shop-item-title">
                            <h1>${unit.id}</h1>
                            <p>${unit.desc}</p>
                        </div>
                        <div id="clicker-shop-item-mid">
                            <div id="clicker-shop-item-description">
                                <h2>Ár: ${formatNumber(unit.cost)}</h2>
                            </div>
                            
                            <div id="clicker-shop-item-prod">
                                <p>+${formatNumber(unit.prod) * 10}/sec</p>
                                <p>+${formatNumber(unit.powerincrease)}/click</p>
                            </div>
                        </div>
                    </div>
                    <div class="clicker-shop-item-right">
                        <button id="buy-bt" class="button" draggable="false">+</button>
                    </div>`;


        clickerShop.appendChild(div)
        div.addEventListener("click", (e) => {
            if (e.target.closest("#buy-bt"))
                Engine.buyUnit(unit.id);
        });
    });
}

function formatNumber(num) {
    if (num < 1000) return Math.floor(num); // 1000 alatt nem formázunk

    const suffixes = ["", "k", "M", "B", "T", "Qa", "Qi"]; // k=ezer, M=millió, B=milliárd...
    const suffixNum = Math.floor(Math.log10(num) / 3); // Kiszámolja, hányszor fér bele az 1000

    // Ha túl nagy a szám és nincs rá betűnk, akkor simán kiírjuk vagy tudományos jelölést használunk
    if (suffixNum >= suffixes.length) return num.toExponential(2);

    const shortValue = (num / Math.pow(1000, suffixNum));

    // A toFixed(3) 3 tizedesre vág, a parseFloat pedig levágja a felesleges nullákat (pl 1.500 -> 1.5)
    return parseFloat(shortValue.toFixed(3)) + suffixes[suffixNum];
}

export function renderDoor() {
    const door = document.getElementById("rpg-entry");
    door.addEventListener("click", () => {
        Engine.gameState.status = "rpg";
        console.log("rpg")
        activateOverlay();
        Engine.loadRPGEvent();
    });
}

export async function activateRPGOverlay(event) {
    const currentRPGEvent = document.getElementById("currentRPG");
    switch (event) {
        case "writeCode": {
            const tasksToSolve = [
                { "Add össze: 2 + 2": 4 },
                { "Add össze: 2 + 5": 7 },
            ]
            let rpgMiddle = document.getElementById("rpg-middle");
            let taskToSolve = tasksToSolve[Math.floor(Math.random() * tasksToSolve.length)];
            rpgMiddle.innerHTML = `
                <h1>Oldd meg:</h1>
                <h2>${taskToSolve}</h2>
                <input type="text" id="writeCode-input" placeholder="Írd ide..." autocomplete="off">
            `

            let input = await document.getElementById("writeCode-input");
            input.addEventListener("keyup", (e) => {
                if (e.target.value == taskToSolve)
                    console.log("Megoldva")
            });
            console.log("writeCode")
            return;
        }
        case "BOSS": {
            console.log(event)
            return;
        }
        case "BOSS": {
            console.log(event)
            return;
        }
        case "BOSS": {
            console.log(event)
            return;
        }
        default: {
            console.log("default")
            return;
        }
    }
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