import { gameEngine } from "./engine.js";

export class ConsoleManager {
    constructor() {
        this.terminalId = "console-log";
    }

    renderToScreen(text) {
        const terminal = document.getElementById(this.terminalId);
        if (!terminal) return;

        const newElement = document.createElement("p");
        newElement.className = "console-log-item"; 

        const now = new Date();
        const time = now.getHours().toString().padStart(2, '0') + ":" +
            now.getMinutes().toString().padStart(2, '0') + ":" +
            now.getSeconds().toString().padStart(2, '0');

        newElement.innerHTML = time + " > " + text;

        terminal.appendChild(newElement);
        terminal.scrollTop = terminal.scrollHeight;
    }

    writeLog(text) {
        if (text === undefined || text === null || text.trim() === "") return;

        const command = text.trim().toLowerCase();

        if (/^add \d+$/.test(text)) {
            const amount = parseInt(text.split(" ")[1]);
            gameEngine.gameState.codeLines += amount;
            gameEngine.gameState.totalCodeGenerated += amount;
            this.renderToScreen("SYSTEM: Egyenleg feltöltve: " + amount);
            return;
        }

        switch (command) {
            case "clear":
                this.clearLogs();
                return;
            case "start":
                this.renderToScreen("SYSTEM: Üdvözöllek a játékban!");
                this.renderToScreen("SYSTEM: A te kedves, megbízható rendszered beszél!");
                return;
            case "save":
                gameEngine.saveGame();
                this.saveLogs()
                return;
            case "load":
                gameEngine.loadGame();
                this.loadLogs();
                return;
            case "blue death":
                gameEngine.gameState.status = "BSOD";
                gameEngine.triggerEvent("blue death");
                return;
            case "mester":
                gameEngine.triggerEvent("mester");
                return;
            default:
                this.renderToScreen(text);
                return;
        }
    }

    clearLogs() {
        const terminal = document.getElementById(this.terminalId);
        if(terminal) terminal.innerHTML = "";
    }

    saveLogs() {
        const terminal = document.getElementById(this.terminalId);
        if(!terminal) return;
        const items = Array.from(terminal.querySelectorAll(".console-log-item"))
            .map(p => p.innerHTML);

        localStorage.setItem("console_logs", JSON.stringify(items));
        this.renderToScreen("SYSTEM: Logs have been saved!");
    }

    loadLogs() {
        const saved = localStorage.getItem("console_logs");
        if (saved) {
            this.clearLogs(); 
            const reg = /^.*?&gt;/;
            const items = JSON.parse(saved);
            items.forEach(content => {
                console.log(content.replace(reg, ""))
                this.renderToScreen(content.replace(reg, ""))
            });
            this.renderToScreen("SYSTEM: Logs have been loaded!");
        } else {
            this.renderToScreen("SYSTEM: No saved logs found.");
        }
    }

    setupInput() {
        const consoleInput = document.getElementById("console-input");
        if(consoleInput) {
            consoleInput.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    this.writeLog(consoleInput.value);
                    consoleInput.value = "";
                }
            });
        }
    }
}

export const consoleManager = new ConsoleManager();