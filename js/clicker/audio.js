// --- BEÁLLÍTÁSOK ---
const BASE_PATH = "../../source/audio/";

const types = ["master", "music", "other", "game"];

// Hangerők
let volumes = {
    master: 1.0,
    music: 0.5,
    other: 0.5,
    game: 0.5
};


// Ebben a listában tároljuk az összes éppen futó hangot
let activeSounds = [];

// --- FŐ FÜGGVÉNYEK ---

// 1. Hang lejátszása
export function playAudio(fileName, type, loop = false, id = null) {
    const src = BASE_PATH + fileName;
    const audio = new Audio(src);
    audio.myType = type;
    audio.myId = id || Math.random().toString(36).substr(2, 9); // ID beállítása (ha adtál meg nevet, pl: "intro_zene", amivel később leállíthatod)
    audio.loop = loop;
    audio.volume = getFinalVolume(type);

    audio.play().catch(err => console.warn("Nem sikerült lejátszani:", src, err));
    activeSounds.push(audio);

    // TÖRLÉS: Ha vége a hangnak és NEM loopolós, kivesszük a listából
    if (!loop) {
        audio.onended = () => {
            // Megkeressük hol van a listában és kivesszük
            const index = activeSounds.indexOf(audio);
            if (index > -1) {
                activeSounds.splice(index, 1);
            }
        };
    }

    return audio;
}

// 2. Hang leállítása
// Használat:
// stopAudio("music") -> Leállít minden zenét
// stopAudio("intro_zene") -> Leállítja azt a konkrét hangot, aminek ez az ID-ja
// stopAudio("all") -> Leállít MINDENT
export function stopAudio(target) {
    // Végigmegyünk a listán visszafelé
    for (let i = activeSounds.length - 1; i >= 0; i--) {
        const sound = activeSounds[i];

        if (target === "all" || target === sound.myType || target === sound.myId) {
            sound.pause();
            sound.currentTime = 0;
            activeSounds.splice(i, 1);
        }
    }
}

// 3. Hangerő beállítása
export function setVolume(type, value) {
    if (volumes[type] !== undefined) {
        volumes[type] = value;
    }

    // Frissítjük az éppen szóló hangokat
    activeSounds.forEach(sound => {
        // Ha mastert állítunk, mindenre hat
        // Ha típust állítunk, csak arra a típusra hat
        if (type === "master" || sound.myType === type) {
            sound.volume = getFinalVolume(sound.myType);
        }
    });

    localStorage.setItem("volumes", JSON.stringify(volumes));
}


// --- SEGÉDFÜGGVÉNYEK ---

function getFinalVolume(type) {
    // A végső hangerő = Master * Típus hangereje
    return volumes["master"] * volumes[type];
}


// --- SETUP (Ezt hívd meg a játék elején) ---

export function setupAudioSystem() {
    // 1. Betöltjük a mentett hangerőket

    volumes = localStorage.getItem("volumes") ? JSON.parse(localStorage.getItem("volumes")) : localStorage.setItem("volumes", JSON.stringify(volumes));

    // 2. Globális kattintás figyelő (other)
    document.addEventListener("click", () => {
        playAudio("button-click4.mp3", "other", false, "click");
        setVolume("click", volumes["other"]);
    });

    // 3. Háttérzene indítása
    document.addEventListener("click", () => {
        playAudio("chill-drum-bgmusic.mp3", "music", true, "bg_music");
        setVolume("click", volumes["music"]);
    }, { once: true });

    // 4. Csúszkák beállítása
    types.forEach(type => {
        const slider = document.getElementById(type + "-volume-slider");
        const sliderText = document.getElementById(type + "-volume-slider-text");

        slider.value = volumes[type] * 100;
        sliderText.value = slider.value;

        slider.addEventListener("input", () => {
            setVolume(type, slider.value / 100);
            sliderText.value = slider.value;
        });

        sliderText.addEventListener("input", () => {
            setVolume(type, sliderText.value / 100);
            slider.value = sliderText.value;
        });
    });
}