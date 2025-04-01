function gameLoop(currentTime) {
    deltaTime = currentTime - lastTime;

    if (deltaTime >= frameTime) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update systems
        gameInputHandler.handleInput();
        characterManager.handleMovement();
        characterManager.updateCursor();
        shotTypeManager.update();
        bulletManager.update();

        // Render everything
        characterManager.renderCursor();
        bulletManager.render(ctx); // Render bullets
        spawnerManager.renderSpawners(ctx, characterManager.cursor, shotTypeManager.power);
        updatePlayerStatsDisplay();

        lastTime = currentTime;
    }

    requestAnimationFrame(gameLoop);
}