class PortraitManager {
    constructor() {
        this.portrait = null;
        this.isActive = false;
        this.opacity = 0;
        this.x = -400;
        this.y = 500;
        this.width = 256;
        this.height = 256;
        this.startTime = 0;
        this.animationPhase = 'slideIn';
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
        this.x = -200;
        this.width = 256;
        this.height = 256;
        this.startTime = performance.now();
        this.animationPhase = 'slideIn';
    }

    update() {
        if (!this.isActive) return;

        const currentTime = performance.now();
        const elapsedTime = currentTime - this.startTime;

        switch (this.animationPhase) {
            case 'slideIn':
                
                if (elapsedTime < 500) {
                    this.x = -200 + (elapsedTime / 500) * 328;
                    this.opacity = 0.7;
                } else {
                    this.x = 128;
                    this.animationPhase = 'stay';
                    this.startTime = currentTime;
                }
                break;

            case 'stay':
                if (elapsedTime >= 1000) {
                    this.animationPhase = 'fadeOut';
                    this.startTime = currentTime;
                }
                break;

            case 'fadeOut':
                if (elapsedTime < this.fadeoutTime) {
                    // Zoom och uttoning
                    this.opacity = 0.8 - (elapsedTime / this.fadeoutTime) * 1.2;
                    this.width = 256 + (elapsedTime / this.fadeoutTime) * 256;
                    this.height = 256 + (elapsedTime / this.fadeoutTime) * 256;
                } else {
                    this.isActive = false;
                }
                break;
        }
    }

    render(ctx) {
        if (!this.isActive || !this.portrait) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        ctx.translate(centerX, centerY);

        const scaleFactor = this.width / 128;
        ctx.scale(scaleFactor, scaleFactor);

        ctx.translate(-centerX, -centerY);

        const snappedX = Math.round(this.x);
        const snappedY = Math.round(this.y);

        ctx.drawImage(
            this.portrait,
            snappedX, snappedY, 128, 128
        );

        ctx.restore();
    }
}

const portraitManager = new PortraitManager();