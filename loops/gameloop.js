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

            // Handle screen shake
            let shakeOffset = { x: 0, y: 0 };
            if (spellcardManager.isSpellcardActive) {
                shakeOffset = spellcardManager.updateShake();
            }

            // Apply screen shake
            ctx.translate(shakeOffset.x, shakeOffset.y);

            renderCards(ctx, canvas);
            bulletManager.update(); // Update all bullets
            Laser.updateLasers();
            bulletManager.render(ctx); // Render all bullets

            // Stop screen shake so that the darkening layer doesn't shake
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            spellcardManager.renderDarkeningLayer(ctx);

            // Re-enable screen shake
            ctx.translate(shakeOffset.x, shakeOffset.y);

            characterManager.renderCursor();
            spawnerManager.renderSpawners(ctx, characterManager.cursor, shotTypeManager.powerLevel);
            spellcardManager.renderSpellcardRing(ctx);

            // Stop shaking again so that portraits, text, etc., don't shake
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            shotTypeManager.updateCooldown();
            spellcardManager.updateSpellcardRing();
            spellcardManager.updateDarkeningLayer();

            portraitManager.update();
            portraitManager.render(ctx);
            textBarManager.update();
            textBarManager.render(ctx);

            spellcardManager.checkSpellcardEnd(characterManager.cursor);
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
    }
}