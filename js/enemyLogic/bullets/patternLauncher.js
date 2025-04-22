class PatternLauncher {
    static async firePattern(patternName, x, y, config, target) {
        // Ensure PatternProcessor is loaded
        if (!window.PatternProcessor) {
            await import('./patternProcessor.js');
        }
        
        const bullets = PatternProcessor.generate(
            patternName,
            x,
            y,
            {
                bulletType: config.bulletType,
                width: config.width,
                height: config.height,
                behavior: config.behavior,
                behaviorParams: config.behaviorParams,
                ...config.params // Spread any additional params
            },
            target
        );

        if (window.enemyBulletManager) {
            bullets.forEach(bullet => {
                window.enemyBulletManager.addBullet(bullet);
            });
        }

        return bullets;
    }
}

window.PatternLauncher = PatternLauncher;