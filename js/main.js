import { enableTemplate } from "./overlay.js";

function ChangeLanguage(btLang){
    for (const e in JSONfile) {
        document.getElementById(e).innerHTML = JSONfile[e][btLang.value.toLowerCase()];
    }
}

document.addEventListener("DOMContentLoaded", async() => {
    window.enableTemplate("settings");
    window.JSONfile = await fetch("../source/data/lang.json")
        .then((promise) => promise.json())
        .catch((error) => console.log(error));
});