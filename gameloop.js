function gameLoop(currentTime) {
    deltaTime = currentTime - lastTime;

    if (deltaTime >= frameTime) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Handle input
        handleInput();

        // Update cursor position
        characterManager.updateCursor();

        // Update spawner animation
        spawnerManager.updateAnimation();

        // Apply the shake effect before rendering anything
        let shakeOffset = { x: 0, y: 0 };
        if (spellcardManager.isSpellcardActive) {
            shakeOffset = spellcardManager.updateShake();
        }

        // Apply the shake offset to the canvas
        ctx.translate(shakeOffset.x, shakeOffset.y);

        // Render everything except the player, spawners, and ring
        renderCards(ctx, canvas);
        bulletRenderer.renderBullets(ctx, shotTypeManager.bullets); // Use bulletRenderer

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Render the darkening layer, player, spawners, and ring

        spellcardManager.renderDarkeningLayer(ctx);

        ctx.translate(shakeOffset.x, shakeOffset.y);

        characterManager.renderCursor();
        spawnerManager.renderSpawners(ctx, characterManager.cursor, shotTypeManager.powerLevel); // Fix: Pass correct arguments
        spellcardManager.renderSpellcardRing(ctx);

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Update bullets, cooldown, and spellcard effects
        shotTypeManager.updateBullets();
        shotTypeManager.updateCooldown();
        spellcardManager.updateSpellcardRing();
        spellcardManager.updateDarkeningLayer();
        laserManager.update(characterManager.cursor);
        laserManager.render(ctx);

        // Update and render the portrait
        portraitManager.update();
        portraitManager.render(ctx);
        textBarManager.update();
        textBarManager.render(ctx);

        // Check if the spellcard has ended
        spellcardManager.checkSpellcardEnd(characterManager.cursor);

        lastTime = currentTime;
    }

    requestAnimationFrame(gameLoop);
}