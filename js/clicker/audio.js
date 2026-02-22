// =========================================================================
// ALAPBEÁLLÍTÁSOK ÉS VÁLTOZÓK
// =========================================================================
const BASE_PATH = "../../source/audio/";
const types = ["master", "music", "other", "game"];

let currentMusicFile = localStorage.getItem("selectedMusic") || "chill-drum-bgmusic.mp3";

let volumes = {
    master: 1.0,
    music: 0.5,
    other: 0.5,
    game: 0.5
};

let activeSounds = [];

// =========================================================================
// FŐ AUDIO FUNKCIÓK (LEJÁTSZÁS, LEÁLLÍTÁS, HANGERŐ)
// =========================================================================

export function playAudio(fileName, type, loop = false, id = null) {
    const src = BASE_PATH + fileName;
    const audio = new Audio(src);
    audio.myType = type;
    audio.myId = id || Math.random().toString(36).substr(2, 9); 
    audio.loop = loop;
    audio.volume = getFinalVolume(type);

    audio.play().catch(err => console.warn("Nem sikerült lejátszani:", src, err));
    activeSounds.push(audio);

    if (!loop) {
        audio.onended = () => {
            const index = activeSounds.indexOf(audio);
            if (index > -1) {
                activeSounds.splice(index, 1);
            }
        };
    }
    return audio;
}

export function stopAudio(target) {
    for (let i = activeSounds.length - 1; i >= 0; i--) {
        const sound = activeSounds[i];

        if (target === "all" || target === sound.myType || target === sound.myId) {
            sound.pause();
            sound.currentTime = 0;
            activeSounds.splice(i, 1);
        }
    }
}

export function setVolume(type, value) {
    if (volumes[type] !== undefined) {
        volumes[type] = value;
    }

    activeSounds.forEach(sound => {
        if (type === "master" || sound.myType === type) {
            sound.volume = getFinalVolume(sound.myType);
        }
    });

    localStorage.setItem("volumes", JSON.stringify(volumes));
}

function getFinalVolume(type) {
    return volumes["master"] * volumes[type];
}

// =========================================================================
// INICIALIZÁLÁS (SETUP)
// =========================================================================

export function setupAudioSystem() {
    const savedVolumes = localStorage.getItem("volumes");
    if (savedVolumes) {
        volumes = JSON.parse(savedVolumes);
    } else {
        localStorage.setItem("volumes", JSON.stringify(volumes));
    }

    const buttons = document.querySelectorAll(".button");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            playAudio("button-click4.mp3", "other", false, "click");
            setVolume("click", volumes["other"]);
        });
    });

    const musicSelector = document.getElementById("music-selector");
    
    if (musicSelector) {
        musicSelector.value = currentMusicFile;

        musicSelector.addEventListener("change", (e) => {
            const newMusic = e.target.value;
            
            stopAudio("bg_music");
            currentMusicFile = newMusic;
            localStorage.setItem("selectedMusic", newMusic);

            if (newMusic !== "none") {
                playAudio(newMusic, "music", true, "bg_music");
            }
        });
    }

    document.addEventListener("click", () => {
        const isMusicPlaying = activeSounds.some(active => active.myId === "bg_music");
        
        if (!isMusicPlaying && currentMusicFile !== "none") {
            playAudio(currentMusicFile, "music", true, "bg_music");
        }
    }, { once: true });

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