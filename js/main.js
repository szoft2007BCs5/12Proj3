import * as Overlay from "./overlay.js";
import * as Audio from "./audio.js";


document.addEventListener("DOMContentLoaded", async () => {
    if (!localStorage.getItem("currentLang")) //ha nincs elmentve aktuális nyelv, akkor magyar lesz az alapértelmezett
        localStorage.setItem("currentLang", "Magyar");

    window.lang = await fetch("../source/data/lang.json") //nyelveket tartalmzó fájl betöltése
        .then((promise) => promise.json())
        .catch((error) => console.log(error));

    Overlay.enableTemplate("main"); //main betöltése
    Overlay.AddBtEventListeners(); //gombok eseménykezelői

//    Audio.setupButtonClickSounds("../source/audio/button-click4.mp3"); //button click sound beállítása

    document.addEventListener("click", () => {
        Audio.playAudio("../source/audio/chill-drum-loop.mp3", "music", true); //zene elindítása a mentett hangerővel
    }, { once: true }); //csak egyszer, hogy ne induljon újra a zene minden kattintásra
});