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

  // Ha az adott típusú zene már szól, nem indítjuk újra
  // Alapértelmezett értékek beállítása, ha még nincsenek
  if (!localStorage.getItem(`${effectiveType}Volume`)) {
    localStorage.setItem(`${effectiveType}Volume`, "50");
  }
  if (!localStorage.getItem(`masterVolume`)) {
    localStorage.setItem(`masterVolume`, "100");
  }

  // Ha ez a konkrét hang már szól, nem indítjuk újra
  if (activeSounds[type]) return activeSounds[type];

  const audio = new Audio(src);

  // Hangerő kiszámítása az effectiveType alapján
  audio.volume = calculateFinalVolume(effectiveType);
  audio.loop = loop;

  if (!loop) {
    audio.addEventListener("ended", () => {
      console.log(`"${type}" lejátszása befejeződött, törlés a tárolóból.`);
      delete activeSounds[type];
    });
  }

  audio.play().catch((e) => console.error(`${type} hiba:`, e));

  // Eltároljuk a típusa szerint
  activeSounds[type] = audio;
  console.log(`"${type}" típusú zene elindítva, hangerő: ${audio.volume}`);

  // Beállítjuk a csúszkákat
  setupVolumeControls(effectiveType);
  setupVolumeControls("master");
  return audio;
}

// Segédfüggvény a tényleges hangerő kiszámításához
function calculateFinalVolume(type) {
  const typeVol = localStorage.getItem(`${type}Volume`) || 50;
  const masterVol = localStorage.getItem(`masterVolume`) || 100;

  if (type === "master") return masterVol / 100;

  return (typeVol / 100) * (masterVol / 100);
}

export function setupVolumeControls(type) {
  const slider = document.getElementById(`${type}-volume-slider`);
  const sliderText = document.getElementById(`${type}-volume-slider-text`);

  if (!slider || !sliderText) {
    return;
  }

  const savedValue = localStorage.getItem(`${type}Volume`) || 50;
  slider.value = savedValue;
  sliderText.value = savedValue;

  const handleChange = (val) => {
    if (val > 100) val = 100;
    if (val < 0) val = 0;

    slider.value = val;
    sliderText.value = val;
    updateVolume(type, val);
  };

  slider.oninput = () => handleChange(slider.value);
  sliderText.oninput = () => handleChange(sliderText.value);
}

function updateVolume(type, value) {
  localStorage.setItem(`${type}Volume`, value);

  // Végig megyünk az összes szóló hangon
  for (let key in activeSounds) {
    const soundType = getEffectiveType(key);

    // Ha a mastert állítjuk, minden hangot frissíteni kell
    // Ha a típust állítjuk (pl. other), akkor csak azokat, amik oda tartoznak
    if (type === "master" || soundType === type) {
      activeSounds[key].volume = calculateFinalVolume(soundType);
    }
  }
}

export function stopAudio(type) {
  // Leállítjuk a zenét és eltávolítjuk a tárolóból
  if (activeSounds[type]) {
    activeSounds[type].pause();
    activeSounds[type].currentTime = 0;
    delete activeSounds[type];
  }
}

export function setupButtonClickSounds(src) {
  const buttons = document.querySelectorAll(".button");
  document.addEventListener("click", () => {
    playAudio(src, "click", false);
  });
  /*
    buttons.forEach(button => {
        button.addEventListener('onclick', () => {
            playAudio(src, 'click', true);
        });
    });
    */
}

// MAGYARÁZAT:

/*
// Elindítod a zenéket különböző típusokkal
    playAudio('/source/audio/nature.mp3', 'nature');
    playAudio('/source/audio/music.mp3', 'music');
    playAudio('/source/audio/game.mp3', 'game');
*/
