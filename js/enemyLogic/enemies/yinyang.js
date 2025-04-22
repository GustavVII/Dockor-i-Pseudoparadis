class YinyangEnemy extends BaseEnemy {
    static colors = ['red', 'green', 'blue'];
    
    constructor(config) {
        const color = YinyangEnemy.colors.includes(config.color) ? config.color : 'red';
        
        super({
            ...config,
            color: color,
            width: 32,
            height: 32,
            health: 200
        });
        
        this.yinyangImage = window.assetLoader?.getImage(`${color}Yinyang`);
        this.auraImage = window.assetLoader?.getImage(`${color}AuraYinyang`);
        this.yinyangRotation = 0;
        this.auraRotation = 0;
        this.yinyangSpeed = config.yinyangSpeed || 0.05;
        this.auraSpeed = config.auraSpeed || -0.2;
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        // Update rotations
        this.yinyangRotation += this.yinyangSpeed;
        this.auraRotation += this.auraSpeed;
    }

    render(ctx) {
        if (!this.yinyangImage || !this.auraImage) {
            super.render(ctx);
            return;
        }
        
        // Draw aura
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        if (this.hitFlash > 0) ctx.filter = 'brightness(200%)';
        ctx.rotate(this.auraRotation);
        ctx.drawImage(this.auraImage, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();
        
        // Draw yinyang
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        if (this.hitFlash > 0) ctx.filter = 'brightness(200%)';
        ctx.rotate(this.yinyangRotation);
        ctx.drawImage(this.yinyangImage, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();
    }
}