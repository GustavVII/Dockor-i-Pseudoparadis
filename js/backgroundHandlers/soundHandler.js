const soundEffects = {
    shot: null,
    hit: null,
    spellcard: null,
    powershot: null,
    laser: null,
};

// Function to load a sound effect
async function loadSoundEffect(src) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(src);
        audio.oncanplaythrough = () => resolve(audio);
        audio.onerror = (error) => {
            console.error(`Failed to load sound effect: ${src}`, error);
            reject(error);
        };
    });
}

// Function to play a sound effect
function playSoundEffect(sound) {
    if (!sound) return;
    
    try {
        // Resume audio context if suspended
        if (getAudioContext().state === 'suspended') {
            getAudioContext().resume();
        }
        
        sound.currentTime = 0;
        sound.volume = getSfxVolume();
        sound.play().catch(e => console.error('Sound play failed:', e));
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}

// Load all sound effects
async function initializeSoundEffects() {
    try {
        getAudioContext();

        soundEffects.shot = await loadSoundEffect('assets/sfx/shot.wav');
        soundEffects.hit = await loadSoundEffect('assets/sfx/hit.wav');
        soundEffects.spellcard = await loadSoundEffect('assets/sfx/spellcard.wav');
        soundEffects.powershot = await loadSoundEffect('assets/sfx/powershot.wav');
        soundEffects.laser = await loadSoundEffect('assets/sfx/laser.wav');
        soundEffects.select = await loadSoundEffect('assets/sfx/select.wav');
        soundEffects.ok = await loadSoundEffect('assets/sfx/ok.wav');
        soundEffects.cancel = await loadSoundEffect('assets/sfx/cancel.wav');
        soundEffects.timeout = await loadSoundEffect(`assets/sfx/timeout.wav`)
        console.log('All sound effects loaded successfully:', soundEffects);
    } catch (error) {
        console.error('Failed to load sound effects:', error);
    }
}

function playMusic(track) {
    // Stop any existing music
    stopGameMusic();
    
    try {
        musicAudio = new Audio(track);
        musicAudio.volume = musicVolume;
        musicAudio.loop = true;
        
        const playPromise = musicAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => console.error('Play error:', error));
        }
        return musicAudio;
    } catch (error) {
        console.error('Music initialization error:', error);
        return null;
    }
}

// Stop the game music
function stopGameMusic() {
    if (musicAudio) {
        musicAudio.pause();
        musicAudio.currentTime = 0;
    }
    // Don't set musicAudio to null here - we want to keep the reference
}


function getSfxVolume() {
    return sfxVolume;
}

function getMusicVolume() {
    return musicVolume;
}

function saveAudioSettings() {
    localStorage.setItem('sfxVolume', sfxVolume);
    localStorage.setItem('musicVolume', musicVolume);
}

// Update playMusic function (from old optionsMenu.js)
function playMusic(track) {
    if (musicAudio) {
        musicAudio.pause();
        musicAudio = null;
    }

    try {
        musicAudio = new Audio(track);
        musicAudio.volume = musicVolume;
        musicAudio.loop = true;
        
        const playPromise = musicAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => console.error('Play error:', error));
        }
    } catch (error) {
        console.error('Music initialization error:', error);
    }
}

function getAudioContext() {
    if (!window.audioContext) {
        window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return window.audioContext;
}

// Save all settings to localStorage
function saveSettings() {
    localStorage.setItem('musicVolume', musicVolume * 100);
    localStorage.setItem('sfxVolume', sfxVolume * 100);
    localStorage.setItem('playerLives', optionsMenu?.options[0]?.value || localStorage.playerLives);
    localStorage.setItem('bombs', optionsMenu?.options[1]?.value || localStorage.bombs);
    console.log('Settings saved');

    const feedback = document.createElement('div');
    feedback.textContent = 'Settings Saved';
    feedback.style.position = 'fixed';
    feedback.style.bottom = '20px';
    feedback.style.right = '20px';
    feedback.style.backgroundColor = 'rgba(0,0,0,0.7)';
    feedback.style.color = 'white';
    feedback.style.padding = '10px';
    feedback.style.borderRadius = '5px';
    feedback.style.zIndex = '1000';
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        document.body.removeChild(feedback);
    }, 2000);
}

// Load settings from localStorage
function loadSettings() {
    const music = parseInt(localStorage.getItem('musicVolume'));
    const sound = parseInt(localStorage.getItem('sfxVolume'));
    
    return {
        music: (isNaN(music) || music < 0 || music > 100) ? 60 : music,
        sound: (isNaN(sound) || sound < 0 || sound > 100) ? 80 : sound,
        playerLives: parseInt(localStorage.getItem('playerLives')) || localStorage.playerLives,
        bombs: parseInt(localStorage.getItem('bombs')) || localStorage.bombs
    };
}

// Update the exports at the bottom
window.playMusic = playMusic;
window.getSfxVolume = getSfxVolume;
window.getMusicVolume = getMusicVolume;
window.saveAudioSettings = saveAudioSettings;
window.stopGameMusic = stopGameMusic;
window.musicAudio = musicAudio;
window.saveSettings = saveSettings;
window.loadSettings = loadSettings;