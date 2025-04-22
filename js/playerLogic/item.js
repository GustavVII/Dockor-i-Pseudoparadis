class Item {
    constructor(x, y, type, dropChance = 1) {
        this.x = x - 12; // Half of width (24/2)
        this.y = y - 12; // Half of height (24/2)
        this.type = type;
        this.width = 24;
        this.height = 24;
        this.dropChance = dropChance;
        this.velocityY = -5;
        this.maxSpeed = 5;
        this.active = true;
        this.gravity = 0.1;
        this.collected = false;
    }

    update() {
        if (!this.active) return;

        // Apply gravity
        this.velocityY = Math.min(this.velocityY + this.gravity, this.maxSpeed);
        this.y += this.velocityY;

        // Check if out of bounds
        if (this.y > canvas.height) {
            this.active = false;
        }
    }

    render(ctx) {
        if (!this.active) return;

        const image = window.assetLoader.getImage(this.type);
        if (image) {
            ctx.drawImage(
                image,
                this.x, this.y,
                this.width, this.height
            );
        }
    }

    checkCollision(player) {
        if (!this.active || this.collected) return false;

        return (
            this.x < player.x + player.width/2 &&
            this.x + this.width > player.x - player.width/2 &&
            this.y < player.y + player.height/2 &&
            this.y + this.height > player.y - player.height/2
        );
    }

    collect() {
        if (!this.active || this.collected) return;

        this.applyEffect();
        this.collected = true;
        this.active = false;
    }

    applyEffect() {
        if (!this.active || this.collected) return;

        switch (this.type) {
            case '1up':
                if (playerLives < 8) {
                    updatePlayerLives(playerLives + 1);
                }
                playSoundEffect(soundEffects.extend)
                break;
            case 'bomb':
                if (bombs < 7) {
                    updateBombs(bombs + 1);
                }
                playSoundEffect(soundEffects.bombget);
                break;
            case 'power':
                updatePower(1);
                playSoundEffect(soundEffects.itemget);
                updateScore(10);
                break;
            case 'point':
                updatePoints(1);
                updateScore(10000);
                playSoundEffect(soundEffects.itemget);
                break;
            case 'fragment':
                updatePoints(1);
                updateScore(1000);
                playSoundEffect(soundEffects.itemget);
                break;
            case 'full':
                power = MAX_POWER;
                if (window.shotTypeManager) {
                    window.shotTypeManager.setPower(power);
                }
                updatePlayerStatsDisplay();
                playSoundEffect(soundEffects.powerup);
                break;
        }
    }
}