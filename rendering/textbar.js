class TextBarManager {
    constructor() {
        this.isActive = false;
        this.text = ''; // Spellcard name
        this.x = -300; // Start off-screen to the left
        this.y = 520; // Vertical position (will be updated)
        this.targetY = 0; // Target Y position for smooth movement
        this.width = 240; // Width of the text bar
        this.height = 30; // Height of the text bar
        this.opacity = 1;
        this.slideInTime = 500; // Time to slide in
        this.moveDownTime = 500; // Time to move to the bottom
        this.slideOutTime = 500; // Time to slide out after spellcard ends

        // Animation phases
        this.animationPhase = 'slideIn'; // Phases: slideIn, moveDown, stay, slideOut
        this.startTime = 0; // Track timing for text bar animations
    }

    start(spellcardName) {
        this.isActive = true;
        this.text = spellcardName;
        this.x = -300; // Start off-screen to the left
        this.y = 520;
        this.targetY = 0; // Will be updated during animation
        this.opacity = 1;

        // Initialize text bar animation
        this.animationPhase = 'slideIn';
        this.startTime = performance.now();
    }

    update() {
        if (!this.isActive) return;

        const currentTime = performance.now();
        const elapsedTime = currentTime - this.startTime;

        switch (this.animationPhase) {
            case 'slideIn':
                // Slide in from the left over 0.5 seconds
                if (elapsedTime < this.slideInTime) {
                    this.x = -300 + (elapsedTime / this.slideInTime) * 320; // Move to x = 0
                } else {
                    this.x = 20; // Final position
                    this.animationPhase = 'stay';
                    this.startTime = currentTime; // Reset timer for the next phase
                    
                }
                break;

            case 'stay':
                if (elapsedTime >= 1000) {
                    this.animationPhase = 'moveDown';
                    this.startTime = currentTime; // Reset timer for the next phase
                }
                break;

            case 'moveDown':
                // Move the text bar to the bottom over 0.5 seconds
                if (elapsedTime < this.moveDownTime) {
                    this.targetY = canvas.height - this.height - 20; // Target Y position
                    this.y += (this.targetY - this.y) * 0.1; // Smooth movement
                } else {
                    this.y = this.targetY; // Snap to final position
                    this.animationPhase = 'secondStay';
                    this.startTime = currentTime; // Reset timer for the next phase
                }
                break;

            case 'secondStay':
                // Stay on screen for 3 seconds
                if (elapsedTime >= 4500) {
                    this.animationPhase = 'slideOut';
                    this.startTime = currentTime; // Reset timer for the next phase
                }
                break;

            case 'slideOut':
                // Slide out to the bottom over 0.5 seconds
                if (elapsedTime < this.slideOutTime) {
                    this.y += 2; // Slide out to the bottom
                } else {
                    this.isActive = false; // Deactivate text bar when off-screen
                }
                break;
        }
    }

    render(ctx) {
        if (!this.isActive) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;

        // Draw the red rectangle
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw the white text with black outline
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);

        ctx.restore();
    }
}

// Create an instance of TextBarManager
const textBarManager = new TextBarManager();