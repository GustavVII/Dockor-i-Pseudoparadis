// soundHandler.js

// Sound effects
const soundEffects = {
    shot: null,
    hit: null,
    spellcard: null,
    powershot: null,
    laser: null, // Add laser sound effect
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
    if (sound && sound.play) {
        sound.currentTime = 0; // Reset the sound to the beginning
        sound.volume = getSfxVolume(); // Apply the current SFX volume
        sound.play();
    } else {
        console.error("Invalid sound object:", sound);
    }
}

// Load all sound effects
async function initializeSoundEffects() {
    try {
        soundEffects.shot = await loadSoundEffect('assets/sfx/shot.wav');
        soundEffects.hit = await loadSoundEffect('assets/sfx/hit.wav');
        soundEffects.spellcard = await loadSoundEffect('assets/sfx/spellcard.wav');
        soundEffects.powershot = await loadSoundEffect('assets/sfx/powershot.wav');
        soundEffects.laser = await loadSoundEffect('assets/sfx/laser.wav'); // Load laser sound effect
        console.log('All sound effects loaded successfully:', soundEffects);
    } catch (error) {
        console.error('Failed to load sound effects:', error);
    }
}

// Stop the game music
function stopGameMusic() {
    if (window.gameMusic) {
        window.gameMusic.pause();
        window.gameMusic.currentTime = 0; // Reset the music to the beginning
        window.gameMusic = null; // Unload the music to save memory
    }
}

// Export functions for use in other files
window.playSoundEffect = playSoundEffect;
window.initializeSoundEffects = initializeSoundEffects;
window.soundEffects = soundEffects; // Export soundEffects for use elsewhere
window.stopGameMusic = stopGameMusic; // Export stopGameMusic