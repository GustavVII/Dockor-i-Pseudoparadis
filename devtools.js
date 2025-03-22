window.spawnCard = spawnCard;
window.shoot = shotTypeManager.shoot.bind(shotTypeManager)
window.invokeSpellcard = spellcardManager.invokeSpellcard.bind(spellcardManager);

// Increase power level
function increasePowerLevel() {
    if (shotTypeManager.powerLevel < 3) {
        shotTypeManager.powerLevel++;
        shotTypeManager.updateCooldownFrames();

        // Update spawner positions immediately (no transition)
        const spawnPositions = shotTypeManager.getSpawnPositions();
        spawnerManager.currentSpawnerPositions = spawnPositions.map(pos => ({ ...pos }));
        spawnerManager.targetSpawnerPositions = spawnPositions.map(pos => ({ ...pos }));

        updatePowerLevel(shotTypeManager.powerLevel);
    }
}

// Decrease power level
function decreasePowerLevel() {
    if (shotTypeManager.powerLevel > 0) {
        shotTypeManager.powerLevel--;
        shotTypeManager.updateCooldownFrames();

        // Update spawner positions immediately (no transition)
        const spawnPositions = shotTypeManager.getSpawnPositions();
        spawnerManager.currentSpawnerPositions = spawnPositions.map(pos => ({ ...pos }));
        spawnerManager.targetSpawnerPositions = spawnPositions.map(pos => ({ ...pos }));

        updatePowerLevel(shotTypeManager.powerLevel);
    }
}

// Expose functions to the global scope for debugging
window.increasePowerLevel = increasePowerLevel;
window.decreasePowerLevel = decreasePowerLevel;