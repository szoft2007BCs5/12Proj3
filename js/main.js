// main.js
import * as Overlay from "./overlay.js";
import * as Audio from "./audio.js";
import * as Input from "./input.js";

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Nyelv betöltése
    if (!localStorage.getItem("currentLang")) {
        localStorage.setItem("currentLang", "Magyar");
    }

    try {
        const filePath = "../source/data/lang.json";
        const response = await fetch(filePath);
        window.lang = await response.json();
    } catch (error) {
        console.error(`Hiba a ${filePath} fájl betöltésekor:`, error);
        window.lang = {}; // Üres objektum hiba esetére
    }

    // 2. Rendszerek indítása
    Overlay.enableTemplate("main"); // Főoldal megjelenítése
    Input.setupGlobalInput();       // Billentyűzet figyelés indítása

    // 3. Hangok előkészítése
    Audio.setupPremadeAudios();
});