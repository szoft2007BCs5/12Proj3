import * as Menu from "./menu.js";

export function AddBtEventListeners() {
  //main oldal gombjainak eseménykezelőinek hozzáadaása
  document
    .getElementsByClassName("bt-settings")[0]
    .addEventListener("click", () => {
      enableTemplate("settings");
    });

  document
    .getElementsByClassName("bt-info")[0]
    .addEventListener("click", () => {
      enableTemplate("info");
    });

  document
    .getElementsByClassName("bt-play")[0]
    .addEventListener("click", () => {
      console.log("play");
    });
}

export function enableTemplate(selected) {
  //kiválasztott oldal betöltése
  const templateSelected = document.getElementById(`overlay-${selected}`); //kiválasztott oldal template-je
  if (!templateSelected) throw new Error(`Nem található ${selected} template`); //hiba kezelése, ha nem található a kiválasztott oldal
  const screen = document.getElementById("screen"); //oldal tartalma
  screen.innerHTML = templateSelected.innerHTML; //kiválasztott oldal betöltése
  changeLanguage(); //betöltött oldal nyelvének beállítása

  if (selected == "settings") {
    //settings oldal eseménykezelőinek hozzáadása
    document
      .getElementsByClassName("bt-back")[0] //vissza a main oldalra
      .addEventListener("click", () => {
        enableTemplate("main");
      });
    Menu.synchronizeVolumeOnChange();

    const langSelect = document.getElementById("language-select"); //nyelv választó eseménykezelője
    langSelect.value = localStorage.getItem("currentLang"); //aktuális nyelv beállítása
    langSelect.addEventListener("change", (x) => {
      changeLanguage(x.target.value);
    }); //nyelv változtatása
  } else if (selected == "main") {
    AddBtEventListeners(); //main oldal eseménykezelőinek újra hozzáadása, mivel a main oldal újratöltődik
  } else if (selected == "info") {
    document
      .getElementsByClassName("bt-back")[0] //vissza a main oldalra
      .addEventListener("click", () => {
        enableTemplate("main");
      });
  }
}

export function changeLanguage(selected = localStorage.getItem("currentLang")) {
  for (const e in window.lang) {
    //minden elemre a lang fájlban
    if (document.getElementById(e))
      document.getElementById(e).innerHTML =
        window.lang[e][selected.toLowerCase()];
  }
  localStorage.setItem("currentLang", selected); //aktuális nyelv elmentése
}
