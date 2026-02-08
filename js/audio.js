// audio.js
// Tároló az aktív Audio objektumoknak
const activeSounds = {};
const soundsExist = ["music", "game", "master"];

function getEffectiveType(type) {
    if (soundsExist.includes(type)) {
        return type;
    }
    return "other"; // Minden más (pl. nature, click, stb.) ide tartozik
}

export function playAudio(src, type, loop) {
    const effectiveType = getEffectiveType(type);

    // Alapértelmezett értékek beállítása
    if (!localStorage.getItem(`${effectiveType}Volume`)) {
        localStorage.setItem(`${effectiveType}Volume`, "50");
    }
    if (!localStorage.getItem(`masterVolume`)) {
        localStorage.setItem(`masterVolume`, "100");
    }

    // Ha ez a konkrét hang már szól, nem indítjuk újra, visszaadjuk az objektumot
    if (activeSounds[type]) {
      stopAudio(type);
    }

    const audio = new Audio(src);
    audio.volume = calculateFinalVolume(effectiveType);
    audio.loop = loop;

    if (!loop) {
        audio.addEventListener("ended", () => {
            delete activeSounds[type];
        });
    }

    audio.play().catch((e) => console.error(`${type} audio hiba:`, e));

    // Eltároljuk
    activeSounds[type] = audio;

    // Beállítjuk a csúszkákat (ha épp láthatóak)
    setupVolumeControls(effectiveType);
    setupVolumeControls("master");
    
    return audio;
}

export function stopAudio(type) {
    if (activeSounds[type]) {
        activeSounds[type].pause();
        activeSounds[type].currentTime = 0;
        delete activeSounds[type];
    }
}

// Segédfüggvény a tényleges hangerő kiszámításához
function calculateFinalVolume(type) {
    const typeVol = parseInt(localStorage.getItem(`${type}Volume`) || "50", 10);
    const masterVol = parseInt(localStorage.getItem(`masterVolume`) || "100", 10);

    if (type === "master") return masterVol / 100;
    return (typeVol / 100) * (masterVol / 100);
}

export function setupVolumeControls(type) {
    const slider = document.getElementById(`${type}-volume-slider`);
    const sliderText = document.getElementById(`${type}-volume-slider-text`);

    if (!slider || !sliderText) return;

    const savedValue = localStorage.getItem(`${type}Volume`) || 50;
    slider.value = savedValue;
    sliderText.value = savedValue;

    const handleChange = (val) => {
        let numVal = parseInt(val, 10);
        if (isNaN(numVal)) numVal = 0;
        if (numVal > 100) numVal = 100;
        if (numVal < 0) numVal = 0;

        slider.value = numVal;
        sliderText.value = numVal;
        updateVolume(type, numVal);
    };

    slider.oninput = () => handleChange(slider.value);
    sliderText.oninput = () => handleChange(sliderText.value);
}

function updateVolume(type, value) {
    localStorage.setItem(`${type}Volume`, value);

    // Végig megyünk az összes aktív hangon és frissítjük a hangerejüket
    for (let key in activeSounds) {
        const soundType = getEffectiveType(key);
        if (type === "master" || soundType === type) {
            activeSounds[key].volume = calculateFinalVolume(soundType);
        }
    }
}

export function setupButtonClickSounds(src) {
    // Globális kattintás figyelő a gombokra, jobb teljesítmény mint egyesével
    document.addEventListener("click", (e) => {
            playAudio(src, "click", false);
        
    });
}