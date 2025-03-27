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
    
            // Remove bullets that go off-screen
            if (bullet.isOffScreen()) {
                this.bullets.splice(i, 1);
            }
        }
        // Check for collisions between bullets and static cards
        this.checkCollisions();
    }

    render(ctx) {
        this.bullets.forEach(bullet => {
            bullet.render(ctx);
        });
    }

    // Check for collisions between bullets and static cards
    checkCollisions() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];

            for (let j = cards.length - 1; j >= 0; j--) {
                const card = cards[j];

                if (this.checkCollision(bullet, card)) {
                    if (card.flipCooldown <= 0) {
                        playSoundEffect(soundEffects.hit);

                        card.isAnimating = true;
                        card.targetScaleX = 0;
                        card.flipCooldown = 60;

                        // Remove the bullet after collision
                        this.bullets.splice(i, 1);
                    }
                }
            }
        }
    }

    // Check collision between a bullet and a card
    checkCollision(bullet, card) {
        const cardX = Math.round(card.x);
        const cardY = Math.round(card.y);
    
        if (bullet.isLaser) {
            // Handle laser collision (e.g., check if the laser intersects the card)
            return this.checkLaserCollision(bullet, cardX, cardY, CARD_WIDTH, CARD_HEIGHT);
        } else {
            // Handle regular bullet collision
            return (
                bullet.x < cardX + CARD_WIDTH &&
                bullet.x + bullet.width > cardX &&
                bullet.y < cardY + CARD_HEIGHT &&
                bullet.y + bullet.height > cardY
            );
        }
    }

    checkLaserCollision(laser, cardX, cardY, cardWidth, cardHeight) {
        // Example: Check if the laser line intersects the card rectangle
        // This is a simplified implementation and might need adjustments based on your laser representation
        const laserStart = { x: laser.startX, y: laser.startY };
        const laserEnd = { x: laser.endX, y: laser.endY };
    
        // Check if the laser line intersects the card rectangle
        return this.lineIntersectsRect(laserStart, laserEnd, cardX, cardY, cardWidth, cardHeight);
    }
    
    lineIntersectsRect(start, end, rectX, rectY, rectWidth, rectHeight) {
        // Implement line-rectangle intersection logic
        // This is a placeholder and might need to be replaced with a proper implementation
        // You can use a library or write your own logic for line-rectangle intersection
        return (
            this.pointInRect(start.x, start.y, rectX, rectY, rectWidth, rectHeight) ||
            this.pointInRect(end.x, end.y, rectX, rectY, rectWidth, rectHeight)
        );
    }
    
    pointInRect(x, y, rectX, rectY, rectWidth, rectHeight) {
        return (
            x >= rectX &&
            x <= rectX + rectWidth &&
            y >= rectY &&
            y <= rectY + rectHeight
        );
    }
}