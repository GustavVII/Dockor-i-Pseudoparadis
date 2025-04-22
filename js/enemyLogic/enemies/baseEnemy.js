class BaseEnemy {
    constructor(config) {
        // Basic properties
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 32;
        this.height = config.height || 32;
        this.maxHealth = config.health || 100;
        this.health = this.maxHealth;
        this.isActive = true;
        this.hitFlash = 0;
        this.speed = config.speed || 0; // Default to stationary
        
        // Shooting properties
        this.bulletPatterns = config.bulletPatterns || [];
        this.currentBulletPatternIndex = 0;
        this.shootingEnabled = config.shootingEnabled !== false; // Default true
        
        // Visual properties
        this.imageName = config.imageName;
        this.image = this.imageName ? window.assetLoader?.getImage(this.imageName) : null;
        this.color = config.color || 'red';

        this.bulletCooldown = 0; // frames remaining
        this.frameCount = 0; // tracks frames since last action
    }

    update(deltaTime) {
        if (!this.isActive || window.pauseMenuActive) return;
        
        this.frameCount++;
        
        // Handle hit flash
        if (this.hitFlash > 0) this.hitFlash--;
        
        // Update shooting
        if (this.shootingEnabled && this.bulletPatterns.length > 0) {
            this.updateShooting();
        }
    }

    updateShooting() {
        if (this.bulletCooldown > 0) {
            this.bulletCooldown--;
            return;
        }
    
        const pattern = this.bulletPatterns[this.currentBulletPatternIndex];
        if (!pattern) return;
    
        this.fireCurrentPattern();
        
        // Handle pattern repetition
        if (pattern.repeat === undefined || pattern.repeat === false) {
            // Fire once and remove pattern
            this.bulletPatterns.splice(this.currentBulletPatternIndex, 1);
            if (this.bulletPatterns.length === 0) {
                this.shootingEnabled = false;
            }
        } else {
            // Move to next pattern or repeat
            this.currentBulletPatternIndex = 
                (this.currentBulletPatternIndex + 1) % this.bulletPatterns.length;
            
            // Set cooldown only if specified
            this.bulletCooldown = pattern.cooldown || 0;
            
            // Handle finite repeats
            if (typeof pattern.repeat === 'number' && pattern.repeat > 0) {
                pattern.repeat--;
                if (pattern.repeat <= 0) {
                    this.bulletPatterns.splice(this.currentBulletPatternIndex, 1);
                    if (this.bulletPatterns.length === 0) {
                        this.shootingEnabled = false;
                    }
                }
            }
        }
    }

    fireCurrentPattern() {
        const pattern = this.bulletPatterns[this.currentBulletPatternIndex];
        if (!pattern || !window.enemyBulletManager) return;

        const centerX = this.x + this.width/2;
        const centerY = this.y + this.height/2;

        window.enemyBulletManager.addPattern(
            pattern.name,
            centerX,
            centerY,
            {
                bulletType: pattern.bulletType,
                speed: pattern.speed || 2,
                damage: pattern.damage || 10,
                behavior: pattern.behavior,
                behaviorParams: pattern.behaviorParams
            },
            window.characterManager?.cursor
        );

        if (window.playSoundEffect) {
            window.playSoundEffect(soundEffects.enemyShot);
        }
    }

    takeDamage(amount) {
        if (!this.isActive) return;
        
        this.health -= amount;
        this.hitFlash = 10;
        
        if (window.playSoundEffect) {
            window.playSoundEffect(soundEffects.hit);
        }
        
        if (this.health <= 0) {
            this.destroy();
        }
    }

    destroy() {
        if (!this.isActive) return;
        
        this.isActive = false;
        
        if (window.playSoundEffect) {
            window.playSoundEffect(soundEffects.destroy);
        }
        
        if (window.particleManager) {
            window.particleManager.spawnParticles({
                x: this.x + this.width/2,
                y: this.y + this.height/2,
                count: 20,
                color: this.color === 'red' ? '#ff0000' : '#0000ff',
                speed: 1,
                lifetime: 30
            });
        }
        
        if (window.itemManager) {
            window.itemManager.spawnItem(
                this.x + this.width/2,
                this.y + this.height/2,
                'power'
            );
        }
    }

    shouldDespawn() {
        return !this.isActive || 
               this.y < -100 || this.y > canvas.height + 100 || 
               this.x < -100 || this.x > canvas.width + 100;
    }

    render(ctx) {
        if (!this.image) {
            // Fallback rendering
            ctx.fillStyle = this.hitFlash > 0 ? 'white' : this.color;
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI*2);
            ctx.fill();
        } else {
            ctx.save();
            if (this.hitFlash > 0) {
                ctx.filter = 'brightness(200%)';
            }
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.restore();
        }

        // Draw health bar
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? 'lime' :
            healthPercent > 0.2 ? 'yellow' : 'red';
        ctx.fillRect(
            this.x,
            this.y - 10,
            this.width * healthPercent,
            5
        );
    }
}