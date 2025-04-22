async function gameLoop(currentTime) {
    if (window.pauseMenuActive) return;
    
    deltaTime = currentTime - lastTime;

    if (deltaTime >= frameTime) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update systems
        gameInputHandler.handleInput();
        characterManager.handleMovement();
        characterManager.updateCursor();
        shotTypeManager.update();
        enemyManager.update(deltaTime);
        bulletManager.update();
        itemManager.update();
        enemyBulletManager.update();
        
        if (characterManager && shotTypeManager && spawnerManager) {
            spawnerManager.updateSpawners(
                characterManager.cursor, 
                shotTypeManager.activeShotTypes, 
                shotTypeManager, 
                characterManager.focusMode
            );
            spawnerManager.update();
        }

        // Render everything
        enemyManager.render(ctx);
        bulletManager.render(ctx);
        characterManager.renderCursor();
        itemManager.render(ctx);
        window.spawnerManager.render(ctx);
        enemyBulletManager.render(ctx);
        updatePlayerStatsDisplay();

        lastTime = currentTime;
    }

    requestAnimationFrame(gameLoop);
}