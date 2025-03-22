// Volymnivåer
let sfxVolume = parseFloat(localStorage.getItem('sfxVolume')) || 0.2; 
let musicVolume = parseFloat(localStorage.getItem('musicVolume')) || 1.0;

// Musik version (wav eller midi)
let currentMusicVersion = localStorage.getItem('currentMusicVersion') || 'wav';

// Nuvarande musik
let musicAudio = null;

// Tystad?
let isMusicMuted = localStorage.getItem('isMusicMuted') === 'true';

// Funktion att spara till lokalminne
function saveSettings() {
    localStorage.setItem('sfxVolume', sfxVolume);
    localStorage.setItem('musicVolume', musicVolume);
    localStorage.setItem('currentMusicVersion', currentMusicVersion);
    localStorage.setItem('isMusicMuted', isMusicMuted);
}

// Funktion för inställningsknappen
function createOptionsMenu() {
    // Skapa knappen
    const gearButton = document.createElement('img');
    gearButton.src = 'assets/graphics/menu/Gear.png';
    gearButton.style.position = 'absolute';
    gearButton.style.top = '10px';
    gearButton.style.right = '10px';
    gearButton.style.width = '40px';
    gearButton.style.height = '40px';
    gearButton.style.cursor = 'pointer';
    gearButton.style.zIndex = '1000';
    document.body.appendChild(gearButton);

    const menuContainer = document.createElement('div');
    menuContainer.style.position = 'absolute';
    menuContainer.style.top = '60px';
    menuContainer.style.right = '10px';
    menuContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    menuContainer.style.padding = '10px';
    menuContainer.style.borderRadius = '5px';
    menuContainer.style.color = 'white';
    menuContainer.style.display = 'none';
    menuContainer.style.zIndex = '1000';
    document.body.appendChild(menuContainer);

    // Ljudeffektsvolymkontroll
    const sfxLabel = document.createElement('label');
    sfxLabel.innerText = 'SFX Volume:';
    sfxLabel.style.display = 'block';
    menuContainer.appendChild(sfxLabel);

    const sfxSlider = document.createElement('input');
    sfxSlider.type = 'range';
    sfxSlider.min = '0';
    sfxSlider.max = '1';
    sfxSlider.step = '0.05';
    sfxSlider.value = sfxVolume;
    sfxSlider.style.width = '100%';
    sfxSlider.addEventListener('input', () => {
        sfxVolume = parseFloat(sfxSlider.value);
        saveSettings();
    });
    menuContainer.appendChild(sfxSlider);

    // Musikvolymkontroll
    const musicLabel = document.createElement('label');
    musicLabel.innerText = 'Music Volume:';
    musicLabel.style.display = 'block';
    musicLabel.style.marginTop = '10px';
    menuContainer.appendChild(musicLabel);

    const musicSlider = document.createElement('input');
    musicSlider.type = 'range';
    musicSlider.min = '0';
    musicSlider.max = '1';
    musicSlider.step = '0.1';
    musicSlider.value = musicVolume;
    musicSlider.style.width = '100%';
    musicSlider.addEventListener('input', () => {
        musicVolume = parseFloat(musicSlider.value);
        if (musicAudio) {
            musicAudio.volume = musicVolume;
            console.log(musicVolume)
        }
        saveSettings();
    });
    menuContainer.appendChild(musicSlider);

    // Musikversionsbytesknapp
    const musicVersionLabel = document.createElement('label');
    musicVersionLabel.innerText = 'Music Version:';
    musicVersionLabel.style.display = 'block';
    musicVersionLabel.style.marginTop = '10px';
    menuContainer.appendChild(musicVersionLabel);

    const musicVersionToggle = document.createElement('button');
    musicVersionToggle.innerText = `Switch to ${currentMusicVersion === 'wav' ? 'midi' : 'wav'}`;
    musicVersionToggle.style.width = '100%';
    musicVersionToggle.style.marginTop = '5px';
    musicVersionToggle.addEventListener('click', () => {
        currentMusicVersion = currentMusicVersion === 'wav' ? 'midi' : 'wav'; // Byte mellan 'wav' och 'midi'
        musicVersionToggle.innerText = `Switch to ${currentMusicVersion === 'wav' ? 'midi' : 'wav'}`;
        saveSettings();
        playMusic();
    });
    menuContainer.appendChild(musicVersionToggle);

    // Tystningsknapp
    const muteButton = document.createElement('button');
    muteButton.innerText = isMusicMuted ? 'Unmute Music' : 'Mute Music';
    muteButton.style.width = '100%';
    muteButton.style.marginTop = '5px';
    muteButton.addEventListener('click', () => {
        isMusicMuted = !isMusicMuted;
        if (musicAudio) {
            musicAudio.muted = isMusicMuted;
        }
        muteButton.innerText = isMusicMuted ? 'Unmute Music' : 'Mute Music';
        saveSettings();
    });
    menuContainer.appendChild(muteButton);

    // Få inställningsknappen att göra saker
    gearButton.addEventListener('click', () => {
        menuContainer.style.display = menuContainer.style.display === 'none' ? 'block' : 'none';
    });
}

// Funktion att spela musik
function playMusic() {
    if (musicAudio) {
        musicAudio.pause();
    }

    // ladda musikversion
    musicAudio = new Audio(`assets/music/${currentMusicVersion}/music.wav`);
    musicAudio.volume = musicVolume;
    musicAudio.muted = isMusicMuted;
    musicAudio.loop = true;

    // Spela endast om användare interagerat med sidan
    const playMusicAfterInteraction = () => {
        musicAudio.play().catch((error) => {
            console.error('Error playing music:', error);
        });
        document.removeEventListener('keydown', playMusicAfterInteraction);
    };

    document.addEventListener('keydown', playMusicAfterInteraction);
}

function getSfxVolume() {
    return sfxVolume;
}

function getMusicVolume() {
    return musicVolume;
}