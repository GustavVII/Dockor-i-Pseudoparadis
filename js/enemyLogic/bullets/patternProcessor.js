class PatternProcessor {
    static generatePattern(centerX, centerY, config, target) {
        const allBullets = [];
        const patternDuration = config.shotsCount * config.shotDelay;
        let repeatCount = 0;
        
        // Store the getTarget function if provided, otherwise use static target
        const getCurrentTarget = typeof target === 'function' ? target : () => target;
        
        do {
            // Get fresh target position for each repeat
            const currentTarget = getCurrentTarget();
            
            // Generate one complete wave of bullets for this repeat
            for (let shotIndex = 0; shotIndex < config.shotsCount; shotIndex++) {
                const shotTimeOffset = (repeatCount * (patternDuration + config.repeatDelay)) + 
                                      (shotIndex * config.shotDelay);
                
                // Generate all bullets for this specific shot
                const bullets = this.generateBulletSpread(
                    centerX,
                    centerY,
                    config,
                    currentTarget, // Use fresh target position
                    shotTimeOffset,
                    shotIndex
                );
                
                allBullets.push(...bullets);
            }
            
            repeatCount++;
            
        } while (config.repeat && (repeatCount < config.maxRepeats || config.maxRepeats === 0));
        
        return allBullets;
    }

    static generateBulletSpread(x, y, config, target, timeOffset, shotIndex) {
        const bullets = [];
        const angle = config.angle === 'aimed' && target 
            ? Math.atan2(target.y - y, target.x - x)
            : (config.angle * Math.PI/180);
        
        const spreadRad = config.spread * Math.PI/180;
        const angleStep = config.spread === 360 
            ? spreadRad / config.bulletsPerShot
            : (config.bulletsPerShot > 1 ? spreadRad / (config.bulletsPerShot - 1) : 0);
        
        const startAngle = angle - (spreadRad/2);
    
        for (let bulletIndex = 0; bulletIndex < config.bulletsPerShot; bulletIndex++) {
            const bullet = {
                x: x,
                y: y,
                width: 16,  // Default bullet size
                height: 16, // Default bullet size
                angle: startAngle + (bulletIndex * angleStep),
                speed: config.speed + (shotIndex * config.speedIncrement),
                delay: timeOffset,
                bulletType: `${config.bulletColor}${config.bulletType}`,
                behavior: config.bulletBehavior,
                behaviorParams: config.bulletBehaviorParams || {},
                target: target,
                // Add the required methods
                isOffScreen: function() {
                    const margin = 200;
                    return (
                        this.y < -margin || 
                        this.y > (window.canvas?.height || 670) + margin ||
                        this.x < -margin || 
                        this.x > (window.canvas?.width || 574) + margin
                    );
                },
                update: function() {
                    if (window.BulletBehaviors[this.behavior]) {
                        window.BulletBehaviors[this.behavior](this);
                    }
                }
            };
            bullets.push(bullet);
        }
    
        return bullets;
    }
}