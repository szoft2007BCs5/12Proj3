// input.js
import * as Overlay from "./overlay.js";

export function setupGlobalInput() {
    // Billentyűzet figyelése a főablakban
    document.addEventListener("keydown", (e) => {
        
        // Debug (opcionális, kivehető)
        console.log(`Billentyű lenyomva: ${e.key}`);

        if (e.key === "Escape") {
            Overlay.toggleSettings();
        }

        // Teszt funkció (opcionális, kivehető)
        if (e.key === "m") {
            Overlay.enableTemplate("main");
        }
    });
}