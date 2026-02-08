import * as Overlay from "./overlay.js";
import * as Audio from "./audio.js";

document.addEventListener("DOMContentLoaded", async () => {
  if (!localStorage.getItem("currentLang"))
    //ha nincs elmentve aktuális nyelv, akkor magyar lesz az alapértelmezett
    localStorage.setItem("currentLang", "Magyar");

  if (!localStorage.getItem("volume"))
    //ha nincs elmentve aktuális hangerő, akkor 50 lesz az alapértelmezett
    localStorage.setItem("volume", "50");

  window.lang = await fetch("../source/data/lang.json") //nyelveket tartalmzó fájl betöltése
    .then((promise) => promise.json())
    .catch((error) => console.log(error));

  Overlay.enableTemplate("main"); //main betöltése
  Overlay.AddBtEventListeners(); //gombok eseménykezelői

  document.addEventListener(
    "click",
    () => {
      Audio.playAudio(
        "../source/audio/chill-drum-loop.mp3",
        localStorage.getItem("volume") / 100,
      ); //zene elindítása a mentett hangerővel
    },
    { once: true },
  ); //csak egyszer, hogy ne induljon újra a zene minden kattintásra
});
