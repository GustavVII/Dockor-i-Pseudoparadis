class Laser {
    constructor(x, y, width, height, speed, image, isStart = false, isEnd = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = image;
        this.isStart = isStart; // Whether this is the start piece of the laser
        this.isEnd = isEnd; // Whether this is the end piece of the laser
        this.isActive = true; // Whether the laser is active
    }

    // Static array to track all active lasers
    static lasers = [];

    // Static method to spawn a laser beam
    static spawnLaserBeam(cursor, laserConfig, bulletManager) {
        const spawnPositions = laserConfig.spawnPositions;
        const laserLength = laserConfig.laserLength;

        // Play the laser sound effect
        playSoundEffect(soundEffects.laser);

        for (let i = 0; i < spawnPositions.length; i++) {
            const spawnPosition = spawnPositions[i];

            for (let j = 0; j < laserLength; j++) {
                setTimeout(() => {
                    const isStart = j === 0;
                    const isEnd = j === laserLength - 1;

                    const x = cursor.x + cursor.width / 2 + spawnPosition.xOffset - laserConfig.width / 2;
                    const y = cursor.y + spawnPosition.yOffset - j * laserConfig.height;

                    // Create a new laser instance
                    const laser = new Laser(
                        x, y,
                        laserConfig.width, laserConfig.height,
                        laserConfig.speed,
                        isStart ? shotTypeManager.laserImages.start : (isEnd ? shotTypeManager.laserImages.end : shotTypeManager.laserImages.middle),
                        isStart, isEnd
                    );

                    // Add the laser to the bulletManager and the static lasers array
                    bulletManager.addBullet(laser);
                    Laser.lasers.push(laser);
                }, j * 50); // Adjust the delay (50ms) as needed
            }
        }
    }

    // Static method to update all lasers
    static updateLasers() {
        for (let i = Laser.lasers.length - 1; i >= 0; i--) {
            const laser = Laser.lasers[i];
            laser.update();

            // Remove lasers that go off-screen
            if (laser.isOffScreen()) {
                Laser.lasers.splice(i, 1);
            }
        }
    }

    // Static method to check if all lasers are offscreen
    static areAllLasersOffscreen() {
        return Laser.lasers.length === 0;
    }

    // Update the laser's position
    update() {
        // Move the laser upward
        this.y -= this.speed;

        // Deactivate the laser if it goes off-screen
        if (this.y + this.height < 0) {
            this.isActive = false;
        }
    }

    // Render the laser
    render(ctx) {
        if (this.image) {
            ctx.drawImage(
                this.image,
                10, 0, 12, 32, // Source rectangle (from the laser image)
                this.x, this.y, this.width, this.height // Destination rectangle (on the canvas)
            );
        }
    }

    // Check if the laser collides with a card
    checkCollision(card) {
        const cardX = Math.round(card.x);
        const cardY = Math.round(card.y);

        return (
            this.x < cardX + CARD_WIDTH &&
            this.x + this.width > cardX &&
            this.y < cardY + CARD_HEIGHT &&
            this.y + this.height > cardY
        );
    }

    // Check if the laser is off-screen
    isOffScreen() {
        return this.y + this.height < 0;
    }
}

// Export the Laser class
window.Laser = Laser;