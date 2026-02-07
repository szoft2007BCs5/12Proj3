import * as Audio from "./audio.js";

export function synchronizeVolumeOnChange() {
    const volumeSlider = document.getElementById("volume-slider");
    const volumeSliderText = document.getElementById("volume-slider-text");
    volumeSlider.value = localStorage.getItem("volume");
    volumeSliderText.value = localStorage.getItem("volume");

    volumeSlider.addEventListener("input", () => {
        volumeSliderText.value = volumeSlider.value;
        localStorage.setItem("volume", volumeSlider.value);
        console.log("Hangerő beállítva: " + volumeSliderText.value);
        Audio.setVolume(localStorage.getItem("volume"));
    });

    volumeSliderText.addEventListener("input", () => {
        if (volumeSliderText.value > 100) {
            volumeSliderText.value = 100;
            volumeSlider.value = 100;
        }
        else if (volumeSliderText.value < 0) {
            volumeSliderText.value = 0;
            volumeSlider.value = 0;
        }
        else volumeSlider.value = volumeSliderText.value;
        localStorage.setItem("volume", volumeSliderText.value);
        console.log("Hangerő beállítva: " + volumeSliderText.value);
        Audio.setVolume(localStorage.getItem("volume"));
    });
}


/*
export function synchronizeVolumeOnChange() {
    const volumeSlider = document.getElementById("volume-slider");
    const volumeSliderText = document.getElementById("volume-slider-text");

    // Segédfüggvény a változtatások érvényesítésére
    const applyVolume = (value) => {
        const volumeLevel = value / 100;
        localStorage.setItem("volume", value);

        // Ha éppen fut a zene, azonnal átállítjuk a hangerejét
        if (currentBgMusic) {
            currentBgMusic.volume = volumeLevel;
        }
    };

    volumeSlider.addEventListener("input", () => {
        volumeSliderText.value = volumeSlider.value;
        applyVolume(volumeSlider.value);
    });

    volumeSliderText.addEventListener("input", () => {
        let value = parseInt(volumeSliderText.value) || 0;
        if (value > 100) value = 100;
        if (value < 0) value = 0;

        volumeSliderText.value = value;
        volumeSlider.value = value;
        applyVolume(value);
    });
}
*/