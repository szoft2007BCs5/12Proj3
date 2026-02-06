function ChangeLanguage(btLang){
    for (const e in JSONfile) {
        document.getElementById(e).innerHTML = JSONfile[e][btLang.value.toLowerCase()];
    }
}

document.addEventListener("DOMContentLoaded", async() => {
    window.JSONfile = await fetch("../source/data/data.json")
        .then((promise) => promise.json())
        .catch((error) => console.log(error));
});