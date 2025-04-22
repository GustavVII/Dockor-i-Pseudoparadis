class EnemyBulletManager {
    constructor() {
        this.bullets = [];
        this.pendingBullets = [];
    }

    addBullet(bullet) {
        if (bullet.delay > 0) {
            this.pendingBullets.push(bullet);
        } else {
            this.bullets.push(bullet);
        }
    }

    addPattern(patternName, x, y, bulletConfig, target) {
        // Get the pattern from your loaded patterns
        const pattern = window.patternDatabase?.[patternName];
        if (!pattern) {
            console.error(`Pattern ${patternName} not found`);
            return;
        }
    
        // Generate bullets using the PatternProcessor
        const bullets = PatternProcessor.generatePattern(
            x, y,
            {
                ...pattern,
                bulletType: bulletConfig.bulletType || pattern.bulletType,
                speed: bulletConfig.speed || pattern.speed,
                behavior: bulletConfig.behavior || pattern.behavior,
                behaviorParams: bulletConfig.behaviorParams || pattern.behaviorParams
            },
            target
        );
    
        // Add all generated bullets
        bullets.forEach(bullet => this.addBullet(bullet));
    }

    update() {
        // Process pending bullets
        for (let i = this.pendingBullets.length - 1; i >= 0; i--) {
            this.pendingBullets[i].delay--;
            if (this.pendingBullets[i].delay <= 0) {
                this.bullets.push(this.pendingBullets[i]);
                this.pendingBullets.splice(i, 1);
            }
        }

        // Update active bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update();
            
            if (bullet.isOffScreen()) {
                this.bullets.splice(i, 1);
            }
        }
    }

    render(ctx) {
        this.bullets.forEach(bullet => {
            if (bullet.active !== false) {
                // Render bullet based on its type
                const img = window.assetLoader?.getImage(bullet.bulletType);
                if (img) {
                    ctx.save();
                    ctx.translate(bullet.x, bullet.y);
                    ctx.rotate(bullet.angle + Math.PI/2); // Adjust rotation if needed
                    ctx.drawImage(img, -bullet.width/2, -bullet.height/2, bullet.width, bullet.height);
                    ctx.restore();
                } else {
                    // Fallback rendering
                    ctx.fillStyle = 'red';
                    ctx.beginPath();
                    ctx.arc(bullet.x, bullet.y, bullet.width/2, 0, Math.PI*2);
                    ctx.fill();
                }
            }
        });
    }
}