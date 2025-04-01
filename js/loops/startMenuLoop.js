
// Main menu loop
function startMenuLoop(currentTime) {
    deltaTime = currentTime - lastTime;
    
    if (deltaTime >= frameTime) {
        if (!menuActive) return;
        handleMenuInput();
        lastTime = currentTime;
    }
    
    requestAnimationFrame(startMenuLoop);
}


// Start the main menu loop when the game is ready
function startMainMenu() {
    menuActive = true;
    document.getElementById('playerStatsDisplay').style.display = 'none';
    document.getElementById('menuBox').style.display = 'flex';
    
    renderMainMenu();
    
    if (window.playMusic) {
        window.playMusic('assets/music/DiPP_01.mp3');
    }
    
    startMenuLoop();
}

function stopMenuMusic() {
    if (window.stopGameMusic) {
        window.stopGameMusic();
    }
    if (window.musicAudio) {
        window.musicAudio = null;
    }
}

window.startMainMenu = startMainMenu;