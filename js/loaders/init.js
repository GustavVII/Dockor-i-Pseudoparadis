document.addEventListener('DOMContentLoaded', () => {
    // Event listener for the start button
    document.getElementById('startButton').addEventListener('click', () => {
        // Hide the start screen
        document.getElementById('startScreen').style.display = 'none';
        init();
    });
});

async function init() {
    // Show loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = 'flex';
    const settings = loadSettings();

    // If parsing failed or values are invalid, use defaults
    if (isNaN(sfxVolume) || sfxVolume < 0 || sfxVolume > 1) {
        sfxVolume = 0.8;
    }
    if (isNaN(musicVolume) || musicVolume < 0 || musicVolume > 1) {
        musicVolume = 0.6;
    }

    musicVolume = settings.music / 100;
    sfxVolume = settings.sound / 100;

    // Hide other elements
    document.getElementById('canvas').style.display = 'none';
    document.getElementById('menuBox').style.display = 'none';
    document.getElementById('playerStatsDisplay').style.display = 'none';

    
    console.log("Adding event listeners");
    
    // Initialize sound effects
    await initializeSoundEffects();

    
    await languageManager.init();
    // Declare and initialize all managers
    await declareManagers();
    // Load all assets
    await loadAllAssets();

    // Assign preloaded images to managers
    shotTypeManager.laserImages = {
        start: assetLoader.getImage('laser1'),
        middle: assetLoader.getImage('laser2'),
        end: assetLoader.getImage('laser3'),
    };
    shotTypeManager.starImages = [
        assetLoader.getImage('star1'),
        assetLoader.getImage('star2'),
        assetLoader.getImage('star3'),
        assetLoader.getImage('star4'),
        assetLoader.getImage('star5'),
        assetLoader.getImage('star6'),
        assetLoader.getImage('star7'),
        assetLoader.getImage('star8'),
    ];

    updatePlayerStatsDisplay();

    window.addEventListener('keydown', (e) => {
        if (menuActive) {
            handleMenuKeyDown(e);
        } else {
            handleKeyDown(e);
        }
    });
    
    window.addEventListener('keyup', (e) => {
        if (menuActive) {
            handleMenuKeyUp(e);
        } else {
            handleKeyUp(e);
        }
    });

    // Temporary delay to ensure assets are loaded
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        stopGameMusic();
        startMainMenu(); // Go to the main menu
    }, 0);
}

// Function to start the game
function startGame() {
    // Set menu to inactive
    menuActive = false;

    characterManager.initializeCursor(characterName);
    if (!characterName) {
        console.error("No character name provided to startGame()");
        characterName = 'Murasa'; // Default fallback
    }

    if (window.characterManager) {
        window.characterManager.initializeCursor();
    }
    
    // Initialize Level 1
    initializeLevel(level1Data);

    // Hide menu and show game elements
    hideMenu();
    
    
    
    // Start the game loop
    requestAnimationFrame(gameLoop);
}

// Expose the startGame function to the global scope
window.startGame = startGame;