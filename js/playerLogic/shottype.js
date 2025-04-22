class ShotTypeManager {
    constructor() {
        this.cooldownCounters = {};
        this.power = 0;
        this.shotTypes = {};
        this.characterShotType = null;
        this.sequentialFireCounters = {};
    }

    async loadShotTypes() {
        try {
            const response = await fetch('data/shottypes.json');
            this.shotTypes = await response.json();
            // Initialize cooldown counters for all shot types
            Object.keys(this.shotTypes.shotTypes || {}).forEach(shotTypeId => {
                this.cooldownCounters[shotTypeId] = 0;
            });
        } catch (error) {
            console.error('Error loading shot types:', error);
            this.shotTypes = { shotTypes: {} };
        }
    }

    setCharacter(character) {
        this.characterShotType = character?.shotTypeId || null;
        this.updateActiveShotTypes();
    }

    updateActiveShotTypes() {
        // Always include base shot
        this.activeShotTypes = ['base'];
        
        // Add character-specific shot if available
        if (this.characterShotType) {
            this.activeShotTypes.push(this.characterShotType);
        }
    }

    setPower(power) {
        this.power = Math.min(Math.max(power, 0), 128);
        this.updateShotProperties();
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

    shoot(cursor, focusMode = false) {
        let baseShotFired = false;

        // Fire all active shot types
        this.activeShotTypes.forEach(shotTypeId => {
            const shotType = this.shotTypes.shotTypes?.[shotTypeId];
            if (!shotType) return;

            // Check individual cooldown
            if (this.cooldownCounters[shotTypeId] > 0) return;

            const stage = this.getCurrentPowerStage(shotType.powerStages);
            if (!stage) return;

            // Track if base shot is being fired
            if (shotTypeId === 'base') {
                baseShotFired = true;
            }

            // Initialize sequential fire counter if needed
            if (shotType.sequentialFire && !this.sequentialFireCounters[shotTypeId]) {
                this.sequentialFireCounters[shotTypeId] = 0;
            }

            // Check if we should use spawners
            const useSpawners = shotType.useSpawners && 
                              this.power >= (shotType.minPowerForSpawners || 8);

            // Get spawn positions
            const spawnPositions = this.getSpawnPositions(cursor, useSpawners);

            // Handle focus mode angle adjustment
            let angles = [...stage.angles];
            if (focusMode) {
                angles = angles.map(angle => angle * 0.5);
            }

            // Create bullet configs
            const configs = this.createBulletConfigs(
                shotTypeId,
                spawnPositions,
                angles,
                stage,
                shotType,
                focusMode
            );

            // Spawn bullets
            if (configs.length > 0) {
                window.bulletManager?.spawnBullets(shotType.bulletType, configs);
                // Set individual cooldown
                this.cooldownCounters[shotTypeId] = stage.cooldown;
            }
        });

        if (baseShotFired && window.playSoundEffect) {
            playSoundEffect(soundEffects.shot);
        }
    }

    getSpawnPositions(cursor, useSpawners) {
        if (!useSpawners) {
            return [{ x: cursor.x, y: cursor.y }];
        }
        
        // Get current spawner positions from SpawnerManager
        const spawnerPositions = window.spawnerManager?.getSpawnerPositions() || [];
        return spawnerPositions.map(pos => ({
            x: pos.x,
            y: pos.y,
            spawnerIndex: pos.x > cursor.x ? 2 : 1, // 1 for left, 2 for right
            type: pos.type
        }));
    }

    createBulletConfigs(shotTypeId, spawnPositions, angles, stage, shotType, focusMode) {
        const configs = [];
        const shotTypeConfig = this.shotTypes.shotTypes?.[shotTypeId];
        
        if (!shotTypeConfig.sequentialFire) {
            // Fire all angles simultaneously with mirrored angles for right spawner
            spawnPositions.forEach((pos, posIndex) => {
                angles.forEach((angle, angleIndex) => {
                    // Mirror angles for right spawner (odd position indices)
                    const finalAngle = posIndex % 2 === 1 ? -angle : angle;
                    
                    configs.push({
                        x: pos.x,
                        y: pos.y,
                        angle: finalAngle * (Math.PI / 180),
                        damage: stage.damage,
                        color: stage.colors?.[angleIndex % stage.colors?.length] || 1,
                        ...shotType.bulletConfig,
                        isFocused: focusMode,
                        spawnerIndex: pos.spawnerIndex
                    });
                });
            });
        } else {
            // Sequential firing - get current index from counter
            const seqIndex = this.sequentialFireCounters[shotTypeId] % angles.length;
            const angle = angles[seqIndex];
            
            spawnPositions.forEach((pos, posIndex) => {
                // Mirror angle for right spawner (odd position indices)
                const finalAngle = posIndex % 2 === 1 ? -angle : angle;
                
                configs.push({
                    x: pos.x,
                    y: pos.y,
                    angle: finalAngle * (Math.PI / 180),
                    damage: stage.damage,
                    color: stage.colors?.[seqIndex % stage.colors?.length] || 1,
                    ...shotType.bulletConfig,
                    isFocused: focusMode,
                    spawnerIndex: pos.spawnerIndex
                });
            });
            
            // Increment counter for next shot
            this.sequentialFireCounters[shotTypeId]++;
        }
        
        return configs;
    }

    update() {
        // Decrement all cooldowns
        Object.keys(this.cooldownCounters).forEach(shotTypeId => {
            if (this.cooldownCounters[shotTypeId] > 0) {
                this.cooldownCounters[shotTypeId]--;
            }
        });
        
        // Decrement homing cooldown if still using it
        if (this.homingCooldown > 0) this.homingCooldown--;
    }
}