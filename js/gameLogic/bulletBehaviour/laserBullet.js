class LaserBullet {
    constructor(x, y, width, height, speed, image, isStart, isEnd, spawnIndex) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = image;
        this.isStart = isStart; // Whether this is the start piece of the laser
        this.isEnd = isEnd; // Whether this is the end piece of the laser
        this.spawnIndex = spawnIndex; // Track which beam this part belongs to
        this.isActive = true;
    }

    update() {
        // Move the laser upward
        this.y -= this.speed;

        // Deactivate if off-screen
        if (this.y + this.height < 0) {
            this.isActive = false;
        }
    }

    render(ctx) {
        if (!this.image) {
            console.error("LaserBullet image is missing or not loaded.");
            return;
        }

        // Draw the laser part
        ctx.drawImage(
            this.image,
            10, 0, 12, 32, // Source image coordinates (adjust as needed)
            this.x, this.y, // Position
            this.width, this.height // Dimensions
        );
    }

    isOffScreen() {
        return this.y + this.height < 0;
    }
}

// Export the LaserBullet class
window.LaserBullet = LaserBullet;