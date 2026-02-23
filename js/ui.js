import { gameEngine } from "./engine.js";

export class UIManager {
    constructor() {
        this.codeLinesCounter = document.getElementById("codeLinesCounter");
    }

    updateDisplay() {
        if(this.codeLinesCounter) {
            this.codeLinesCounter.innerHTML = this.formatNumber(gameEngine.gameState.codeLines);
        }
    }

    activateOverlay() {
        const overlays = document.querySelectorAll(".overlay");
        let activeStatus = gameEngine.gameState.status;

        overlays.forEach((overlay) => {
            if (overlay.id === "clicker-overlay") this.renderShop();

            if (overlay.id !== `${activeStatus}-overlay`) {
                overlay.classList.remove("active-overlay");
                overlay.classList.add("hidden-overlay");
            } else {
                overlay.classList.add("active-overlay");
                overlay.classList.remove("hidden-overlay");
            }
        });
    }

    renderShop() {
        const clickerShop = document.getElementById("clicker-shop");
        if(!clickerShop) return;
        clickerShop.innerHTML = "";

        const units = gameEngine.upgrades.units;
        const inventory = gameEngine.gameState.inventory;

        let maxVisibleLevel = 1;

        for (let lvl = 1; lvl < 10; lvl++) {
            const itemsInLevel = units.filter(u => u.level === lvl);
            if (itemsInLevel.length === 0) break;

            const isLevelComplete = itemsInLevel.every(u =>
                inventory[u.id] && inventory[u.id] > 0
            );

            if (isLevelComplete) {
                maxVisibleLevel = lvl + 1;
            } else {
                break;
            }
        }

        gameEngine.gameState.level = maxVisibleLevel;
        const unitsToRender = units.filter(u => u.level <= maxVisibleLevel);

        unitsToRender.forEach((unit) => {
            let div = document.createElement("div");
            div.classList = "clicker-shop-item";
            div.id = `level-${unit.level}`;

            if (inventory[unit.id]) {
                div.innerHTML = `
                    <div id="clicker-shop-item-left">
                        <h1 id="clicker-item-count">${inventory[unit.id]}</h1>
                    </div>
                    <div class="clicker-shop-item-center">
                        <div id="clicker-shop-item-title">
                            <h1>${unit.id}</h1>
                            <p>${unit.desc}</p>
                        </div>
                        <div id="clicker-shop-item-mid">
                            <div id="clicker-shop-item-description">
                                <h2>Ár: ${this.formatNumber(unit.cost)}</h2>
                            </div>
                            <div id="clicker-shop-item-prod">
                                <p>+${this.formatNumber((unit.prod * inventory[unit.id] * 10))}/sec</p>
                                <p>+${this.formatNumber((unit.powerincrease * inventory[unit.id]))}/click</p>
                                <p class="msg-italic">(Alap: ${unit.prod * 10}/s, ${unit.powerincrease}/c)</p>
                            </div>
                        </div>
                    </div>
                    <div class="clicker-shop-item-right">
                        <button id="buy-bt" class="button" draggable="false">+</button>
                    </div>`;
            } else {
                div.innerHTML = `
                    <div id="clicker-shop-item-left">
                        <h1 id="clicker-item-count">0</h1>
                    </div>
                    <div class="clicker-shop-item-center">
                        <div id="clicker-shop-item-title">
                            <h1>${unit.id}</h1>
                            <p>${unit.desc}</p>
                        </div>
                        <div id="clicker-shop-item-mid">
                            <div id="clicker-shop-item-description">
                                <h2>Ár: ${this.formatNumber(unit.cost)}</h2>
                            </div>
                            <div id="clicker-shop-item-prod">
                                <p>+${this.formatNumber(unit.prod) * 10}/sec</p>
                                <p>+${this.formatNumber(unit.powerincrease)}/click</p>
                            </div>
                        </div>
                    </div>
                    <div class="clicker-shop-item-right">
                        <button id="buy-bt" class="button" draggable="false">+</button>
                    </div>`;
            }

            clickerShop.appendChild(div);
            div.addEventListener("click", (e) => {
                if (e.target.closest("#buy-bt"))
                    gameEngine.buyUnit(unit.id);
            });
        });
    }

    renderDoor() {
        const door = document.getElementById("rpg-entry");
        if(door) {
            door.addEventListener("click", () => {
                gameEngine.gameState.status = "rpg";
                this.activateOverlay();
                gameEngine.loadRPGEvent();
            });
        }
    }

    async activateRPGOverlay(event) {
        let rpgMiddle = document.getElementById("rpg-middle");
        if(!rpgMiddle) return;
        rpgMiddle.innerHTML = "";
        let isGameActive = true; 

        const applyReward = (isWin) => {
            let totalGen = gameEngine.gameState.totalCodeGenerated || 0;
            let amount = Math.floor(totalGen * 0.01);
            
            if (isWin) {
                gameEngine.gameState.codeLines += amount;
                gameEngine.gameState.totalCodeGenerated += amount;
                return `+${amount} kódsor`;
            } else {
                gameEngine.gameState.codeLines -= amount;
                if (gameEngine.gameState.codeLines < 0) gameEngine.gameState.codeLines = 0;
                return `-${amount} kódsor`;
            }
        };

        const closeGame = (isWin, customMessage = "") => {
            if (!isGameActive) return;
            isGameActive = false;

            let rewardText = applyReward(isWin);
            let titleClass = isWin ? "win" : "lose";
            let title = isWin ? "NYERTÉL!" : "VESZTETTÉL!";

            rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-result-title ${titleClass}">${title}</h1>
                    <h2 class="rpg-subtitle">${customMessage}</h2>
                    <h3 class="rpg-reward-text ${titleClass}">${rewardText}</h3>
                </div>
            `;

            setTimeout(() => {
                gameEngine.gameState.status = "clicker";
                this.activateOverlay();
            }, 2500);
        };

        const appendExitButton = () => {
            let exitBtn = document.createElement("button");
            exitBtn.innerText = "✖ Feladás";
            exitBtn.className = "rpg-btn-exit";
            exitBtn.addEventListener("click", () => closeGame(false, "Megfutamodtál! A gyávaságnak ára van."));
            rpgMiddle.appendChild(exitBtn);
        };

        switch (event) {
            case "questions": {
                const tasksToSolve = [
                    { "Mi a kimenet?<br> 'hello'.toUpperCase().charAt(0)": "H" },
                    { "Mi a kimenet?<br> 'a,b,c'.split(',').length": "3" },
                    { "Mi lesz az eredmény?<br> 5 + '5'": "55" }
                ];
                let taskObj = tasksToSolve[Math.floor(Math.random() * tasksToSolve.length)];
                let question = Object.keys(taskObj)[0];
                let answer = Object.values(taskObj)[0];

                rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-title">Oldd meg:</h1>
                    <h2 class="rpg-subtitle">${question}</h2>
                    <input type="text" id="questions-input" class="rpg-input" placeholder="Írd ide..." autocomplete="off">
                    <p><small>(Egy tipped van! Üss Enter-t.)</small></p>
                </div>`;
                appendExitButton();

                let input = document.getElementById("questions-input");
                input.focus();
                input.addEventListener("keyup", (e) => {
                    if (e.key === "Enter" && isGameActive) {
                        if (e.target.value.trim() === String(answer)) closeGame(true, "Helyes válasz!");
                        else closeGame(false, `Helytelen! A jó válasz: ${answer}`);
                    }
                });
                break;
            }

            case "clickOnTarget": {
                let score = 0, miss = 0, timeLeft = 15, scoreToWin = 10;
                rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-title">Kattints a célpontra!</h1>
                    <h2 class="rpg-subtitle">Idő: <span id="time-display">${timeLeft}</span> mp</h2>
                    <p>Pont: <span id="score-display">0</span> | Hiba: <span id="miss-display">0</span></p>
                </div>`;
                appendExitButton();

                const target = document.createElement("img");
                target.src = "../source/img/bt-info.webp";
                target.className = "rpg-target-img";
                rpgMiddle.appendChild(target);

                let speedX = 2, speedY = 2, x = 100, y = 100, animationId;
                const animateTarget = () => {
                    if (!isGameActive) return;
                    x += speedX; y += speedY;
                    if (x <= 0 || x >= window.innerWidth - 80) speedX = -speedX;
                    if (y <= 0 || y >= window.innerHeight - 80) speedY = -speedY;
                    target.style.left = `${x}px`; target.style.top = `${y}px`;
                    animationId = requestAnimationFrame(animateTarget);
                };
                animateTarget();

                target.addEventListener("click", (e) => {
                    if (!isGameActive) return;
                    e.stopPropagation();
                    score++; document.getElementById("score-display").innerText = score;
                    speedX += (speedX > 0 ? 0.5 : -0.5); speedY += (speedY > 0 ? 0.5 : -0.5);
                });
                rpgMiddle.addEventListener("click", (e) => {
                    if (isGameActive && e.target !== target && e.target.tagName !== "BUTTON") {
                        miss++; document.getElementById("miss-display").innerText = miss;
                    }
                });

                let timerId = setInterval(() => {
                    if (!isGameActive) return clearInterval(timerId);
                    timeLeft--; document.getElementById("time-display").innerText = timeLeft;
                    if (timeLeft <= 0) {
                        clearInterval(timerId); cancelAnimationFrame(animationId);
                        if (target.parentNode) target.remove();
                        if (score >= scoreToWin) closeGame(true, `Sikeresen eltaláltad ${score}x!`);
                        else closeGame(false, `Csak ${score}x találtál be (kell: ${scoreToWin}).`);
                    }
                }, 1000);
                break;
            }

            case "spamClick": {
                let clicks = 0, targetClicks = 40, timeLeft = 10;
                rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-title">Gyors kattintó!</h1>
                    <h2 class="rpg-subtitle">Kattints ${targetClicks}x ${timeLeft} másodperc alatt!</h2>
                    <h2>Idő: <span id="spam-time">${timeLeft}</span> | Kattintások: <span id="spam-clicks">0</span></h2>
                    <button id="spam-btn" class="rpg-btn rpg-btn-huge">KATTINTS RÁM!</button>
                </div>`;
                appendExitButton();

                let btn = document.getElementById("spam-btn");
                let timerId = setInterval(() => {
                    if (!isGameActive) return clearInterval(timerId);
                    timeLeft--; document.getElementById("spam-time").innerText = timeLeft;
                    if (timeLeft <= 0) {
                        clearInterval(timerId);
                        if (clicks >= targetClicks) closeGame(true, "Meglett a sebesség!");
                        else closeGame(false, "Túl lassú voltál!");
                    }
                }, 1000);

                btn.addEventListener("click", () => {
                    if (timeLeft > 0 && isGameActive) {
                        clicks++; document.getElementById("spam-clicks").innerText = clicks;
                        if (clicks >= targetClicks) {
                            clearInterval(timerId); closeGame(true, "Hihetetlen sebesség!");
                        }
                    }
                });
                break;
            }

            case "typingTest": {
                let sentence = "console.log('Hello');";
                let timeLeft = 15;
                rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-title">Írd le pontosan!</h1>
                    <h2 class="rpg-highlight-box">${sentence}</h2>
                    <input type="text" id="type-input" class="rpg-input" autocomplete="off">
                    <h3>Idő: <span id="type-time">${timeLeft}</span> mp</h3>
                </div>`;
                appendExitButton();

                let inputEle = document.getElementById("type-input");
                inputEle.focus();
                let timerId = setInterval(() => {
                    if (!isGameActive) return clearInterval(timerId);
                    timeLeft--; document.getElementById("type-time").innerText = timeLeft;
                    if (timeLeft <= 0) { clearInterval(timerId); closeGame(false, "Lejárt az idő!"); }
                }, 1000);

                inputEle.addEventListener("input", (e) => {
                    if (isGameActive && e.target.value === sentence) {
                        clearInterval(timerId); closeGame(true, "Tökéletes gépelés!");
                    }
                });
                break;
            }

            case "memory": {
                let code = Math.floor(100000 + Math.random() * 900000).toString();
                rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-title">Jegyezd meg!</h1>
                    <h1 class="rpg-memory-text">${code}</h1>
                    <h3>Eltűnik 3 mp múlva...</h3>
                </div>`;
                appendExitButton();

                setTimeout(() => {
                    if (!isGameActive) return;
                    rpgMiddle.innerHTML = `
                    <div class="rpg-container">
                        <h1 class="rpg-title">Írd be a kódot!</h1>
                        <input type="text" id="memory-input" class="rpg-input" autocomplete="off">
                        <button id="memory-btn" class="rpg-btn mt-10">Ellenőrzés</button>
                    </div>`;
                    appendExitButton();
                    document.getElementById("memory-input").focus();
                    document.getElementById("memory-btn").addEventListener("click", () => {
                        if (document.getElementById("memory-input").value === code) closeGame(true, "Tökéletes!");
                        else closeGame(false, `Hibás! A kód ${code} volt.`);
                    });
                }, 3000);
                break;
            }

            case "colorMatch": {
                const colors = [{ n: "PIROS", h: "red" }, { n: "KÉK", h: "blue" }, { n: "ZÖLD", h: "green" }];
                let t = colors[Math.floor(Math.random() * colors.length)];
                let c = colors[Math.floor(Math.random() * colors.length)];
                let timeLeft = 5;
                rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-title">Milyen SZÍNNEL van írva?</h1>
                    <h1 class="rpg-color-text color-${c.h}">${t.n}</h1>
                    <h3>Idő: <span id="color-time">${timeLeft}</span> mp</h3>
                    <div class="rpg-flex-row">
                        ${colors.map(col => `<button class="rpg-btn color-btn" data-color="${col.h}">${col.n}</button>`).join('')}
                    </div>
                </div>`;
                appendExitButton();

                let timerId = setInterval(() => {
                    if (!isGameActive) return clearInterval(timerId);
                    timeLeft--; document.getElementById("color-time").innerText = timeLeft;
                    if (timeLeft <= 0) { clearInterval(timerId); closeGame(false, "Lassú voltál!"); }
                }, 1000);

                document.querySelectorAll(".color-btn").forEach(btn => {
                    btn.addEventListener("click", (e) => {
                        if (!isGameActive) return;
                        clearInterval(timerId);
                        if (e.target.getAttribute("data-color") === c.h) closeGame(true, "Szép munka!");
                        else closeGame(false, "Beugrottál!");
                    });
                });
                break;
            }

            case "findTheBug": {
                const blocks = [
                    { code: "let x = 10;<br>console.log(x);", bug: false },
                    { code: "const y = 5;<br>y = 10;", bug: true },
                    { code: "function a() { return 1; }", bug: false }
                ].sort(() => Math.random() - 0.5);

                rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-title">Keresd a hibát!</h1>
                    <div class="rpg-flex-row">
                        ${blocks.map(b => `<div class="rpg-bug-box" data-bug="${b.bug}">${b.code}</div>`).join('')}
                    </div>
                </div>`;
                appendExitButton();

                document.querySelectorAll(".rpg-bug-box").forEach(box => {
                    box.addEventListener("click", (e) => {
                        if (!isGameActive) return;
                        if (e.currentTarget.getAttribute("data-bug") === "true") closeGame(true, "Megvan a bug!");
                        else closeGame(false, "Ez a kód jó volt!");
                    });
                });
                break;
            }

            case "mathRush": {
                let n1 = Math.floor(Math.random() * 20) + 1;
                let n2 = Math.floor(Math.random() * 20) + 1;
                let ans = n1 + n2;
                let timeLeft = 6;
                rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-title">Gyors matek!</h1>
                    <h2 class="rpg-subtitle">${n1} + ${n2} = ?</h2>
                    <input type="number" id="math-input" class="rpg-input" autocomplete="off">
                    <h3>Idő: <span id="math-time">${timeLeft}</span> mp</h3>
                </div>`;
                appendExitButton();

                let input = document.getElementById("math-input");
                input.focus();
                let timerId = setInterval(() => {
                    if (!isGameActive) return clearInterval(timerId);
                    timeLeft--; document.getElementById("math-time").innerText = timeLeft;
                    if (timeLeft <= 0) { clearInterval(timerId); closeGame(false, "Lejárt az idő!"); }
                }, 1000);

                input.addEventListener("keyup", (e) => {
                    if (e.key === "Enter" && isGameActive) {
                        clearInterval(timerId);
                        if (parseInt(e.target.value) === ans) closeGame(true, "Gyors és pontos!");
                        else closeGame(false, "Hibás számolás!");
                    }
                });
                break;
            }

            case "wordScramble": {
                let words = ["JAVASCRIPT", "FUNCTION", "VARIABLE", "BOOLEAN"];
                let word = words[Math.floor(Math.random() * words.length)];
                let scrambled = word.split('').sort(() => 0.5 - Math.random()).join('');
                
                rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-title">Rakd sorba a betűket!</h1>
                    <h2 class="rpg-highlight-box">${scrambled}</h2>
                    <input type="text" id="scramble-input" class="rpg-input text-upper">
                </div>`;
                appendExitButton();

                let input = document.getElementById("scramble-input");
                input.focus();
                input.addEventListener("keyup", (e) => {
                    if (e.key === "Enter" && isGameActive) {
                        if (e.target.value.toUpperCase() === word) closeGame(true, "Helyes!");
                        else closeGame(false, `A szó ${word} volt.`);
                    }
                });
                break;
            }

            case "sequenceClick": {
                let nextNum = 1;
                let nums = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
                rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-title">Kattints sorrendben (1-5)!</h1>
                    <div class="rpg-flex-row">
                        ${nums.map(n => `<button class="rpg-btn seq-btn" data-n="${n}">${n}</button>`).join('')}
                    </div>
                </div>`;
                appendExitButton();

                document.querySelectorAll(".seq-btn").forEach(btn => {
                    btn.addEventListener("click", (e) => {
                        if (!isGameActive) return;
                        let clicked = parseInt(e.target.getAttribute("data-n"));
                        if (clicked === nextNum) {
                            e.target.disabled = true;
                            nextNum++;
                            if (nextNum > 5) closeGame(true, "Szép sorrend!");
                        } else {
                            closeGame(false, "Rossz sorrend!");
                        }
                    });
                });
                break;
            }

            case "reactionTime": {
                let isGreen = false;
                let timer;
                rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-title">Reakcióidő!</h1>
                    <h2 class="rpg-subtitle">Kattints, ha ZÖLD lesz! (Ne előbb!)</h2>
                    <div id="reaction-box" class="rpg-reaction-box">VÁRJ...</div>
                </div>`;
                appendExitButton();

                let box = document.getElementById("reaction-box");
                let waitTime = Math.floor(Math.random() * 3000) + 1000;
                let startTime;

                timer = setTimeout(() => {
                    if (!isGameActive) return;
                    isGreen = true;
                    box.classList.add("ready");
                    box.innerText = "KATTINTS!";
                    startTime = Date.now();
                }, waitTime);

                box.addEventListener("click", () => {
                    if (!isGameActive) return;
                    if (!isGreen) {
                        clearTimeout(timer);
                        closeGame(false, "Túl korán kattintottál!");
                    } else {
                        let timeTaken = Date.now() - startTime;
                        if (timeTaken < 500) closeGame(true, `Villámgyors! (${timeTaken}ms)`);
                        else closeGame(false, `Túl lassú! (${timeTaken}ms - max 500ms)`);
                    }
                });
                break;
            }

            case "higherLower": {
                let currentNum = Math.floor(Math.random() * 90) + 5;
                let nextNum = Math.floor(Math.random() * 100) + 1;
                while(nextNum === currentNum) nextNum = Math.floor(Math.random() * 100) + 1;

                rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-title">Kisebb vagy Nagyobb?</h1>
                    <h2 class="rpg-subtitle">Jelenlegi szám: <span class="rpg-highlight-box">${currentNum}</span></h2>
                    <div class="rpg-flex-row">
                        <button class="rpg-btn hl-btn" data-guess="lower">Kisebb</button>
                        <button class="rpg-btn hl-btn" data-guess="higher">Nagyobb</button>
                    </div>
                </div>`;
                appendExitButton();

                document.querySelectorAll(".hl-btn").forEach(btn => {
                    btn.addEventListener("click", (e) => {
                        if (!isGameActive) return;
                        let guess = e.target.getAttribute("data-guess");
                        let isHigher = nextNum > currentNum;
                        if ((guess === "higher" && isHigher) || (guess === "lower" && !isHigher)) {
                            closeGame(true, `A következő szám ${nextNum} volt.`);
                        } else {
                            closeGame(false, `Tévedtél. A szám ${nextNum} volt.`);
                        }
                    });
                });
                break;
            }

            case "rps": {
                let options = ["kő", "papír", "olló"];
                rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-title">Kő, Papír, Olló!</h1>
                    <h2 class="rpg-subtitle">Győzd le a gépet!</h2>
                    <div class="rpg-flex-row">
                        <button class="rpg-btn rps-btn" data-c="kő">Kő</button>
                        <button class="rpg-btn rps-btn" data-c="papír">Papír</button>
                        <button class="rpg-btn rps-btn" data-c="olló">Olló</button>
                    </div>
                </div>`;
                appendExitButton();

                document.querySelectorAll(".rps-btn").forEach(btn => {
                    btn.addEventListener("click", (e) => {
                        if (!isGameActive) return;
                        let p = e.target.getAttribute("data-c");
                        let b = options[Math.floor(Math.random() * options.length)];
                        
                        if (p === b) closeGame(false, `Döntetlen (${b}). Ez vereségnek számít.`);
                        else if ((p === "kő" && b === "olló") || (p === "papír" && b === "kő") || (p === "olló" && b === "papír")) {
                            closeGame(true, `Gép választása: ${b}. Nyertél!`);
                        } else {
                            closeGame(false, `Gép választása: ${b}. Vesztettél!`);
                        }
                    });
                });
                break;
            }

            case "stopwatch": {
                let time = 0.0;
                let timerId = null;
                rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-title">Állítsd meg pontosan!</h1>
                    <h2 class="rpg-subtitle">Cél: 5.0 másodperc (+/- 0.2s)</h2>
                    <h1 class="rpg-highlight-box" id="stopwatch-time">0.0</h1>
                    <br>
                    <button id="stopwatch-btn" class="rpg-btn">START</button>
                </div>`;
                appendExitButton();

                let btn = document.getElementById("stopwatch-btn");
                let display = document.getElementById("stopwatch-time");

                btn.addEventListener("click", () => {
                    if (!isGameActive) return;
                    if (!timerId) {
                        btn.innerText = "STOP";
                        timerId = setInterval(() => {
                            time += 0.1;
                            display.innerText = time.toFixed(1);
                        }, 100);
                    } else {
                        clearInterval(timerId);
                        if (time >= 4.8 && time <= 5.2) closeGame(true, `Pontos! (${time.toFixed(1)}s)`);
                        else closeGame(false, `Túl pontatlan! (${time.toFixed(1)}s)`);
                    }
                });
                break;
            }

            case "oddOneOut": {
                let items = [
                    { t: "HTML", odd: false }, { t: "CSS", odd: false },
                    { t: "JS", odd: false }, { t: "C++", odd: true }
                ].sort(() => Math.random() - 0.5);

                rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-title">Kakukktojás</h1>
                    <h2 class="rpg-subtitle">Melyik NEM webes frontend nyelv?</h2>
                    <div class="rpg-flex-row">
                        ${items.map(i => `<button class="rpg-btn odd-btn" data-odd="${i.odd}">${i.t}</button>`).join('')}
                    </div>
                </div>`;
                appendExitButton();

                document.querySelectorAll(".odd-btn").forEach(btn => {
                    btn.addEventListener("click", (e) => {
                        if (!isGameActive) return;
                        if (e.target.getAttribute("data-odd") === "true") closeGame(true, "Eltaláltad!");
                        else closeGame(false, "Ez nem kakukktojás!");
                    });
                });
                break;
            }

            case "binaryQuiz": {
                let num = Math.floor(Math.random() * 15) + 1;
                let bin = num.toString(2);
                rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-title">Bináris fordító</h1>
                    <h2 class="rpg-subtitle">Mennyi ez tízes számrendszerben: <span class="rpg-highlight-box">${bin}</span> ?</h2>
                    <input type="number" id="binary-input" class="rpg-input" autocomplete="off">
                </div>`;
                appendExitButton();

                let input = document.getElementById("binary-input");
                input.focus();
                input.addEventListener("keyup", (e) => {
                    if (e.key === "Enter" && isGameActive) {
                        if (parseInt(e.target.value) === num) closeGame(true, "Helyes megfejtés!");
                        else closeGame(false, `A helyes válasz: ${num}`);
                    }
                });
                break;
            }

            case "minesweeperMini": {
                let grid = [0,0,0,0,0,0,0,0,0];
                grid[Math.floor(Math.random() * 9)] = 1; 
                let safeClicks = 0;

                rpgMiddle.innerHTML = `
                <div class="rpg-container">
                    <h1 class="rpg-title">Aknakereső</h1>
                    <h2 class="rpg-subtitle">Kattints 3 BIZTONSÁGOS mezőre (1 akna van)!</h2>
                    <div class="rpg-flex-grid">
                        ${grid.map((m, i) => `<button class="rpg-btn mine-btn h-60" data-m="${m}">?</button>`).join('')}
                    </div>
                </div>`;
                appendExitButton();

                document.querySelectorAll(".mine-btn").forEach(btn => {
                    btn.addEventListener("click", (e) => {
                        if (!isGameActive || e.target.disabled) return;
                        e.target.disabled = true;
                        if (e.target.getAttribute("data-m") === "1") {
                            e.target.classList.add("bg-red");
                            closeGame(false, "BUMM! Aknára léptél.");
                        } else {
                            e.target.classList.add("bg-green");
                            safeClicks++;
                            if (safeClicks >= 3) closeGame(true, "Túlélted az aknamezőt!");
                        }
                    });
                });
                break;
            }

            default: {
                console.log("Ismeretlen RPG esemény:", event);
                return;
            }
        }
    }

    formatNumber(num) {
        if (num < 1000) return Math.floor(num); 

        const suffixes = ["", "k", "M", "B", "T", "Qa", "Qi"]; 
        const suffixNum = Math.floor(Math.log10(num) / 3); 

        if (suffixNum >= suffixes.length) return num.toExponential(2);

        const shortValue = (num / Math.pow(1000, suffixNum));
        return parseFloat(shortValue.toFixed(3)) + suffixes[suffixNum];
    }
}

export const uiManager = new UIManager();