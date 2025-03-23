class ShotTypeManager {
    constructor() {
        this.cooldownCounter = 0;
        this.baseCooldownFrames = 3;
        this.cooldownFrames = this.baseCooldownFrames;
        this.powerLevel = 0;
        this.currentShotType = "Persuation Card";
        this.shotTypes = shotTypesData.shotTypes;
        this.focusMode = false;

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
        updateScore(100);

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
                    // Get a random card from the suits and numbers
                    const suit = suits[Math.floor(Math.random() * suits.length)];
                    const number = Math.floor(Math.random() * (endNumber - startNumber + 1)) + startNumber;

                    // Create a card object with the correct properties
                    const card = { suit, number };

                    // Create the card bullet and add it to the BulletManager
                    const cardBullet = new CardBullet(x, y, 15, card);
                    bulletManager.addBullet(cardBullet); // Add to BulletManager
                    break;

                case "shootStars":
                    // Initialize the color index for this spawner if it doesn't exist
                    if (!this.spawnerColorIndices[index]) {
                        this.spawnerColorIndices[index] = 0;
                    }

                    // Get the current color for this spawner
                    const color = colors[this.spawnerColorIndices[index] % colors.length];
                    this.spawnerColorIndices[index]++; // Increment the color index for this spawner

                    // Create the star bullet and add it to the BulletManager
                    const starBullet = new StarBullet(x, y, 15, this.starImages, angle, color);
                    bulletManager.addBullet(starBullet); // Add to BulletManager
                    break;

                case "shootLaser":
                    // Create a laser bullet and add it to the BulletManager
                    const laser = new Laser(x, y, 12, 32, 32, this.laserImages.middle);
                    bulletManager.addBullet(laser); // Add to BulletManager
                    break;

                // Add more cases for other bullet types
            }
        });

        // Activate cooldown (only if not ignoring cooldown)
        if (!ignoreCooldown) {
            this.cooldownCounter = this.cooldownFrames;
        }
    }
}

// Create an instance of ShotTypeManager
const shotTypeManager = new ShotTypeManager();
window.shotTypeManager = shotTypeManager;