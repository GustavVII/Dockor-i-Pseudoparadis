class BulletManager {
    constructor() {
        this.bullets = []; // Array to store all active bullets
    }

    addBullet(bullet) {
        this.bullets.push(bullet);
    }

    update() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update();

            // Remove bullets that are off-screen
            if (bullet.isOffScreen()) {
                this.bullets.splice(i, 1);
            }
        }
    }

    render(ctx) {
        this.bullets.forEach(bullet => bullet.render(ctx));
    }

    renderBullets(ctx, bullets) {
        console.log("Rendering bullets with context:", ctx);
        bullets.forEach((bullet) => {
            if (bullet.image) {
                bullet.render(ctx);
            }
        });
    }
}