class CardBullet {
    constructor(config) {
        this.x = config.x - 16;
        this.y = config.y - 16;
        this.speed = config.speed || 15;
        this.angle = config.angle -Math.PI/2 || -Math.PI/2; // Default to shooting upward
        this.damage = config.damage || 10;
        this.opacity = config.opacity || 0.5;
        this.width = 32;
        this.height = 32;
        
        // Handle card suit/number with defaults
        const suits = ['H', 'D', 'C', 'S'];
        const numbers = Array.from({length: 13}, (_, i) => i + 1);
        this.card = {
            suit: config.card?.suit || suits[Math.floor(Math.random() * suits.length)],
            number: config.card?.number || numbers[Math.floor(Math.random() * numbers.length)]
        };
        
        this.image = window.assetLoader?.getImage(`card${this.card.suit}${this.card.number}`);
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }

    render(ctx) {
        if (!this.image) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.angle + Math.PI/2); // Rotate to face direction of movement
        ctx.drawImage(
            this.image,
            -this.width/2, -this.height/2, 
            this.width, this.height
        );
        ctx.restore();
    }

    isOffScreen() {
        return this.y + this.height < 0 || 
               this.y > canvas.height ||
               this.x + this.width < 0 ||
               this.x > canvas.width;
    }
}