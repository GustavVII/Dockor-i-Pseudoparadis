class ShotTypeManager {
    constructor() {
        this.cooldownCounter = 0;
        this.baseCooldown = 5;
        this.currentCooldown = this.baseCooldown;
        this.power = 0;
        this.damage = 10;
        this.currentSpawnPattern = this.singleCardPattern;
    }

    singleCardPattern = () => [{ xOffset: 0, yOffset: 0 }];
    doubleCardPattern = () => [
        { xOffset: -16, yOffset: 0 },
        { xOffset: 16, yOffset: 0 }
    ];
    tripleCardPattern = () => [
        { xOffset: -24, yOffset: 0 },
        { xOffset: 0, yOffset: -10 },
        { xOffset: 24, yOffset: 0 }
    ];
    quadCardPattern = () => [
        { xOffset: -32, yOffset: 0 },
        { xOffset: -12, yOffset: -10 },
        { xOffset: 12, yOffset: -10 },
        { xOffset: 32, yOffset: 0 }
    ];

    setPower(power) {
        this.power = Math.min(power, 128);
        
        if (power >= 128) {
            this.damage = 24;
            this.currentCooldown = this.baseCooldown + 1;
            this.currentSpawnPattern = this.quadCardPattern;
        } else if (power >= 112) {
            this.damage = 20;
            this.currentCooldown = this.baseCooldown;
            this.currentSpawnPattern = this.tripleCardPattern;
        } else if (power >= 80) {
            this.damage = 20;
            this.currentCooldown = this.baseCooldown - 1;
            this.currentSpawnPattern = this.tripleCardPattern;
        } else if (power >= 48) {
            this.damage = 16;
            this.currentCooldown = this.baseCooldown;
            this.currentSpawnPattern = this.doubleCardPattern;
        } else if (power >= 16) {
            this.damage = 12;
            this.currentCooldown = this.baseCooldown - 1;
            this.currentSpawnPattern = this.singleCardPattern;
        } else {
            this.damage = 10;
            this.currentCooldown = this.baseCooldown;
            this.currentSpawnPattern = this.singleCardPattern;
        }
    }

    update() {
        if (this.cooldownCounter > 0) this.cooldownCounter--;
    }

    shoot(cursor) {
        if (!cursor || this.cooldownCounter > 0) return;
        
        this.currentSpawnPattern().forEach(pos => {
            const x = cursor.x + cursor.width / 2 + pos.xOffset;
            const y = cursor.y + pos.yOffset;
            const bullet = CardBullet.create(x, y, this.damage);
            if (window.bulletManager) {
                window.bulletManager.addBullet(bullet);
            }
        });
        
        this.cooldownCounter = this.currentCooldown;
        if (window.playSoundEffect) {
            playSoundEffect(soundEffects.shot);
        }
    }
}