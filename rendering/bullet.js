class BulletRenderer {
    renderBullets(ctx, bullets) {
        bullets.forEach((bullet) => {
            if (bullet.render) {
                bullet.render(ctx);
            } else {
                console.error("Bullet does not have a render method:", bullet);
            }
        });
    }
}