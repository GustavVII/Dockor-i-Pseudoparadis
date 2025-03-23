// Volymnivåer
let sfxVolume = parseFloat(localStorage.getItem('sfxVolume')) || 0.2; 
let musicVolume = parseFloat(localStorage.getItem('musicVolume')) || 1.0;

// Nuvarande musik
let musicAudio = null;

// Tystad?
let isMusicMuted = localStorage.getItem('isMusicMuted') === 'true';

// Funktion att spara till lokalminne
function saveSettings() {
    localStorage.setItem('sfxVolume', sfxVolume);
    localStorage.setItem('musicVolume', musicVolume);
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
            console.log(musicVolume);
        }
        saveSettings();
    });
    menuContainer.appendChild(musicSlider);

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
// Funktion att spela musik
function playMusic(track) {
    if (musicAudio) {
        musicAudio.pause();
        musicAudio = null; // Unload the previous music
    }

    // Check if the music file exists
    fetch(track)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Music file not found: ${track}`);
            }
            return response;
        })
        .then(() => {
            // Ladda musik
            musicAudio = new Audio(track);
            musicAudio.volume = musicVolume;
            musicAudio.muted = isMusicMuted;
            musicAudio.loop = true;

            console.log(`Now playing: ${track}`); // Log the currently playing music file

            // Play the music directly
            musicAudio.play().catch((error) => {
                console.error('Error playing music:', error);
            });
        })
        .catch(error => {
            console.error(error.message);
        });
}


function getSfxVolume() {
    return sfxVolume;
}

function getMusicVolume() {
    return musicVolume;
}

// Expose functions to the global scope
window.playMusic = playMusic;
window.getSfxVolume = getSfxVolume;
window.getMusicVolume = getMusicVolume;