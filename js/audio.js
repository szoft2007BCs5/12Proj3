export class AudioManager {
    constructor() {
        // Egyel kijjebb hozva az útvonal:
        this.basePath = "../source/audio/";
        this.types = ["master", "music", "other", "game"];
        
        this.currentMusicFile = localStorage.getItem("selectedMusic") || "chill-drum-bgmusic.mp3";
        this.volumes = {
            master: 1.0,
            music: 0.5,
            other: 0.5,
            game: 0.5
        };
        this.activeSounds = [];
    }

    playAudio(fileName, type, loop = false, id = null) {
        const src = this.basePath + fileName;
        const audio = new Audio(src);
        audio.myType = type;
        audio.myId = id || Math.random().toString(36).substr(2, 9); 
        audio.loop = loop;
        audio.volume = this.getFinalVolume(type);

        audio.play().catch(err => console.warn("Nem sikerült lejátszani:", src, err));
        this.activeSounds.push(audio);

        if (!loop) {
            audio.onended = () => {
                const index = this.activeSounds.indexOf(audio);
                if (index > -1) {
                    this.activeSounds.splice(index, 1);
                }
            };
        }
        return audio;
    }

    stopAudio(target) {
        for (let i = this.activeSounds.length - 1; i >= 0; i--) {
            const sound = this.activeSounds[i];

            if (target === "all" || target === sound.myType || target === sound.myId) {
                sound.pause();
                sound.currentTime = 0;
                this.activeSounds.splice(i, 1);
            }
        }
    }

    setVolume(type, value) {
        if (this.volumes[type] !== undefined) {
            this.volumes[type] = value;
        }

        this.activeSounds.forEach(sound => {
            if (type === "master" || sound.myType === type) {
                sound.volume = this.getFinalVolume(sound.myType);
            }
        });

        localStorage.setItem("volumes", JSON.stringify(this.volumes));
    }

    getFinalVolume(type) {
        return this.volumes["master"] * this.volumes[type];
    }

    setupAudioSystem() {
        const savedVolumes = localStorage.getItem("volumes");
        if (savedVolumes) {
            this.volumes = JSON.parse(savedVolumes);
        } else {
            localStorage.setItem("volumes", JSON.stringify(this.volumes));
        }

        const buttons = document.querySelectorAll(".button");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                this.playAudio("button-click4.mp3", "other", false, "click");
                this.setVolume("click", this.volumes["other"]);
            });
        });

        const musicSelector = document.getElementById("music-selector");
        if (musicSelector) {
            musicSelector.value = this.currentMusicFile;

            musicSelector.addEventListener("change", (e) => {
                const newMusic = e.target.value;
                
                this.stopAudio("bg_music");
                this.currentMusicFile = newMusic;
                localStorage.setItem("selectedMusic", newMusic);

                if (newMusic !== "none") {
                    this.playAudio(newMusic, "music", true, "bg_music");
                }
            });
        }

        document.addEventListener("click", () => {
            const isMusicPlaying = this.activeSounds.some(active => active.myId === "bg_music");
            
            if (!isMusicPlaying && this.currentMusicFile !== "none") {
                this.playAudio(this.currentMusicFile, "music", true, "bg_music");
            }
        }, { once: true });

        this.types.forEach(type => {
            const slider = document.getElementById(type + "-volume-slider");
            const sliderText = document.getElementById(type + "-volume-slider-text");

            if(slider && sliderText) {
                slider.value = this.volumes[type] * 100;
                sliderText.value = slider.value;

                slider.addEventListener("input", () => {
                    this.setVolume(type, slider.value / 100);
                    sliderText.value = slider.value;
                });

                sliderText.addEventListener("input", () => {
                    this.setVolume(type, sliderText.value / 100);
                    slider.value = sliderText.value;
                });
            }
        });
    }
}

export const audioManager = new AudioManager();