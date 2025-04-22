class BulletManager {
    constructor() {
        this.bullets = [];
        this.bulletClasses = {
            'card': CardBullet,
            'homingCard': HomingCardBullet,
            'star': StarBullet
        };
    }

    registerBulletType(type, bulletClass) {
        this.bulletClasses[type] = bulletClass;
    }

    createBullet(type, config) {
        const BulletClass = this.bulletClasses[type];
        if (!BulletClass) {
            console.error(`Bullet type ${type} not registered`);
            return null;
        }
        return new BulletClass(config);
    }

    addBullet(type, config) {
        const bullet = this.createBullet(type, config);
        if (bullet) {
            this.bullets.push(bullet);
        }
        return bullet;
    }

    spawnBullets(type, configs) {
        return configs.map(config => this.addBullet(type, config));
    }

    checkCollisions() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            for (let j = window.enemyManager.activeEnemies.length - 1; j >= 0; j--) {
                const enemy = window.enemyManager.activeEnemies[j];
                
                if (this.checkAABBCollision(
                    { x: bullet.x, y: bullet.y, width: bullet.width, height: bullet.height },
                    { x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height }
                )) {
                    const wasLowHealth = enemy.health <= enemy.maxHealth * 0.2;
                    enemy.takeDamage(bullet.damage);
                    this.bullets.splice(i, 1);
                    
                    if (enemy.health <= 0) {
                        // Call destroy on the enemy first
                        enemy.destroy();
                        // Then remove from enemy manager
                        window.enemyManager.activeEnemies.splice(j, 1);
                    }
                    break;
                }
            }
        }
    }

    checkAABBCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    update() {
        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update();
            
            if (bullet.isOffScreen()) {
                this.bullets.splice(i, 1);
            }
        }
        
        // Check collisions after all bullets have moved
        this.checkCollisions();
    }

    render(ctx) {
        this.bullets.forEach(bullet => bullet.render(ctx));
    }
}