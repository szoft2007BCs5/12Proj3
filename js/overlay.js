export function enableTemplate(selected){
    const templateSelected = document.getElementById(`overlay-${selected}`);
    const screen = document.getElementById("screen");
    screen.innerHTML = templateSelected.innerHTML;
}


export function changeLanguage(btLang) {
    for (const e in JSONfile) {
        document.getElementById(e).innerHTML = JSONfile[e][btLang.value.toLowerCase()];
    }

    console.log("Current language set to:", btLang)
    window.currentLanguage = btLang.value
}

window.enableTemplate = enableTemplate;
window.changeLanguage = changeLanguage;
