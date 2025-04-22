class SpinnerEnemy extends BaseEnemy {
    constructor(config) {
        super({
            ...config,
            width: 32,
            height: 32,
            health: 150
        });
        
        this.image = window.assetLoader?.getImage(`spinner`);
        this.rotationSpeed =  0.1;
        this.rotation = 0;
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.rotation += this.rotationSpeed;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        if (this.hitFlash > 0) ctx.filter = 'brightness(200%)';
        ctx.rotate(this.rotation);
        ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();
    }
}