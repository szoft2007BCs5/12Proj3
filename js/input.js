import * as Overlay from "./overlay.js";

document.addEventListener("DOMContentLoaded", () => {

    // Billentyűzet figyelése
    document.addEventListener("keydown", (e) => {
        console.log(`Billentyű lenyomva: ${e.key}`);
        
        if (e.key === "Escape") {
            Overlay.toggleSettings();
        }

        if (e.key === "m")
            Overlay.enableTemplate("main")
    });

    // Egérkattintás figyelése
    document.addEventListener("click", (e) => {
        console.log("Egér kattintás történt!");
        console.log(`Koordináták: X=${e.clientX}, Y=${e.clientY}`);
    });

});