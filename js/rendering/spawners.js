class SpawnerManager {
    constructor() {
        this.spawners = []; // Visual spawner representations
        this.spawnerData = []; // Logical spawner data for bullet spawning
        this.images = {};
        this.rotationAngle = 0;
        
        // Spawner movement properties
        this.followSpeed = 0.1; // How quickly spawners follow their targets
        
        // Target position offsets (relative to character)
        this.unfocusedOffsets = {
            left: { x: -10, y: -48 },
            right: { x: 10, y: -48 }
        };
        this.focusedOffsets = {
            left: { x: -32, y: 0 },
            right: { x: 32, y: 0 }
        };
        
        // Current actual spawner instances
        this.spawnerInstances = [];
    }

    init() {
        // Load spawner images
        this.images['01'] = window.assetLoader?.getImage('spawner01');
        this.images['02'] = window.assetLoader?.getImage('spawner02');
        this.images['03'] = window.assetLoader?.getImage('spawner03');
        this.images['04'] = window.assetLoader?.getImage('spawner04');
    }

    updateSpawners(characterPos, activeShotTypes, shotTypeManager, isFocusMode) {
        // Clear temporary arrays
        this.spawners = [];
        this.spawnerData = [];

        // Get current target offsets based on focus state
        const currentOffsets = isFocusMode ? this.unfocusedOffsets : this.focusedOffsets;

        activeShotTypes.forEach(shotTypeId => {
            if (shotTypeId === 'base') return;
            
            const shotType = shotTypeManager.shotTypes.shotTypes?.[shotTypeId];
            if (shotType?.useSpawners && shotTypeManager.power >= (shotType.minPowerForSpawners || 8)) {
                // Ensure we have spawner instances for this shot type
                this.ensureSpawnerInstances(shotTypeId, characterPos);
                
                // Update left spawner
                const leftTarget = {
                    x: characterPos.x + currentOffsets.left.x,
                    y: characterPos.y + currentOffsets.left.y
                };
                const leftPos = this.updateSpawnerPosition(shotTypeId + '_left', leftTarget);
                
                // Update right spawner
                const rightTarget = {
                    x: characterPos.x + currentOffsets.right.x,
                    y: characterPos.y + currentOffsets.right.y
                };
                const rightPos = this.updateSpawnerPosition(shotTypeId + '_right', rightTarget);

                // Store data for bullet spawning
                this.spawnerData.push(
                    { x: leftPos.x, y: leftPos.y, type: shotTypeId },
                    { x: rightPos.x, y: rightPos.y, type: shotTypeId }
                );

                // Create visual representations
                this.spawners.push({
                    x: leftPos.x,
                    y: leftPos.y,
                    type: shotTypeId,
                    image: this.images[shotTypeId],
                    isFocused: isFocusMode
                });
                
                this.spawners.push({
                    x: rightPos.x,
                    y: rightPos.y,
                    type: shotTypeId,
                    image: this.images[shotTypeId],
                    isFocused: isFocusMode
                });
            }
        });
    }

    ensureSpawnerInstances(shotTypeId, characterPos) {
        // Create spawner instances if they don't exist
        if (!this.spawnerInstances.find(s => s.id === shotTypeId + '_left')) {
            this.spawnerInstances.push({
                id: shotTypeId + '_left',
                x: characterPos.x + this.unfocusedOffsets.left.x,
                y: characterPos.y + this.unfocusedOffsets.left.y
            });
            
            this.spawnerInstances.push({
                id: shotTypeId + '_right',
                x: characterPos.x + this.unfocusedOffsets.right.x,
                y: characterPos.y + this.unfocusedOffsets.right.y
            });
        }
    }

    updateSpawnerPosition(spawnerId, targetPos) {
        const spawner = this.spawnerInstances.find(s => s.id === spawnerId);
        if (!spawner) return targetPos;
        
        // Move spawner toward target position
        spawner.x += (targetPos.x - spawner.x) * this.followSpeed;
        spawner.y += (targetPos.y - spawner.y) * this.followSpeed;
        
        return { x: spawner.x, y: spawner.y };
    }

    getSpawnerPositions() {
        return this.spawnerData;
    }

    update() {
        // Update rotation (one full rotation per second at 60fps)
        this.rotationAngle += (2 * Math.PI) / 60;
    }

    render(ctx) {
        this.spawners.forEach(spawner => {
            if (!spawner.image) return;
            
            ctx.save();
            ctx.translate(spawner.x, spawner.y);
            ctx.rotate(this.rotationAngle);
            
            // Optional: Add visual distinction when focused
            if (spawner.isFocused) {
                ctx.globalAlpha = 0.9;
            }
            
            // Draw centered (assuming spawner images are 32x32)
            ctx.drawImage(
                spawner.image,
                -8, -8,
                16, 16
            );
            
            ctx.restore();
        });
    }
}