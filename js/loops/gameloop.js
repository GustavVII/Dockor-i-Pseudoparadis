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

        // Render everything
        //renderBackground();
        enemyManager.render(ctx);
        bulletManager.render(ctx);
        characterManager.renderCursor();
        updatePlayerStatsDisplay();

        lastTime = currentTime;

        /*if (stageIsComplete) {
            await window.stageManager.onStageComplete();
        }*/
    }

    requestAnimationFrame(gameLoop);
}