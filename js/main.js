function ChangeLanguage(btLang) {
    for (const e in JSONfile) {
        document.getElementById(e).innerHTML = JSONfile[e][btLang.value.toLowerCase()];
    }
}

function toggleScreen(screen, bt) {
    const overlay = document.querySelector(`#overlay-${screen}`);
    if (overlay.style.display === "none") {
        bt.closest(".overlay").style.display = "none";
        overlay.style.display = "flex";
    } else {
        overlay.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    window.JSONfile = await fetch("../source/data/data.json")
        .then((promise) => promise.json())
        .catch((error) => console.log(error));
});