import { gameState } from "./engine.js";

// =========================================================================
// NYELVI BEÁLLÍTÁSOK (LANGUAGE SYSTEM)
// =========================================================================

export function setupLanguageSelector() {
    const selector = document.getElementById("language-selector");
    selector.addEventListener("change", (e) => {
        const selectedLanguage = e.target.value.toLowerCase();
        gameState.currentLanguage = selectedLanguage;
        changeLanguage(selectedLanguage);
    });
}

async function changeLanguage(selectedLanguage) {
    fetch("../../source/data/language.json")
        .then(response => response.json())
        .then(data => {
            Object.entries(data).forEach(([elementId, translations]) => {
                const item = document.getElementById(elementId);

                if (item) {
                    if (translations[selectedLanguage]) {
                        item.innerHTML = translations[selectedLanguage];
                    }
                }
            });
        });
}