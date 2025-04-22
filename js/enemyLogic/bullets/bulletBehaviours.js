const BulletBehaviors = {
    linear: (bullet) => {
        bullet.x += Math.cos(bullet.angle) * bullet.speed;
        bullet.y += Math.sin(bullet.angle) * bullet.speed;
    },
    
    gravity: (bullet) => {
        const params = bullet.behaviorParams || {};
        const gravity = params.gravity || 0.1;
        const terminalVelocity = params.terminalVelocity || 5;
        const horizontalDecel = params.deceleration || 0.98;
        
        // Calculate current velocity components
        let vx = Math.cos(bullet.angle) * bullet.speed;
        let vy = Math.sin(bullet.angle) * bullet.speed;
        
        // Apply horizontal deceleration
        vx *= horizontalDecel;
        
        // Handle vertical movement
        if (vy > 0) { 
            // Moving downward
            if (vy < terminalVelocity) {
                // Accelerate downward until terminal velocity
                vy = Math.min(vy + gravity, terminalVelocity);
            } else {
                // Slow down if over terminal velocity
                vy = Math.max(terminalVelocity, vy - gravity/2);
            }
        } else { 
            // Moving upward or stationary
            // Always apply gravity downward (no upward acceleration limit)
            vy += gravity;
        }
        
        // Update bullet properties
        bullet.speed = Math.sqrt(vx*vx + vy*vy);
        bullet.angle = Math.atan2(vy, vx);
        
        // Apply movement
        bullet.x += vx;
        bullet.y += vy;
    },
};

window.BulletBehaviors = BulletBehaviors;