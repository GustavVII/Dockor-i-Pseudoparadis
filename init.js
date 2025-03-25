// init.js

document.addEventListener('DOMContentLoaded', () => {
    // Event listener for the start button
    document.getElementById('startButton').addEventListener('click', () => {
        // Hide the start screen
        document.getElementById('startScreen').style.display = 'none';
        init();
    });
});

async function init() {
    // Show the loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = 'flex';

    // Declare and initialize all managers
    declareManagers();

    console.log("Adding event listeners");
    window.addEventListener('keydown', (e) => {
        handleKeyDown(e);
    });

    window.addEventListener('keyup', (e) => {
        handleKeyUp(e);
    });

    // Initialize sound effects
    await initializeSoundEffects();

    // Create the options menu
    createOptionsMenu();

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

    // Set the initial character
    characterManager.setCharacter('Murasa');
    updateStatsBox();

    // Temporary delay to ensure assets are loaded
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        stopGameMusic();
        startMainMenu(); // Go to the main menu
    }, 0);
}

// Function to start the game
function startGame() {
    // Initialize Level 1
    initializeLevel(level1Data);

    // Start the game loop
    requestAnimationFrame(gameLoop);
}

// Expose the startGame function to the global scope
window.startGame = startGame;