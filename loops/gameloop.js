// gameLoop.js

function gameLoop(currentTime) {
    deltaTime = currentTime - lastTime;

    if (deltaTime >= frameTime) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (pauseMenuActive) {
            // Handle pause menu input
            handlePauseMenuInput();

            // Render the pause menu
            renderPauseMenu(ctx);
        } else {
            // Handle input
            handleInput();

            characterManager.updateCursor();

            spawnerManager.updateAnimation();

            // Apply screen shake
            spellcardManager.applyScreenShake(ctx);

            renderCards(ctx, canvas);
            bulletManager.update(); // Update all bullets
            bulletManager.render(ctx); // Render all bullets

            // Stop screen shake so that the darkening layer doesn't shake
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            // Update and render the darkening layer
            spellcardManager.updateDarkeningLayer();
            spellcardManager.renderDarkeningLayer(ctx);

            // Update and render the portrait
            portraitManager.update();
            portraitManager.render(ctx);

            characterManager.renderCursor();
            spawnerManager.renderSpawners(ctx, characterManager.cursor, shotTypeManager.powerLevel);

            // Stop shaking again so that portraits, text, etc., don't shake
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            shotTypeManager.updateCooldown();

            textBarManager.update();
            textBarManager.render(ctx);
        }

        lastTime = currentTime;
    }

    // Continue the game loop only if the game is still active
    if (!shouldExitToMainMenu) {
        requestAnimationFrame(gameLoop);
    } else {
        // Stop the game loop and return to the main menu
        shouldExitToMainMenu = false; // Reset the flag
        stopGameMusic(); // Stop the game music
        startMainMenu(); // Return to the main menu
        cancelAnimationFrame(gameLoop);
    }
}