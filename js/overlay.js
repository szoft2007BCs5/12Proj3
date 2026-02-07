export function enableTemplate(selected){
    const templateSelected = document.getElementById(`overlay-${selected}`);
    const screen = document.getElementById("screen");
    screen.innerHTML = templateSelected.innerHTML;
}

window.enableTemplate = enableTemplate;
