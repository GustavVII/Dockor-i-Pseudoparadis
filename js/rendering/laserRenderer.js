class LaserManager {
    constructor() {
        this.lasers = []; // Array to store active laser beams
        this.currentSpellcard = null;
        this.spawnDelay = 100; // Delay between spawning each laser part
        this.spawnTimer = 0;
        this.spawnIndex = 0;
        this.spawnComplete = false;
        this.endPartStatic = []; // Static end parts of the laser
        this.lastSpawnY = null;
        this.isEndPieceSpawned = false;
    }

    reset() {
        this.lasers = [];
        this.currentSpellcard = null;
        this.spawnTimer = 0;
        this.spawnIndex = 0;
        this.spawnComplete = false;
        this.endPartStatic = [];
        this.lastSpawnY = null;
        console.log("Laser manager reset");
    }

    async loadAssets() {
        try {
            this.laserImage = await loadImage('assets/graphics/lasers/laser2.png');
            this.laserStartImage = await loadImage('assets/graphics/lasers/laser1.png');
            this.laserEndImage = await loadImage('assets/graphics/lasers/laser3.png');
        } catch (error) {
            console.error("Failed to load laser images:", error);
        }
    }

    start(cursor, spellcard) {
        if (!spellcard || !spellcard.laser || !spellcard.laser.image) {
            console.error("Laser assets not loaded for spellcard:", spellcard?.type);
            return;
        }

        this.currentSpellcard = spellcard;
        this.spawnIndex = new Array(spellcard.laser.spawnPositions.length).fill(0);
        this.spawnComplete = new Array(spellcard.laser.spawnPositions.length).fill(false);
        this.lasers = [];
        this.endPartStatic = [];
        this.lastSpawnY = new Array(spellcard.laser.spawnPositions.length).fill(null);
        this.isEndPieceSpawned = false;

        // Initialize the static end parts for each spawn position
        for (let i = 0; i < spellcard.laser.spawnPositions.length; i++) {
            const spawnPosition = spellcard.laser.spawnPositions[i];
            const bottomEndPart = {
                x: (cursor.x + cursor.width / 2 + spawnPosition.xOffset - spellcard.laser.width / 8),
                y: (cursor.y + spawnPosition.yOffset),
                width: spellcard.laser.width,
                height: spellcard.laser.height,
                image: this.laserEndImage,
            };
            this.endPartStatic.push(bottomEndPart);
        }

        if (spellcard.soundEffect) {
            const laserSound = new Audio(spellcard.soundEffect);
            laserSound.play().catch(error => {
                console.error("Failed to play laser sound:", error);
            });
        }
    }

    update(cursor) {
        if (!this.currentSpellcard || !cursor) return;

        if (this.currentSpellcard.behavior === "shootLaser") {
            // Update the static end parts to follow the cursor
            for (let i = 0; i < this.endPartStatic.length; i++) {
                const spawnPosition = this.currentSpellcard.laser.spawnPositions[i];
                this.endPartStatic[i].x = (cursor.x + cursor.width / 2 + spawnPosition.xOffset - this.currentSpellcard.laser.width / 2);
                this.endPartStatic[i].y = (cursor.y + spawnPosition.yOffset);
            }

            // Spawn laser parts sequentially for each beam
            for (let i = 0; i < this.currentSpellcard.laser.spawnPositions.length; i++) {
                if (!this.spawnComplete[i]) {
                    if (this.lastSpawnY[i] === null || this.lastSpawnY[i] - this.getLastLaserY(i) >= 32) {
                        this.spawnPart(cursor, i);
                        this.lastSpawnY[i] = this.getLastLaserY(i);
                    }

                    if (this.spawnIndex[i] >= this.currentSpellcard.laser.laserLength) {
                        this.spawnComplete[i] = true;
                    }
                }
            }

            // Notify the spellcard manager if all lasers are off-screen
            if (this.spawnComplete.every(complete => complete) && this.lasers.length === 0) {
                console.log("All lasers are off-screen");
                spellcardManager.isSpellcardActive = false;
                spellcardManager.resetPlayerSpeed(cursor);
                this.reset();
            }
        }
    }

    spawnPart(cursor, beamIndex) {
        const spawnPosition = this.currentSpellcard.laser.spawnPositions[beamIndex];
        const laserY = (cursor.y + spawnPosition.yOffset);

        const newLaser = new LaserBullet(
            cursor.x + cursor.width / 2 + spawnPosition.xOffset - this.currentSpellcard.laser.width / 2,
            laserY,
            this.currentSpellcard.laser.width,
            this.currentSpellcard.laser.height,
            this.currentSpellcard.laser.speed,
            this.laserImage,
            this.spawnIndex[beamIndex] === 0, // isStart
            this.spawnIndex[beamIndex] === this.currentSpellcard.laser.laserLength - 1, // isEnd
            beamIndex // spawnIndex
        );

        bulletManager.addBullet(newLaser); // Add the laser to the bullet manager
        this.spawnIndex[beamIndex]++;
    }

    getLastLaserY(beamIndex) {
        const lastLaser = this.lasers
            .filter(laser => laser.spawnIndex === beamIndex)
            .sort((a, b) => b.y - a.y)[0];
        return lastLaser ? lastLaser.y : null;
    }

    render(ctx) {
        if (!this.isEndPieceSpawned) {
            for (const endPart of this.endPartStatic) {
                if (endPart && endPart.image) {
                    ctx.drawImage(
                        endPart.image,
                        10, 0, 12, 32,
                        endPart.x, endPart.y,
                        endPart.width, endPart.height
                    );
                }
            }
        }
    }
}

// Create an instance of LaserManager
const laserManager = new LaserManager();