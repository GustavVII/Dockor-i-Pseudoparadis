let menuActive = true; // Track if the menu is active
let lastFrameTime = Date.now();

// Main menu loop
function startMenuLoop(currentTime) {
    deltaTime = currentTime - lastTime;
    
    if (deltaTime >= frameTime) {
        if (!menuActive) return;
        if (currentMenuState === MENU_STATES.MAIN) {
            renderMainMenu();
        } else if (currentMenuState === MENU_STATES.OPTIONS) {
            optionsMenu.render();
        }
        handleMenuInput();
        lastTime = currentTime;
    }
    
    requestAnimationFrame(startMenuLoop);
}

// Start the main menu loop when the game is ready
function startMainMenu() {
    menuActive = true;

    // Hide the statbox when the menu is active
    document.getElementById('playerStatsDisplay').style.display = 'none';
    document.getElementById('menuBox').style.display = 'flex';

    // Play the main menu music
    if (window.playMusic) {
        window.playMusic('assets/music/DiPP_01.mp3');
    } else {
        console.error('playMusic function not available');
    }
    
    startMenuLoop();
}

function stopMenuMusic() {
    if (window.stopGameMusic) {
        window.stopGameMusic();
    }
    // Now we can safely clear the reference
    if (window.musicAudio) {
        window.musicAudio = null;
    }
}

// Expose the startMainMenu function to the global scope
window.startMainMenu = startMainMenu;