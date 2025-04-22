// spellcard.js

class Spellcard {
    constructor(data, spellcardManager) {
        this.name = data.name;
        this.behavior = data.behavior;
        this.soundEffect = data.soundEffect;
        this.shakeIntensity = data.shakeIntensity;
        this.shakeDuration = data.shakeDuration;
        this.shakeFadeOutDuration = data.shakeFadeOutDuration;
        this.slowdownFactor = data.slowdownFactor;
        this.waveCount = data.waveCount;
        this.waveDelay = data.waveDelay;
        this.spawnPositions = data.spawnPositions;
        this.spellcardManager = spellcardManager; // Reference to SpellcardManager
    }

    // Method to start the spellcard behavior
    start(cursor) {
        // Play the spellcard sound effect
        playSoundEffect(soundEffects[this.soundEffect]);

        // Start portrait and textbar animations
        portraitManager.start();
        textBarManager.start(this.name);

        // Apply slowdown factor
        characterManager.applySlowdownFactor(this.slowdownFactor);

        // Start screen shake via SpellcardManager
        this.spellcardManager.startScreenShake(this.shakeIntensity, this.shakeDuration, this.shakeFadeOutDuration);

        // Trigger the darkening layer via SpellcardManager
        this.spellcardManager.triggerDarkeningLayer();

        // Start spellcard behavior after the darkening effect
        setTimeout(() => {
            this.executeBehavior(cursor);
        }, this.spellcardManager.darkeningLayer.duration * 1000);
    }

    // Method to execute the spellcard behavior
    executeBehavior(cursor) {
        let wave = 0;
        const interval = setInterval(() => {
            if (wave >= this.waveCount) {
                clearInterval(interval);
                characterManager.isSpellcardActive = false;
                characterManager.applySlowdownFactor(null); // Restore original speed
                return;
            }

            // Spawn cards for this wave
            this.spawnPositions.forEach(position => {
                const x = cursor.x + position.xOffset;
                const y = cursor.y + position.yOffset;
                const card = { suit: suits[Math.floor(Math.random() * suits.length)], number: Math.floor(Math.random() * 13) + 1 };
                const cardBullet = new CardBullet(x, y, 15, card);
                bulletManager.addBullet(cardBullet);
            });

            wave++;
        }, this.waveDelay);
    }
}