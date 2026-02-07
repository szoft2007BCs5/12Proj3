import { enableTemplate, changeLanguage } from "./overlay.js";


document.addEventListener("DOMContentLoaded", async () => {
    enableTemplate("settings");
    window.JSONfile = await fetch("../source/data/lang.json")
        .then((promise) => promise.json())
        .catch((error) => console.log(error));
});