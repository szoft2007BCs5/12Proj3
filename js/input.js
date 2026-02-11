// input.js
import * as Overlay from "./overlay.js";

// Ez a függvény fut le minden gombnyomásra, bárhonnan is jöjjön
export function handleKeyDown(e) {
    if (e.key === "Escape") {
        Overlay.toggleSettings();
    }

    if (e.key === "m") {
        Overlay.enableTemplate("main");
    }
}

// A főablak
export function setupGlobalInput() {
    document.addEventListener("keydown", handleKeyDown);
}