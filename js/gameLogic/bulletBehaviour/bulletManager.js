class BulletManager {
    constructor() {
        this.bullets = [];
    }

    addBullet(bullet) {
        this.bullets.push(bullet);
    }

    update() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update();
            
            if (bullet.isOffScreen()) {
                this.bullets.splice(i, 1);
            }
        }
    }

    render(ctx) {
        this.bullets.forEach(bullet => bullet.render(ctx));
    }
}