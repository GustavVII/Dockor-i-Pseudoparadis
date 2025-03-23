document.addEventListener('DOMContentLoaded', () => {
    // Händelseavlyssnare för knappen
    document.getElementById('startButton').addEventListener('click', () => {
        // Göm laddningsskrämen
        document.getElementById('startScreen').style.display = 'none';
        init();
    });
});

async function init() {
    // Visa laddningsskärmen
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = 'flex';

    console.log("Tillägger händelseavlyssnare");
    window.addEventListener('keydown', (e) => {
        handleKeyDown(e);
    });

    window.addEventListener('keyup', (e) => {
        handleKeyUp(e);
    });

    await initializeSoundEffects();

    createOptionsMenu();

    await spawnerManager.loadSpawnerImages();
    await loadCardImages();
    await loadBackImage();
    shotTypeManager.laserImages = {
        start: await loadImage('assets/graphics/bullets/lasers/laser1.png'),
        middle: await loadImage('assets/graphics/bullets/lasers/laser2.png'),
        end: await loadImage('assets/graphics/bullets/lasers/laser3.png'),
    };
    shotTypeManager.starImages = await loadStarImages();

    window.characterManager.setCharacter('Murasa');
    updateStatsBox();

    // Temporär tvångst av en extra sekund av inladding 
    // för att se att den laddar in korrekt
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        stopGameMusic();
        startMainMenu(); // Skicka till huvudmenyn
    }, 1000);
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