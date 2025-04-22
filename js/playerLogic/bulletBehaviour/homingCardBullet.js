class HomingCardBullet {
    constructor(config) {
        this.x = config.x - 16; // Center adjustment
        this.y = config.y - 16;
        this.speed = config.speed || 15;
        this.angle = config.angle - Math.PI / 2;
        this.damage = config.damage;
        this.width = 32;
        this.height = 32;
        this.opacity = config.opacity || 0.8;
        this.turnRate = (config.turnRate || 8) * (Math.PI / 180);
        this.target = null;
        this.spriteRotation = -Math.PI / 2;

        this.image = window.assetLoader?.getImage(`cardBack`);
    }

    findTarget() {
        // Clear target if it's no longer active
        if (this.target && (!this.target.isActive || !window.enemyManager.activeEnemies.includes(this.target))) {
            this.target = null;
        }

        if (this.target || !window.enemyManager) return;

        let closestEnemy = null;
        let closestDistance = Infinity;

        window.enemyManager.activeEnemies.forEach(enemy => {
            // Only target active enemies
            if (!enemy.isActive) return;

            const enemyX = enemy.x + (enemy.width || 0) / 2;
            const enemyY = enemy.y + (enemy.height || 0) / 2;
            const dx = enemyX - (this.x + this.width / 2);
            const dy = enemyY - (this.y + this.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        });

        this.target = closestEnemy;
    }

    update() {
        this.findTarget();

        if (this.target) {
            // Verify target is still valid
            if (!this.target.isActive || !window.enemyManager.activeEnemies.includes(this.target)) {
                this.target = null;
                return;
            }

            const targetX = this.target.x + (this.target.width || 0) / 2;
            const targetY = this.target.y + (this.target.height || 0) / 2;
            const dx = targetX - (this.x + this.width / 2);
            const dy = targetY - (this.y + this.height / 2);
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


    render(ctx) {
        if (!this.image) return;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle + this.spriteRotation);
        ctx.globalAlpha = this.opacity;
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

    getSpawnOffset() {
        // This will be called by the renderer if you want to visualize spawners
        return {
            x: this.spawnerIndex === 1 ? -32 : this.spawnerIndex === 2 ? 32 : 0,
            y: 0
        };
    }
}