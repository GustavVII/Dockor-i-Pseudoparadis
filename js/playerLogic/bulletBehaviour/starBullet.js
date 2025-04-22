class StarBullet {
    constructor(config) {
        this.x = config.x - 12;
        this.y = config.y - 12;
        this.speed = config.speed || 10;
        this.width = config.width || 32;
        this.height = config.height || 32;
        this.rotation = 0;
        this.rotationSpeed = config.rotationSpeed || (3 * Math.PI);
        this.angle = config.angle -Math.PI/2 || -Math.PI/2; // Default to upward
        this.color = Math.max(1, Math.min(config.color || 1, 8)); // Ensure color is between 1-8
        this.damage = config.damage || 8;
        this.image = window.assetLoader?.getImage(`star${this.color}`);
        
        if (!this.image) {
            console.warn(`StarBullet image 'star${this.color}' not found`);
        }
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.rotation += this.rotationSpeed / 60;
    }

    render(ctx) {
        if (!this.image) return;
        
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.drawImage(
            this.image,
            -this.width / 2, -this.height / 2,
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

    checkCollision() {
        // Implement collision detection if needed
        return false;
    }

    getSpawnOffset() {
        // This will be called by the renderer if you want to visualize spawners
        return {
            x: this.spawnerIndex === 1 ? -32 : this.spawnerIndex === 2 ? 32 : 0,
            y: 0
        };
    }
}