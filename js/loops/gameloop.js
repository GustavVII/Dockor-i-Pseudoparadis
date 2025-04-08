function gameLoop(currentTime) {
    if (window.pauseMenuActive) return; // Don't run game logic when paused
    
    deltaTime = currentTime - lastTime;

    if (deltaTime >= frameTime) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update systems
        if (!window.pauseMenuActive) { // Only handle input when not paused
            gameInputHandler.handleInput();
            characterManager.handleMovement();
            characterManager.updateCursor();
            shotTypeManager.update();
            bulletManager.update();
        }

        // Render everything
        characterManager.renderCursor();
        bulletManager.render(ctx);
        spawnerManager.renderSpawners(ctx, characterManager.cursor, shotTypeManager.power);
        updatePlayerStatsDisplay();

        lastTime = currentTime;
    }

    requestAnimationFrame(gameLoop);
}