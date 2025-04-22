class EnemyBullet {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 16;
        this.height = config.height || 16;
        this.speed = config.speed || 2;
        this.angle = config.angle || 0;
        this.delay = config.delay || 0;
        this.behavior = config.behavior || 'linear';
        this.behaviorParams = config.behaviorParams || {};
        this.target = config.target || null;
        
        // Ensure bulletType is properly set
        this.bulletType = config.bulletType || 'ErrorBullet';
        this.image = window.assetLoader?.getImage(this.bulletType);
        
        // Debug log to verify the bullet type
        console.log(`Creating bullet of type: ${this.bulletType}`);
        
        if (!this.image) {
            console.warn(`Bullet image not found for type: ${this.bulletType}`);
            this.bulletType = 'ErrorBullet';
            this.image = window.assetLoader?.getImage(this.bulletType);
        }

        this.active = this.delay <= 0;
        this.velocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        };
    }

    update() {
        if (!this.active) {
            this.delay--;
            this.active = this.delay <= 0;
            return;
        }

        if (window.BulletBehaviors?.[this.behavior]) {
            window.BulletBehaviors[this.behavior](this);
        } else {
            // Fallback to linear behavior
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        }
    }

    render(ctx) {
        if (!this.active) return;
        
        if (!this.image) {
            // Fallback rendering
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width/2, 0, Math.PI*2);
            ctx.fill();
        } else {
            ctx.save();
            ctx.translate(this.x, this.y);
            
            // Always face movement direction
            const movementAngle = Math.atan2(
                Math.sin(this.angle) * this.speed,
                Math.cos(this.angle) * this.speed
            );
            
            // Adjust rotation for sprite orientation (add 90° if needed)
            ctx.rotate(movementAngle + Math.PI/2);
            
            ctx.drawImage(
                this.image, 
                -this.width/2, 
                -this.height/2, 
                this.width, 
                this.height
            );
            ctx.restore();
        }
    }

    isOffScreen() {
        const margin = 200;
        return (
            this.y < -margin || 
            this.y > (window.canvas?.height || 670) + margin ||
            this.x < -margin || 
            this.x > (window.canvas?.width || 574) + margin
        );
    }
}