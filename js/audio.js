let backgroundMusic = null; 

export function playAudio(src, volume) {
    // Ha már fut egy zene, ne indítsunk rá újat (opcionális)
    if (backgroundMusic) return backgroundMusic;

    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = true;
    audio.play().catch(e => console.error("Lejátszási hiba:", e));
    
    backgroundMusic = audio; 
    return audio;
}

//  Ezt hívjuk meg a hangerő csúszka mozgatásakor
export function setVolume(value) {
    if (backgroundMusic) {
        backgroundMusic.volume = value / 100;
    }
}

