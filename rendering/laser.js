class Laser {
    constructor() {
        this.lasers = [];
        this.laser = {
            isActive: false,
            x: 0,
            y: 0,
            width: 12,
            height: 32,
            speed: 10, // Speed at which laser parts move upward
            image: null,
            startImage: null,
            endImage: null,
        };
        this.currentSpellcard = null;
        this.spawnDelay = 100; // Delay between spawning each laser part (in milliseconds)
        this.spawnTimer = 0; // Timer for spawning laser parts
        this.spawnIndex = 0; // Index of the current laser part being spawned
        this.spawnComplete = false; // Whether all laser parts have been spawned
        this.endPartStatic = []; // Static end parts of the laser for each spawn position
        this.lastSpawnY = null; // Track the Y position of the last spawned part
        this.isEndPieceSpawned = false; // Flag to track if the end piece has spawned
        this.laser.sound = soundEffects.laser;
    }

    reset() {
        this.lasers = [];
        this.currentSpellcard = null;
        this.spawnTimer = 0;
        this.spawnIndex = 0;
        this.spawnComplete = false;
        this.endPartStatic = [];
        this.lastSpawnY = null;
    }

    async loadAssets() {
        try {
            this.laser.image = await loadImage('assets/graphics/lasers/laser2.png');
            this.laser.startImage = await loadImage('assets/graphics/lasers/laser1.png');
            this.laser.endImage = await loadImage('assets/graphics/lasers/laser3.png');
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
        this.spawnIndex = new Array(spellcard.laser.spawnPositions.length).fill(0); // Initialize for each beam
        this.spawnComplete = new Array(spellcard.laser.spawnPositions.length).fill(false); // Initialize for each beam
        this.lasers = [];
        this.endPartStatic = []; // Reset the static end parts array
        this.endPartStaticBottom = [];
        this.endPartStaticTop = [];
        this.lastSpawnY = new Array(spellcard.laser.spawnPositions.length).fill(null); // Initialize for each beam
        this.isEndPieceSpawned = false; // Reset the flag for the new spellcard
    
        // Initialize the static end parts for each spawn position
        for (let i = 0; i < spellcard.laser.spawnPositions.length; i++) {
            const spawnPosition = spellcard.laser.spawnPositions[i];
    
            // Bottom canvas static end part
            const bottomEndPart = {
                x: (cursor.x + cursor.width / 2 + spawnPosition.xOffset - spellcard.laser.width / 8),
                y: (cursor.y + spawnPosition.yOffset), // This is the starting Y position for the first laser part
                width: spellcard.laser.width,
                height: spellcard.laser.height,
                image: this.laser.endImage,
            };
            this.endPartStaticBottom.push(bottomEndPart);
            this.endPartStatic.push(bottomEndPart); // Add to the general static end parts array
    
            // Top canvas static end part (adjust y position for top canvas)
            const topEndPart = {
                x: (cursor.x + cursor.width / 2 + spawnPosition.xOffset - spellcard.laser.width / 4),
                y: (cursor.y + spawnPosition.yOffset - 160), // Adjust for the 160px offset
                width: spellcard.laser.width,
                height: spellcard.laser.height,
                image: this.laser.endImage,
            };
            this.endPartStaticTop.push(topEndPart);
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
    
        // Only update lasers if the current spellcard uses lasers
        if (this.currentSpellcard.behavior === "shootLaser") {
            // Update the static end parts to follow the player's cursor
            for (let i = 0; i < this.endPartStaticBottom.length; i++) {
                const spawnPosition = this.currentSpellcard.laser.spawnPositions[i % this.currentSpellcard.laser.spawnPositions.length];
                this.endPartStaticBottom[i].x = (cursor.x + cursor.width / 2 + spawnPosition.xOffset - this.currentSpellcard.laser.width / 2);
                this.endPartStaticBottom[i].y = (cursor.y + spawnPosition.yOffset);
    
                this.endPartStaticTop[i].x = (cursor.x + cursor.width / 2 + spawnPosition.xOffset - this.currentSpellcard.laser.width / 2);
                this.endPartStaticTop[i].y = (cursor.y + spawnPosition.yOffset - 160);
            }
    
            // Spawn laser parts sequentially for each beam
            for (let i = 0; i < this.currentSpellcard.laser.spawnPositions.length; i++) {
                if (!this.spawnComplete[i]) {
                    // Check if it's time to spawn a new laser part for this beam
                    if (this.lastSpawnY[i] === null || this.lastSpawnY[i] - this.getLastLaserY(i) >= 32) {
                        this.spawnPart(cursor, i);
                        this.lastSpawnY[i] = this.getLastLaserY(i);
                    }
    
                    // Check if all laser parts have been spawned for this beam
                    if (this.spawnIndex[i] >= this.currentSpellcard.laser.laserLength) {
                        this.spawnComplete[i] = true;
                    }
                }
            }
    
            // Update laser positions (move upward)
            for (let i = this.lasers.length - 1; i >= 0; i--) {
                const laser = this.lasers[i];
                laser.y -= laser.speed; // Move upward
    
                // Remove lasers that go off-screen
                if (laser.y + laser.height < 0) {
                    this.lasers.splice(i, 1);
                }
            }
    
            // Notify the spellcard manager if all lasers are off-screen
            if (this.spawnComplete.every(complete => complete) && this.lasers.length === 0) {
                console.log("All lasers are off-screen");
                spellcardManager.isSpellcardActive = false; // Deactivate the spellcard
                spellcardManager.resetPlayerSpeed(cursor); // Reset player speed
                this.reset(); // Reset the laser manager
            }
        }
    }

    spawnPart(cursor, beamIndex) {
        const spawnPosition = this.currentSpellcard.laser.spawnPositions[beamIndex];
    
        // Calculate the Y position for the new laser part
        const laserY = (cursor.y + spawnPosition.yOffset);
    
        const newLaser = {
            x: (cursor.x + cursor.width / 2 + spawnPosition.xOffset - this.currentSpellcard.laser.width / 2),
            y: laserY,
            width: this.currentSpellcard.laser.width,
            height: this.currentSpellcard.laser.height,
            speed: this.currentSpellcard.laser.speed,
            image: this.laser.image,
            isStart: this.spawnIndex[beamIndex] === 0,
            isEnd: this.spawnIndex[beamIndex] === this.currentSpellcard.laser.laserLength - 1,
            canvas: 'canvas',
            spawnIndex: beamIndex, // Track which beam this part belongs to
        };

    
        this.lasers.push(newLaser);
        this.spawnIndex[beamIndex]++;
    
        // Check if this is the last part of the laser beam
        if (this.spawnIndex[beamIndex] >= this.currentSpellcard.laser.laserLength) {
            this.spawnComplete[beamIndex] = true;
    
            // Set the flag to indicate that the end piece has spawned
            this.isEndPieceSpawned = true;
        }    
    }

    getLastLaserY(beamIndex) {
        // Find the last spawned laser part for the given beam
        const lastLaser = this.lasers
            .filter(laser => laser.spawnIndex === beamIndex)
            .sort((a, b) => b.y - a.y)[0]; // Get the part with the highest Y value
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
    
        // Render the moving laser parts
        const sortedLasers = this.lasers
            .filter(laser => laser.canvas) // Filter by canvas type
            .sort((a, b) => a.y - b.y);
    
        sortedLasers.forEach(laser => {
            let imageToDraw;
            if (laser.isStart) {
                imageToDraw = this.laser.startImage;
            } else if (laser.isEnd) {
                imageToDraw = this.laser.endImage;
            } else {
                imageToDraw = this.laser.image;
            }
    
            if (imageToDraw) {
                ctx.drawImage(
                    imageToDraw,
                    10, 0, 12, 32,
                    laser.x, laser.y, // Use the adjusted y position for rendering
                    laser.width, laser.height
                );
            }
        });
    }

    checkCollision(card) {
        for (const laser of this.lasers) {
            let laserY = laser.y;
    
            if (
                laser.x < card.x + CARD_WIDTH &&
                laser.x + laser.width > card.x &&
                laserY < card.y + CARD_HEIGHT &&
                laserY + laser.height > card.y
            ) {
                return true; // Collision detected
            }
        }
        return false; // No collision
    }
}

// Create an instance of Laser
const laserManager = new Laser();