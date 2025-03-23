class SpawnerManager {
    constructor() {
        this.spawnerImages = [];
        this.spawnerImagesLoaded = false;
        this.animationFrame = 0;
        this.NUM_ANIMATION_FRAMES = 4;
        this.animationSpeed = 2;
        this.baseAnimationSpeed = 2;

        this.currentSpawnerPositions = [];
        this.targetSpawnerPositions = [];
        this.transitionStartTime = 0;
        this.transitionDuration = 30;
        this.elapsedTime = 0;
    }

    async loadSpawnerImages() {
        for (let i = 1; i <= this.NUM_ANIMATION_FRAMES; i++) {
            const image = await loadImage(`assets/graphics/spawners/spawn${i}.png`);
            this.spawnerImages.push(image);
        }
        this.spawnerImagesLoaded = true;
    }

    updateAnimation() {
        this.animationFrame = (this.animationFrame + 1) % (this.NUM_ANIMATION_FRAMES * this.animationSpeed);
    }

    getCurrentSpawnerImageIndex() {
        const index = Math.floor(this.animationFrame / this.animationSpeed);
        return index % this.NUM_ANIMATION_FRAMES;
    }

    updateAnimationSpeed(powerLevel) {
        switch (powerLevel) {
            case 0:
                this.animationSpeed = this.baseAnimationSpeed;
                break;
            case 1:
                this.animationSpeed = this.baseAnimationSpeed + 1;
                break;
            case 2:
                this.animationSpeed = this.baseAnimationSpeed + 2;
                break;
            case 3:
                this.animationSpeed = this.baseAnimationSpeed + 3;
                break;
        }
    }

    updateSpawnerPositions() {
        if (this.currentSpawnerPositions.length === 0) {
            this.currentSpawnerPositions = this.targetSpawnerPositions;
            return;
        }
    
        this.elapsedTime += frameTime;
    
    
        if (this.elapsedTime < this.transitionDuration) {
            const progress = this.elapsedTime / this.transitionDuration;
    
            this.currentSpawnerPositions = this.currentSpawnerPositions.map((currentPos, index) => {
                const targetPos = this.targetSpawnerPositions[index];
                return {
                    xOffset: currentPos.xOffset + (targetPos.xOffset - currentPos.xOffset) * progress,
                    yOffset: currentPos.yOffset + (targetPos.yOffset - currentPos.yOffset) * progress,
                };
            });
        } else {
            this.currentSpawnerPositions = this.targetSpawnerPositions;        }
    }

    setSpawnerPositions(spawnPositions) {
        this.currentSpawnerPositions = this.currentSpawnerPositions.map(pos => ({ ...pos }));
    
        this.targetSpawnerPositions = spawnPositions.map(pos => ({ ...pos }));
    
        this.elapsedTime = 0;
    }

    renderSpawners(ctx, cursor, powerLevel) {
        if (!cursor.isActive || !this.spawnerImagesLoaded || this.spawnerImages.length === 0) {
            return;
        }
    
        this.updateSpawnerPositions();
    
        const currentImageIndex = this.getCurrentSpawnerImageIndex();
    
        this.currentSpawnerPositions.forEach(({ xOffset, yOffset }) => {
            const spawnerX = Math.round((cursor.x + cursor.width / 2 + xOffset));
            const spawnerY = Math.round((cursor.y + yOffset));
    
            const spawnerImage = this.spawnerImages[currentImageIndex];
    
            ctx.drawImage(
                spawnerImage,
                0, 0, 32, 32,
                spawnerX - 16, spawnerY - 16, 32, 32
            );
        });
    }
}

const spawnerManager = new SpawnerManager();