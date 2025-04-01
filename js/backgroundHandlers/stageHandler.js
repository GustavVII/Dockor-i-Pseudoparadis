class StageHandler {
    constructor() {
        this.currentStage = null;
        this.currentPhase = null;
        this.currentBackground = null;
        this.backgroundOffsetX = 0;
        this.backgroundOffsetY = 0;
        this.enemies = [];
        this.activeBullets = [];
        this.phaseStartTime = 0;
    }

    async loadStage(stageId) {
        console.log(`Loading stage: ${stageId}`);
        
        // Get stage data
        this.currentStage = window[`${stageId}Data`];
        if (!this.currentStage) {
            console.error(`Stage data not found for ${stageId}`);
            return false;
        }

        // Load first phase
        await this.loadPhase(this.currentStage.phases[0].id);
        
        // Play stage music
        if (window.playMusic) {
            window.playMusic(`assets/music/DiPP_${this.currentStage.music}.mp3`);
        }

        console.log(`Stage loaded: ${this.currentStage.levelName}`);
        return true;
    }

    async loadPhase(phaseId) {
        const phase = this.currentStage.phases.find(p => p.id === phaseId);
        if (!phase) {
            console.error(`Phase ${phaseId} not found in stage`);
            return false;
        }

        this.currentPhase = phase;
        this.phaseStartTime = Date.now();

        // Load background
        const bgData = this.currentStage.backgrounds.find(b => b.id === phase.background);
        if (bgData) {
            await this.loadBackground(bgData);
        }

        // Load enemies
        if (window[phase.enemies]) {
            this.enemies = this.parseEnemyData(window[phase.enemies]);
        }

        console.log(`Phase loaded: ${phaseId}`);
        return true;
    }

    async loadBackground(bgData) {
        console.log(`Loading background: ${bgData.id}`);
        
        // The key should match what we used in assetLoad.js
        const bgKey = `${bgData.id}_bg`; // e.g. "bg1_bg"
        
        // Check if already loaded
        if (!window.assetLoader.getImage(bgKey)) {
            console.error(`Background image ${bgKey} not loaded!`);
            return false;
        }
        
        this.currentBackground = bgData;
        this.backgroundOffsetX = 0;
        this.backgroundOffsetY = 0;
        return true;
    }

    parseEnemyData(enemyData) {
        // This will convert the stage progression data into actionable enemies
        const parsedEnemies = [];
        
        // Example parsing logic - you'll need to expand this based on your exact data structure
        enemyData.enemyPhase1.forEach(enemyGroup => {
            for (let i = 0; i < enemyGroup.amount; i++) {
                parsedEnemies.push({
                    type: enemyGroup.enemyType,
                    color: enemyGroup.colour,
                    bulletType: enemyGroup.bulletType,
                    behavior: enemyGroup.bulletBehaviour,
                    health: enemyGroup.health || this.currentStage.defaultEnemyBehavior.health,
                    spawnX: enemyGroup.spawnX,
                    spawnY: enemyGroup.spawnY,
                    spawnDelay: enemyGroup.spawnDelay * i,
                    movement: enemyGroup.goToLocations
                });
            }
        });
        
        return parsedEnemies;
    }

    update(deltaTime) {
        if (!this.currentBackground) return;

        // Update background scrolling
        this.backgroundOffsetX += this.currentBackground.scrollSpeedX * deltaTime / 1000;
        this.backgroundOffsetY += this.currentBackground.scrollSpeedY * deltaTime / 1000;

        // Update enemies
        this.updateEnemies(deltaTime);
        
        // Update bullets
        this.updateBullets(deltaTime);
    }

    updateEnemies(deltaTime) {
        const currentTime = Date.now() - this.phaseStartTime;
        
        this.enemies.forEach(enemy => {
            if (!enemy.spawned && currentTime >= enemy.spawnDelay) {
                enemy.spawned = true;
                enemy.x = enemy.spawnX;
                enemy.y = enemy.spawnY;
                console.log(`Spawning enemy at ${enemy.x}, ${enemy.y}`);
            }
            
            if (enemy.spawned) {
                this.updateEnemyMovement(enemy, deltaTime);
            }
        });
    }

    updateEnemyMovement(enemy, deltaTime) {
        // Implement enemy movement logic based on goToLocations
        // This is simplified - you'll need to expand it
        if (enemy.movement && enemy.movement.length > 0) {
            const target = enemy.movement[0];
            const dx = target.x - enemy.x;
            const dy = target.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) {
                enemy.x += (dx / distance) * target.speed;
                enemy.y += (dy / distance) * target.speed;
            } else {
                // Reached target - handle arrival actions
                enemy.movement.shift();
            }
        }
    }

    updateBullets(deltaTime) {
        // Update bullet positions and check collisions
        this.activeBullets.forEach(bullet => {
            bullet.x += bullet.vx * deltaTime / 1000;
            bullet.y += bullet.vy * deltaTime / 1000;
            
            // Check if bullet is off-screen
            if (bullet.y > canvas.height || bullet.y < 0 || 
                bullet.x > canvas.width || bullet.x < 0) {
                bullet.active = false;
            }
        });
        
        // Remove inactive bullets
        this.activeBullets = this.activeBullets.filter(b => b.active);
    }

    draw(ctx, interpolationFactor = 0) {
        if (!this.currentBackground) return;
    
        const bgKey = `${this.currentBackground.id}_bg`;
        const bgImage = window.assetLoader.getImage(bgKey);
        
        if (!bgImage) {
            console.error(`Background image ${bgKey} not found!`);
            return;
        }
    
        // Calculate interpolated positions
        const interpolatedOffsetX = this.backgroundOffsetX + 
            (this.currentBackground.scrollSpeedX * interpolationFactor);
        const interpolatedOffsetY = this.backgroundOffsetY + 
            (this.currentBackground.scrollSpeedY * interpolationFactor);
    
        // Draw the background
        ctx.drawImage(
            bgImage,
            -interpolatedOffsetX % bgImage.width, 
            -interpolatedOffsetY % bgImage.height,
            bgImage.width,
            bgImage.height
        );
        
        // If needed, draw additional copies for seamless tiling
        // ... (add additional draw calls if the image doesn't cover the whole canvas)
    }

    drawEnemies(ctx) {
        this.enemies.forEach(enemy => {
            if (enemy.spawned) {
                // Simple rectangle for now - replace with actual sprites
                ctx.fillStyle = enemy.color || 'red';
                ctx.fillRect(enemy.x - 16, enemy.y - 16, 32, 32);
            }
        });
    }

    drawBullets(ctx) {
        this.activeBullets.forEach(bullet => {
            ctx.fillStyle = bullet.color || 'white';
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

const stageHandler = new StageHandler();
window.stageHandler = stageHandler;