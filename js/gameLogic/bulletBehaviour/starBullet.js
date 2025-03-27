class StarBullet {
    constructor(x, y, speed, starImages, angle, color) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.starImages = starImages;
        this.width = 24;
        this.height = 24;
        this.rotation = 0;
        this.rotationSpeed = 3 * Math.PI;
        this.angle = angle;
        this.color = color; // Store the color index
        this.image = this.starImages[color -1]; // Set the image based on the color index
    }

    update() {
        // Convert angle to radians and calculate velocity components
        const angleRad = (this.angle * Math.PI) / 180;
        this.x += Math.sin(angleRad) * this.speed; // Move horizontally
        this.y -= Math.cos(angleRad) * this.speed; // Move vertically

        // Update rotation
        this.rotation += this.rotationSpeed / 60;
    }

    render(ctx) {
        if (!this.image) {
            console.error("StarBullet image is missing or not loaded.");
            return;
        }

        ctx.save(); // Save the current canvas state

        // Move the origin to the center of the star
        ctx.translate(this.x + this.width / 1.5, this.y + this.height / 1.5);

        // Apply rotation
        ctx.rotate(this.rotation);

        // Draw the star centered at the origin
        ctx.drawImage(
            this.image,
            -this.width / 2, -this.height / 2, this.width, this.height
        );

        ctx.restore(); // Restore the canvas state
    }

    isOffScreen() {
        return this.y + this.height < 0; // Check if the bullet is off-screen
    }

    // Get the next image in the sequence
    getNextImage() {
        const colorIndex = this.colors[this.colorIndex % this.colors.length];
        this.colorIndex++;
        const image = this.starImages[colorIndex - 1]; // Adjust for 0-based index
        if (!image) {
            console.error("Invalid image for color index:", colorIndex, "starImages:", this.starImages);
        }
        return image;
    }
}

// Export the StarBullet class and loadStarImages function
window.StarBullet = StarBullet;