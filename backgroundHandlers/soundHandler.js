// soundHandler.js

// Ljudeffekter
const soundEffects = {
    shot: null,
    hit: null,
    spellcard: null,
    powershot: null,
    laser: null, // Add laser sound effect
};

// Funktion att ladda ljudeffekt
async function loadSoundEffect(src) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(src);
        audio.oncanplaythrough = () => resolve(audio);
        audio.onerror = reject;
    });
}

// Och för att spela den
function playSoundEffect(sound) {
    if (sound) {
        sound.currentTime = 0;
        sound.volume = getSfxVolume(); // Use the volume from the options menu
        sound.play();
    }
}

// Ladda ljudeffekterna
async function initializeSoundEffects() {
    try {
        soundEffects.shot = await loadSoundEffect('assets/sfx/shot.wav');
        soundEffects.hit = await loadSoundEffect('assets/sfx/hit.wav');
        soundEffects.spellcard = await loadSoundEffect('assets/sfx/spellcard.wav');
        soundEffects.powershot = await loadSoundEffect('assets/sfx/powershot.wav');
        soundEffects.laser = await loadSoundEffect('assets/sfx/laser.wav'); // Load laser sound effect
        console.log('All sound effects loaded successfully.');
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