class PortraitManager {
    constructor() {
        this.portrait = null;
        this.isActive = false;
        this.opacity = 0;
        this.x = -400; // Start off-screen to the left
        this.y = 500; // Vertical position
        this.width = 256; // Original portrait width (128px)
        this.height = 256; // Original portrait height (128px)
        this.startTime = 0;
        this.animationPhase = 'slideIn'; // Phases: slideIn, stay, fadeOut
        this.fadeoutTime = 800;
    }

    async loadPortrait(imagePath) {
        try {
            this.portrait = await loadImage(imagePath);
        } catch (error) {
            console.error('Failed to load portrait image:', error);
        }
    }

    start() {
        this.isActive = true;
        this.opacity = 0;
        this.x = -200; // Reset position
        this.width = 256; // Reset to original size (128x128)
        this.height = 256; // Reset to original size (128x128)
        this.startTime = performance.now();
        this.animationPhase = 'slideIn';
    }

    update() {
        if (!this.isActive) return;

        const currentTime = performance.now();
        const elapsedTime = currentTime - this.startTime;

        switch (this.animationPhase) {
            case 'slideIn':
                // Slide in from the left over 0.5 seconds
                if (elapsedTime < 500) {
                    this.x = -200 + (elapsedTime / 500) * 328; // Move to x = 0
                    this.opacity = 0.7;
                } else {
                    this.x = 128; // Final position
                    this.animationPhase = 'stay';
                    this.startTime = currentTime; // Reset timer for the next phase
                }
                break;

            case 'stay':
                // Stay on screen for 1 seconds
                if (elapsedTime >= 1000) {
                    this.animationPhase = 'fadeOut';
                    this.startTime = currentTime; // Reset timer for the next phase
                }
                break;

            case 'fadeOut':
                // Fade out and zoom in over 0.3 seconds
                if (elapsedTime < this.fadeoutTime) {
                    this.opacity = 0.8 - (elapsedTime / this.fadeoutTime) * 1.2;
                    this.width = 256 + (elapsedTime / this.fadeoutTime) * 256; // Zoom in
                    this.height = 256 + (elapsedTime / this.fadeoutTime) * 256; // Zoom in
                } else {
                    this.isActive = false; // End portrait animation
                }
                break;
        }
    }

    render(ctx) {
        if (!this.isActive || !this.portrait) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;

        // Calculate the center of the portrait
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        // Translate to the center of the portrait
        ctx.translate(centerX, centerY);

        // Apply scaling (zoom) relative to the center
        const scaleFactor = this.width / 128; // Scale based on original size (128x128)
        ctx.scale(scaleFactor, scaleFactor);

        // Translate back to the original position
        ctx.translate(-centerX, -centerY);

        // Snap coordinates to integers to avoid blurriness
        const snappedX = Math.round(this.x);
        const snappedY = Math.round(this.y);

        // Draw the portrait at its original size (128x128)
        ctx.drawImage(
            this.portrait,
            snappedX, snappedY, 128, 128
        );

        ctx.restore();
    }
}

// Create an instance of PortraitManager
const portraitManager = new PortraitManager();