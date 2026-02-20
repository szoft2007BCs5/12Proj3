import * as Engine from "./engine.js";
import * as UI from "./ui.js";

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
    let rpgMiddle = document.getElementById("rpg-middle");
    rpgMiddle.innerHTML = "";
    switch ("clickOnTarget") {
        case "questions": {
            const tasksToSolve = [
                // --- String (szöveg) műveletek ---
                { "Mi a kimenet?<br> 'hello'.toUpperCase().charAt(0)": "H" },
                { "Mi a kimenet?<br> 'a,b,c'.split(',').length": "3" },
                { "Mi a kimenet?<br> 'JavaScript'.substring(0, 4)": "Java" },

                // --- Tömb (array) műveletek ---
                { "Mi a kimenet?<br> [1, 2, 3, 4].filter(x => x % 2 === 0).length": "2" },
                { "Mi a kimenet?<br> [10, 20, 30].pop()": "30" },
                { "Mi a kimenet?<br> [1, 2, 3].map(x => x * 2)[1]": "4" },
                { "Mi a kimenet?<br> [1, 2, 3].indexOf(2)": "1" },
                { "Mi lesz az eredmény?<br> [].length": "0" },

                // --- Objektumok ---
                { "Mi a kimenet?<br> Object.keys({a: 1, b: 2}).length": "2" },
                { "Mi a kimenet?<br> typeof []": "object" },
                { "Mi a kimenet?<br> typeof null": "object" },

                // --- Típuskonverziók és JS trükkök (A legjobb beugratósok) ---
                { "Mi lesz az eredmény?<br> 5 + '5'": "55" },
                { "Mi lesz az eredmény?<br> '10' - 2": "8" },
                { "Mi a kimenet?<br> '1' + 2 + 3": "123" },
                { "Mi a kimenet?<br> 1 + 2 + '3'": "33" },
                { "Mi a kimenet?<br> typeof NaN": "number" },

                // --- Logika és Boole értékek ---
                { "Igaz vagy Hamis?<br> 5 === '5'": "Hamis" },
                { "Igaz vagy Hamis?<br> NaN === NaN": "Hamis" },
                { "Igaz vagy Hamis?<br> [] == false": "Igaz" },
                { "Mi a kimenet?<br> true + true": "2" },

                // --- Matematika ---
                { "Mi lesz az eredmény?<br> 10 % 3": "1" },
                { "Mi a kimenet?<br> Math.max(1, 5, 3)": "5" }
            ];

            // 1. Kiválasztunk egy véletlenszerű objektumot
            let taskObject = tasksToSolve[Math.floor(Math.random() * tasksToSolve.length)];

            // 2. Kinyerjük a kulcsot (kérdés) és az értéket (megoldás)
            let question = Object.keys(taskObject)[0];          // Pl.: "Add össze: 2 + 2"
            let correctAnswer = Object.values(taskObject)[0];   // Pl.: 4

            // 3. A H2-be csak a kérdést írjuk ki
            rpgMiddle.innerHTML = `
            <div id="rpg-questions">
                <h1>Oldd meg:</h1>
                <h2>${question}</h2>
                <input type="text" id="questions-input" placeholder="Írd ide..." autocomplete="off">
            </div>
            `;

            // 4. Eseményfigyelő hozzáadása
            let input = document.getElementById("questions-input");
            if (input) {
                console.log(input)
                input.focus();
                input.addEventListener("keyup", (e) => {
                    // Mivel az input értéke mindig string, a correctAnswer-t is stringgé alakítjuk az összehasonlításhoz
                    if (e.key === "Enter") {
                        if (e.target.value === String(correctAnswer)) {
                            Engine.gameState.status = "clicker";
                            UI.activateOverlay();
                            console.log("Megoldva!");
                            // Ide jöhet a további logika (pl. pontadás, új feladat betöltése stb.)
                        }
                        else input.value = "";
                    }
                });
            }
            break;
        }
        case "clickOnTarget": {

            let score = 0;
            let miss = 0;
            let timeLeft = 60;
            let scoreToWin = 10;

            rpgMiddle.innerHTML = `
            <div id="rpg-clickOnTarget">
                <h1>Kattints a célpontra!</h1>
                <h2>Hátralévő idő: <span id="time-display">${timeLeft}</span> mp</h2>
                <p>Aktuális pontod: <span id="score-display">${score}</span></p>
                <p>Hiba: <span id="miss-display">${miss}</span></p>
            </div>
            `;

            const target = document.createElement("img");
            target.src = "../../source/img/bt-info.webp";
            target.style.position = "absolute";
            target.style.cursor = "pointer";
            target.style.width = "100px";
            target.style.zIndex = "50";

            rpgMiddle.appendChild(target);

            let speedX = 0;
            let speedY = 0;
            let x = Math.floor(Math.random() * (window.innerWidth - 100));
            let y = Math.floor(Math.random() * (window.innerHeight - 100));

            let animationId;

            // Animációs ciklus
            function animateTarget() {
                x += speedX;
                y += speedY;

                if (x <= 0 || x >= window.innerWidth - target.clientWidth) speedX = -speedX;
                if (y <= 0 || y >= window.innerHeight - target.clientHeight) speedY = -speedY;

                target.style.left = `${x}px`;
                target.style.top = `${y}px`;

                animationId = requestAnimationFrame(animateTarget);
            }

            // Animáció indítása
            animateTarget();

            // --- ESEMÉNYEK ---

            // 1. Célpont eltalálása (SCORE)
            target.addEventListener("click", (e) => {
                e.stopPropagation();
                score++;
                document.getElementById("score-display").innerText = score;

                x = Math.floor(Math.random() * (window.innerWidth - target.clientWidth));
                y = Math.floor(Math.random() * (window.innerHeight - target.clientHeight));

                // Opcionális: picit gyorsíthatjuk a célpontot minden találatnál.
                speedX += (speedX > 0 ? 0.5 : -0.5);
                speedY += (speedY > 0 ? 0.5 : -0.5);
            });

            rpgMiddle.addEventListener("click", (e) => {
                if (e.target !== target) {
                    miss++;
                    document.getElementById("miss-display").innerText = miss;
                }
            });

            // --- IDŐZÍTŐ ÉS JÁTÉK VÉGE ---
            let timerId = setInterval(() => {
                timeLeft--;
                document.getElementById("time-display").innerText = timeLeft;

                if (timeLeft <= 0) {
                    clearInterval(timerId);
                    cancelAnimationFrame(animationId);
                    target.remove();

                    if (score >= scoreToWin) {
                        rpgMiddle.innerHTML = `
                        <div>
                            <h1 style="color: green;">NYERTÉL!</h1>
                            <h2>Sikeresen eltaláltad ${score} alkalommal!</h2>
                            <p>Hibáid száma: ${miss}</p>
                        </div>
                    `;
                    } else {
                        rpgMiddle.innerHTML = `
                        <div>
                            <h1 style="color: red;">VESZTETTÉL!</h1>
                            <h2>Csak ${score} alkalommal találtál be (legalább ${scoreToWin} kellett volna).</h2>
                            <p>Hibáid száma: ${miss}</p>
                        </div>
                    `;
                    }
                }
            }, 1000);
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