class HomingCardBullet {
    constructor(config) {
        Object.assign(this, {
            x: config.x - 16,
            y: config.y - 16,
            speed: config.speed || 3,
            angle: (config.angle || 0) - Math.PI/2,
            damage: config.damage || 20,
            width: 32,
            height: 32,
            opacity: config.opacity || 0.8,
            turnRate: (config.turnRate || 1) * (Math.PI / 180),
            spriteRotation: -Math.PI/2
        });

        this.image = window.assetLoader?.getImage(config.image || 'cardBack');
        this.target = null;
    }

    update() {
        this.findTarget();
        
        if (this.target) {
            const targetX = this.target.x + (this.target.width || 0)/2;
            const targetY = this.target.y + (this.target.height || 0)/2;
            const dx = targetX - (this.x + this.width/2);
            const dy = targetY - (this.y + this.height/2);
            const targetAngle = Math.atan2(dy, dx);
            
            let angleDiff = targetAngle - this.angle;
            angleDiff = ((angleDiff + Math.PI) % (2 * Math.PI)) - Math.PI;
            
            if (angleDiff > 0) {
                this.angle += Math.min(this.turnRate, angleDiff);
            } else {
                this.angle -= Math.min(this.turnRate, -angleDiff);
            }
        }

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }

    findTarget() {
        if (this.target || !window.enemyManager) return;
        
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        window.enemyManager.activeEnemies.forEach(enemy => {
            const enemyX = enemy.x + (enemy.width || 0)/2;
            const enemyY = enemy.y + (enemy.height || 0)/2;
            const dx = enemyX - (this.x + this.width/2);
            const dy = enemyY - (this.y + this.height/2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        });
        
        this.target = closestEnemy;
    }

    checkCollision() {
        if (!this.target) return false;
        
        const collided = 
            this.x < this.target.x + (this.target.width || 0) &&
            this.x + this.width > this.target.x &&
            this.y < this.target.y + (this.target.height || 0) &&
            this.y + this.height > this.target.y;
        
        if (collided) {
            this.target.health -= this.damage;
            if (window.playSoundEffect) {
                playSoundEffect(soundEffects.hit);
            }
            return true;
        }
        return false;
    }

    render(ctx) {
        if (!this.image) return;
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.angle + this.spriteRotation);
        ctx.globalAlpha = this.opacity;
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