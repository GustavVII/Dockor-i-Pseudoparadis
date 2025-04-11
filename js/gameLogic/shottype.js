class ShotTypeManager {
    constructor() {
        this.cooldownCounter = 0;
        this.power = 0;
        this.shotTypes = {};
        this.activeShotTypes = new Map();
        this.currentCooldown = 5;
        this.currentPattern = 'single';
        this.damage = 10;
    }

    async loadShotTypes() {
        try {
            const response = await fetch('data/shottypes.json');
            this.shotTypes = await response.json();
            this.initializeShotTypes();
        } catch (error) {
            console.error('Error loading shot types:', error);
            this.shotTypes = { shotTypes: {} };
        }
    }

    initializeShotTypes() {
        this.activeShotTypes.clear();
        
        // Always activate base shot
        this.activeShotTypes.set('base', {
            type: 'pattern',
            cooldown: 0
        });

        // Activate other shot types based on power
        for (const [id, config] of Object.entries(this.shotTypes.shotTypes || {})) {
            if (id === 'base') continue;
            
            const stage = this.getCurrentPowerStage(config.powerStages);
            if (stage) {
                this.activeShotTypes.set(id, {
                    type: config.type,
                    cooldown: 0,
                    config: stage
                });
            }
        }
    }

    setPower(power) {
        this.power = Math.min(Math.max(power, 0), 128);
        this.updateShotProperties();
        this.initializeShotTypes(); // Re-evaluate active shot types
    }

    updateShotProperties() {
        const baseConfig = this.shotTypes.shotTypes?.base;
        if (baseConfig) {
            const baseStage = this.getCurrentPowerStage(baseConfig.powerStages);
            if (baseStage) {
                this.damage = baseStage.damage;
                this.currentCooldown = baseStage.cooldown;
                this.currentPattern = baseStage.pattern;
            }
        }
    }

    getCurrentPowerStage(powerStages) {
        if (!powerStages) return null;
        return powerStages.reduce((current, stage) => {
            return (this.power >= stage.minPower && 
                   (!current || stage.minPower > current.minPower)) 
                   ? stage : current;
        }, null);
    }

    shoot(cursor) {
        if (!cursor || this.cooldownCounter > 0) return;

        // Fire all active shot types
        for (const [id, shotType] of this.activeShotTypes) {
            if (shotType.cooldown > 0) continue;

            switch(shotType.type) {
                case 'pattern':
                    this.firePattern(cursor);
                    break;
                    
                case 'homing':
                    this.fireHomingCards(cursor, shotType.config);
                    break;
                    
                // Add other shot type handlers here
            }
        }

        this.cooldownCounter = this.currentCooldown;
        if (window.playSoundEffect) {
            playSoundEffect(soundEffects.shot);
        }
    }

    firePattern(cursor) {
        const bullets = CardBullet.createPattern(
            this.currentPattern,
            cursor.x + cursor.width/2,
            cursor.y,
            this.damage
        );
        
        bullets.forEach(bullet => {
            if (window.bulletManager) {
                window.bulletManager.addBullet(bullet);
            }
        });
    }

    fireHomingCards(cursor, config) {
        config.angles.forEach(angle => {
            const bullet = new HomingCardBullet({
                x: cursor.x + cursor.width/2,
                y: cursor.y - 20,
                angle: angle,
                damage: config.damage,
                speed: config.speed,
                turnRate: config.turnRate,
                image: config.image || 'cardBack'
            });
            
            if (window.bulletManager) {
                window.bulletManager.addBullet(bullet);
            }
        });
        
        // Set individual cooldown for this shot type
        this.activeShotTypes.get('01').cooldown = config.cooldown;
    }

    update() {
        if (this.cooldownCounter > 0) this.cooldownCounter--;
        
        // Update cooldowns for all active shot types
        for (const [id, shotType] of this.activeShotTypes) {
            if (shotType.cooldown > 0) {
                shotType.cooldown--;
            }
        }
    }
}