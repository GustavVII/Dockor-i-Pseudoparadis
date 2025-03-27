function gameLoop(currentTime) {
    deltaTime = currentTime - lastTime;

    if (deltaTime >= frameTime) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (document.getElementById('canvas').style.display !== 'block') {
            document.getElementById('canvas').style.display = 'block';
            document.getElementById('menuBox').style.display = 'none';
        }

        if (pauseMenuActive) {
            // ... pause menu code ...
        } else {
            // Handle input
            gameInputHandler.handleInput();

            // Ensure cursor is initialized
            if (!characterManager.cursor.isActive) {
                characterManager.cursor.isActive = true;
                characterManager.cursorVisible = true;
                characterManager.cursor.x = canvas.width / 2;
                characterManager.cursor.y = canvas.height - 64;
            }
            if (!characterManager.cursor || !characterManager.cursor.isActive) {
                characterManager.initializeCursor();
            }

            // Handle input
            gameInputHandler.handleInput();

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

            spawnerManager.renderSpawners(ctx, characterManager.cursor, shotTypeManager.powerLevel);

            // Stop shaking again so that portraits, text, etc., don't shake
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            shotTypeManager.updateCooldown();

            if (characterManager.cursorVisible && characterManager.cursor.image) {
                ctx.drawImage(
                    characterManager.cursor.image,
                    characterManager.cursor.x - characterManager.cursor.width/2,
                    characterManager.cursor.y - characterManager.cursor.height/2,
                    characterManager.cursor.width,
                    characterManager.cursor.height
                );
            }

            textBarManager.update();
            textBarManager.render(ctx);

            updatePlayerStatsDisplay()
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