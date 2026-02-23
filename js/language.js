import { gameEngine } from "./engine.js";

export class LanguageManager {
    constructor() {
        // Egyel kijjebb hozva az útvonal
        this.filePath = "../source/data/language.json";
    }

    setupLanguageSelector() {
        const selector = document.getElementById("language-selector");
        if(selector) {
            selector.addEventListener("change", (e) => {
                const selectedLanguage = e.target.value.toLowerCase();
                gameEngine.gameState.currentLanguage = selectedLanguage;
                this.changeLanguage(selectedLanguage);
            });
        }
    }

    async changeLanguage(selectedLanguage) {
        try {
            const response = await fetch(this.filePath);
            if (!response.ok) throw new Error("Nyelvi fájl nem található!");
            
            const data = await response.json();
            
            Object.entries(data).forEach(([elementId, translations]) => {
                const item = document.getElementById(elementId);
                if (item && translations[selectedLanguage]) {
                    item.innerHTML = translations[selectedLanguage];
                }
            });
        } catch (error) {
            console.error("Hiba a nyelv betöltésekor:", error);
        }
    }
}

export const languageManager = new LanguageManager();