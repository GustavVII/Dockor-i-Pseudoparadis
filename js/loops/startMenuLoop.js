function startMenuLoop(currentTime) {
    if (!lastTime) lastTime = currentTime;
    deltaTime = currentTime - lastTime;
    
    if (deltaTime >= frameTime) {
        if (!menuActive) return;
        window.menuHandler.handleInput();
        lastTime = currentTime;
    }
    
    requestAnimationFrame(startMenuLoop);
}

function startMainMenu() {
    menuActive = true;
    window.menuHandler.showMenu();
    window.menuHandler.switchMenu(MENU_STATES.MAIN);
    
    if (window.playMusic) {
        window.playMusic('assets/music/DiPP_01.mp3');
    }
    
    lastTime = performance.now(); // Initialize lastTime
    requestAnimationFrame(startMenuLoop);
}