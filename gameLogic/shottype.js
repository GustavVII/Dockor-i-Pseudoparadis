class ShotTypeManager {
    constructor() {
        this.cooldownCounter = 0;
        this.baseCooldownFrames = 3;
        this.cooldownFrames = this.baseCooldownFrames;
        this.powerLevel = 0;
        this.currentShotType = "Persuation Card";
        this.shotTypes = shotTypesData.shotTypes;
        this.focusMode = false;

        this.bullets = [];
        this.starImages = []; // Array to store star images
        this.spawnerColorIndices = {}; // Track color indices per spawner        
    }

    // Set the current shot type
    setShotType(shotType) {
        this.currentShotType = shotType;
    }

    // Update the cooldown counter
    updateCooldown() {
        if (this.cooldownCounter > 0) {
            this.cooldownCounter--;
        }
    }

    // Update cooldown frames based on power level
    updateCooldownFrames() {
        switch (this.powerLevel) {
            case 0:
                this.cooldownFrames = this.baseCooldownFrames;
                break;
            case 1:
                this.cooldownFrames = this.baseCooldownFrames + 1;
                break;
            case 2:
                this.cooldownFrames = this.baseCooldownFrames + 2;
                break;
            case 3:
                this.cooldownFrames = this.baseCooldownFrames + 3;
                break;
        }
    }

    // Set focus mode (affects spawn positions)
    setFocusMode(isFocused) {
        this.focusMode = isFocused;
        this.updateSpawnerPositions(); // Update spawner positions when focus mode changes
    }

    // Get spawn positions for the current shot type and power level
    getSpawnPositions() {
        const shotType = this.shotTypes.find(st => st.name === this.currentShotType);
        if (!shotType) {
            console.error(`Shot type "${this.currentShotType}" not found.`);
            return [{ xOffset: 0, yOffset: -10 }]; // Default to single shot
        }

        // Determine which spawn positions to use (normal or focus mode)
        let spawnPositions;
        if (this.focusMode) {
            const focusKey = `powerLevel${this.powerLevel}`;
            spawnPositions = shotType.spawnPositions.focus?.[focusKey];
        } else {
            const powerLevelKey = `powerLevel${this.powerLevel}`;
            spawnPositions = shotType.spawnPositions[powerLevelKey];
        }

        if (!spawnPositions) {
            console.error(`Spawn positions for power level ${this.powerLevel} (focus: ${this.focusMode}) not found.`);
            return [{ xOffset: 0, yOffset: -10 }]; // Default to single shot
        }

        return spawnPositions;
    }

    // Notify the spawner manager of new spawn positions
    updateSpawnerPositions() {
        const spawnPositions = this.getSpawnPositions();
        spawnerManager.setSpawnerPositions(spawnPositions);
    }

    // Shoot bullets based on the current shot type
    shoot(ignoreCooldown = false, isSpellcard = false, cursor) {
        if (!cursor.isActive || (!ignoreCooldown && this.cooldownCounter > 0)) return;

        // Play the appropriate sound effect
        if (isSpellcard) {
            playSoundEffect(soundEffects.powershot);
        } else {
            playSoundEffect(soundEffects.shot);
        }

        // Get spawn positions based on the current shot type and power level
        const spawnPositions = this.getSpawnPositions();

        // Create bullets for each spawn position
        spawnPositions.forEach(({ xOffset, yOffset, angle = 0, colors = [1] }, index) => {
            const x = cursor.x + cursor.width / 2 + xOffset - 16; // Adjust for bullet width
            const y = cursor.y + yOffset - 20;

            // Determine the bullet type based on the shot type
            const shotType = this.shotTypes.find(st => st.name === this.currentShotType);
            if (!shotType) return;

            switch (shotType.behavior) {
                case "shootCards":
                    const randomCard = cards[Math.floor(Math.random() * cards.length)];
                    const cardBullet = new CardBullet(x, y, 15, randomCard);
                    this.bullets.push(cardBullet);
                    break;

                case "shootStars":
                    // Initialize the color index for this spawner if it doesn't exist
                    if (!this.spawnerColorIndices[index]) {
                        this.spawnerColorIndices[index] = 0;
                    }

                    // Get the current color for this spawner
                    const color = colors[this.spawnerColorIndices[index] % colors.length];
                    this.spawnerColorIndices[index]++; // Increment the color index for this spawner

                    // Create the star bullet with the selected color
                    const starBullet = new StarBullet(x, y, 15, this.starImages, angle, color);
                    this.bullets.push(starBullet);
                    break;

                // Add more cases for other bullet types
            }
        });

        // Activate cooldown (only if not ignoring cooldown)
        if (!ignoreCooldown) {
            this.cooldownCounter = this.cooldownFrames;
        }
    }

    // Update bullet positions and handle collisions
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update();

            // Check collisions between bullets and static cards
            for (let j = cards.length - 1; j >= 0; j--) {
                const card = cards[j];
                if (this.checkCollision(bullet, card)) {
                    if (card.flipCooldown <= 0) {
                        playSoundEffect(soundEffects.hit);

                        card.isAnimating = true;
                        card.targetScaleX = 0;
                        card.flipCooldown = 60;
                        incrementFlipCounter();

                        if (!bullet.isSpellcard) {
                            this.bullets.splice(i, 1);
                        }
                    }
                }
            }

            // Remove bullets that go off-screen
            if (bullet.isOffScreen()) {
                this.bullets.splice(i, 1);
            }
        }
    }

    // Check collision between a bullet and a card
    checkCollision(bullet, card) {
        return (
            bullet.x < card.x + CARD_WIDTH &&
            bullet.x + bullet.width > card.x &&
            bullet.y < card.y + CARD_HEIGHT &&
            bullet.y + bullet.height > card.y
        );
    }
}

// Create an instance of ShotTypeManager
const shotTypeManager = new ShotTypeManager();
window.shotTypeManager = shotTypeManager;