// audio.js

// --- BEÁLLÍTÁSOK ---
const BASE_PATH = "../../source/audio/";

// Hangerők (alapból 1 = 100%, 0.5 = 50%)
// Ezt később a localStorage-ból is betöltheted, ha akarod
let volumes = {
    master: 1.0,
    music: 0.5,
    sfx: 1.0,
    game: 1.0
};

// Ebben a listában tároljuk az összes éppen futó hangot
let activeSounds = []; 

// --- FŐ FÜGGVÉNYEK ---

// 1. Hang lejátszása
export function playAudio(fileName, type, loop = false, id = null) {
    // Útvonal összerakása
    const src = BASE_PATH + fileName;
    
    // Audio létrehozása
    const audio = new Audio(src);
    
    // Típus beállítása (hogy tudjuk, mi ez: music, sfx vagy game)
    audio.myType = type; 
    
    // ID beállítása (ha adtál meg nevet, pl: "intro_zene", amivel később leállíthatod)
    // Ha nem adtál, generálunk egy véletlen számot, hogy megkülönböztessük
    audio.myId = id || Math.random().toString(36).substr(2, 9);

    // Loop beállítás
    audio.loop = loop;

    // Hangerő kiszámolása (Master * Típus)
    audio.volume = getFinalVolume(type);

    // Lejátszás (hiba elkapással, ha a böngésző nem engedi)
    audio.play().catch(err => console.warn("Nem sikerült lejátszani:", src, err));

    // Hozzáadjuk a listához, hogy tudjuk kezelni
    activeSounds.push(audio);

    // TAKARÍTÁS: Ha vége a hangnak és NEM loopolós, kivesszük a listából
    if (!loop) {
        audio.onended = () => {
            // Megkeressük hol van a listában és kivesszük
            const index = activeSounds.indexOf(audio);
            if (index > -1) {
                activeSounds.splice(index, 1);
            }
        };
    }

    return audio; // Visszaadjuk, ha esetleg közvetlenül kellene
}

// 2. Hang leállítása (Sokoldalú függvény!)
// Használat:
// stopAudio("music") -> Leállít minden zenét
// stopAudio("intro_zene") -> Leállítja azt a konkrét hangot, aminek ez az ID-ja
// stopAudio("all") -> Leállít MINDENT (csend)
export function stopAudio(target) {
    // Végigmegyünk a listán visszafelé (hogy törlésnél ne csússzon el a lista)
    for (let i = activeSounds.length - 1; i >= 0; i--) {
        const sound = activeSounds[i];

        let shouldStop = false;

        if (target === "all") {
            shouldStop = true; // Minden megáll
        } 
        else if (sound.myType === target) {
            shouldStop = true; // Pl. minden "music" megáll
        } 
        else if (sound.myId === target) {
            shouldStop = true; // Konkrét ID megáll
        }

        if (shouldStop) {
            sound.pause();
            sound.currentTime = 0;
            activeSounds.splice(i, 1); // Kivesszük a listából
        }
    }
}

// 3. Hangerő beállítása
export function setVolume(type, value) {
    // Érték mentése (value: 0-tól 1-ig legyen, pl 0.5)
    if (volumes[type] !== undefined) {
        volumes[type] = value;
    }

    // Frissítjük az éppen szóló hangokat is azonnal
    activeSounds.forEach(sound => {
        // Ha mastert állítunk, mindenkire hat
        // Ha típust állítunk, csak arra a típusra hat
        if (type === "master" || sound.myType === type) {
            sound.volume = getFinalVolume(sound.myType);
        }
    });
    
    // Itt elmentheted localStorage-ba is, ha akarod
    localStorage.setItem(type + "Volume", value);
}

// --- SEGÉDFÜGGVÉNYEK ---

function getFinalVolume(type) {
    // A végső hangerő = Master * Típus hangereje
    return volumes.master * volumes[type];
}

// --- SETUP (Ezt hívd meg a játék elején) ---

export function setupAudioSystem() {
    // 1. Betöltjük a mentett hangerőket (opcionális, de hasznos)
    ["master", "music", "sfx", "game"].forEach(t => {
        const saved = localStorage.getItem(t + "Volume");
        if (saved) volumes[t] = parseFloat(saved);
    });

    // 2. Globális kattintás figyelő (SFX)
    document.addEventListener("click", () => {
        // Ez minden kattintásra lejátszik egy hangot
        // playAudio(fájlnév, típus, loop, id)
        playAudio("button-click4.mp3", "sfx", false);
    });

    // 3. Háttérzene indítása (csak az ELSŐ kattintáskor)
    // A böngészők nem engedik a zenét, amíg a user nem interakciózik az oldallal
    document.addEventListener("click", () => {
        // Megnézzük, megy-e már zene. Ha nem, indítjuk.
        const musicIsPlaying = activeSounds.some(s => s.myType === "music");
        
        if (!musicIsPlaying) {
            // ID-t adunk neki ("bg_music"), hogy később név szerint le tudjuk lőni ha kell
            playAudio("chill-drum-loop.mp3", "music", true, "bg_music");
        }
    }, { once: true }); // A { once: true } miatt ez csak egyszer fut le
}