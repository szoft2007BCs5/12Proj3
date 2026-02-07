export function synchronizeVolumeOnChange() {
    const volumeSlider = document.getElementById("volume-slider");
    const volumeSliderText = document.getElementById("volume-slider-text");
    volumeSlider.value = localStorage.getItem("volume");
    volumeSliderText.value = localStorage.getItem("volume");

    volumeSlider.addEventListener("input", () => {
        volumeSliderText.value = volumeSlider.value;
        localStorage.setItem("volume", volumeSlider.value);
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
    });
}