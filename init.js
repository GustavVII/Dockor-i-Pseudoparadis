document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to the start button
    document.getElementById('startButton').addEventListener('click', () => {
        // Hide the start screen
        document.getElementById('startScreen').style.display = 'none';
        // Start the game initialization
        init();
    });
});

async function init() {
    // Show the loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = 'flex';

    // Initialize game components
    console.log("Adding event listeners for keyboard input...");
    window.addEventListener('keydown', (e) => {
        handleKeyDown(e);
    });

    window.addEventListener('keyup', (e) => {
        handleKeyUp(e);
    });

    await initializeCards();
    await initializeSoundEffects();

    createOptionsMenu();
    playMusic();

    await spawnerManager.loadSpawnerImages();
    await spellcardManager.loadSpellcards();
    await laserManager.loadAssets();
    shotTypeManager.starImages = await loadStarImages();

    window.characterManager.setCharacter('Murasa');
    updateStatsBox();

    // Force a 1-second delay before hiding the loading screen and showing the main menu
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        startMainMenu(); // Start the main menu
    }, 1000); // 1000ms = 1 second
}