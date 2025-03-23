class SpellcardManager {
    constructor() {
        this.spellcardWaveDelay = 300;
        this.waveCount = 0;
        this.isSpellcardActive = false;
        this.spellcards = [];
        this.currentSpellcard = null;
        this.spellcards = spellcardData.spellcards;

        this.spellcardRing = {
            isActive: false,
            x: 0,
            y: 0,
            radius: 0,
            maxRadius: 768,
            thickness: 12,
            opacity: 0.7,
            duration: 2,
            startTime: 0,
        };

        this.darkeningLayer = {
            isActive: false,
            opacity: 0,
            startTime: 0,
            duration: 2.4,
            fadeInDuration: 0.5,
            fadeOutDuration: 0.4,
        };

        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeStartTime = 0;

        this.originalPlayerSpeed = null;
    }

    // Get spellcard by name
    getSpellcard(name) {
        return this.spellcards.find(spellcard => spellcard.name === name);
    }

    // Invoke spellcard by name
    invokeSpellcard(name, cursor) {
        // Prevent invoking a new spellcard if one is already active
        if (this.isSpellcardActive) {
            console.log("Spellcard not invoked: another spellcard is already active.");
            return;
        }

        const spellcard = this.getSpellcard(name);
        if (!spellcard) {
            console.error("Spellcard not found:", name);
            return;
        }

        // Check if the player has enough bombs to invoke the spellcard
        if (bombs > 0) {
            console.log("Spellcard invoked:", name);
            updateBombs(bombs - 1);

            // Set the current spellcard and mark it as active
            this.currentSpellcard = spellcard;
            this.isSpellcardActive = true;
            this.waveCount = spellcard.waveCount;

            // Notify character manager that a spellcard has been invoked
            characterManager.isSpellcardActive = true;

            // Load and start portrait animation
            const character = characterManager.currentCharacter;
            if (character && character.portrait) {
                portraitManager.loadPortrait(character.portrait).then(() => {
                    portraitManager.start();
                });
            }

            // Display the spellcard name in the text bar
            textBarManager.start(spellcard.name);

            // Apply slowdown if specified in the spellcard
            this.originalPlayerSpeed = characterManager.cursor.speed;
            if (spellcard.slowdownFactor) {
                characterManager.cursor.speed = this.originalPlayerSpeed * spellcard.slowdownFactor;
            }

            // Play the spellcard sound effect
            this.playSoundEffect(spellcard.soundEffect);

            // Trigger visual effects
            this.triggerDarkeningLayer();
            this.triggerSpellcardRing(cursor);
            this.triggerScreenShake(spellcard.shakeIntensity, spellcard.shakeDuration, spellcard.shakeFadeOutDuration);

            // Start the spellcard behavior after a delay
            setTimeout(() => {
                if (spellcard.behavior === "shootLaser") {
                    // Handle laser spellcard
                    Laser.spawnLaserBeam(cursor, spellcard.laser, bulletManager);
                } else if (spellcard.behavior === "shootCards") {
                    // Handle card-based spellcard
                    this.startSpellcardWave(cursor);
                }
            }, 2000); // 2-second delay before the spellcard behavior starts
        } else {
            console.log("Out of bombs!");
        }
    }

    // Check if the spellcard has ended
    checkSpellcardEnd(cursor) {
        if (this.currentSpellcard && this.currentSpellcard.behavior === "shootLaser") {
            // Check if all lasers are offscreen
            if (Laser.areAllLasersOffscreen()) {
                this.isSpellcardActive = false; // Deactivate the spellcard
                this.resetPlayerSpeed(cursor); // Reset player speed
                console.log("Laser spellcard ended.");
            }
        } else if (this.currentSpellcard && this.currentSpellcard.behavior === "shootCards") {
            // Handle card-based spellcard end logic
            if (this.waveCount <= 0) {
                this.isSpellcardActive = false; // Deactivate the spellcard
                this.resetPlayerSpeed(cursor); // Reset player speed
                console.log("Card spellcard ended.");
            }
        }
    }

    // Reset player speed after spellcard ends
    resetPlayerSpeed(cursor) {
        if (this.originalPlayerSpeed !== null) {
            cursor.speed = this.originalPlayerSpeed;
            this.originalPlayerSpeed = null;
        } else {
            cursor.speed = 2.5; // Default speed
        }

        characterManager.isSpellcardActive = false;

        // Reset screen shake
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeStartTime = 0;
    }

    // Play sound effect based on spellcard type
    playSoundEffect(name) {
        switch (name) {
            case 'Card Invokation: Threeshot':
                playSoundEffect(soundEffects.spellcard);
                break;
            // Add more cases for different spellcard types
            default:
                playSoundEffect(soundEffects.spellcard);
                break;
        }
    }

    // Trigger darkening layer effect
    triggerDarkeningLayer() {
        this.darkeningLayer.isActive = true;
        this.darkeningLayer.opacity = 0;
        this.darkeningLayer.startTime = performance.now();
    }

    // Trigger spellcard ring effect
    triggerSpellcardRing(cursor) {
        if (this.spellcardRing.isActive) return;

        const cursorCenterX = cursor.x + cursor.width / 2;
        const cursorCenterY = cursor.y + cursor.height / 2;

        this.spellcardRing.isActive = true;
        this.spellcardRing.x = cursorCenterX;
        this.spellcardRing.y = cursorCenterY;
        this.spellcardRing.radius = 0;
        this.spellcardRing.opacity = 1;
        this.spellcardRing.startTime = performance.now();
    }

    // Trigger screen shake effect
    triggerScreenShake(intensity, duration, fadeOutDuration) {
        this.startShake(intensity, duration, fadeOutDuration);
    }

    // Start screen shake
    startShake(intensity, duration, fadeOutDuration = 0) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeFadeOutDuration = fadeOutDuration;
        this.shakeStartTime = performance.now();
    }

    // Update screen shake
    updateShake() {
        if (this.shakeDuration > 0) {
            const currentTime = performance.now();
            const elapsedTime = currentTime - this.shakeStartTime;

            if (elapsedTime >= this.shakeDuration) {
                // Stop screen shake
                this.shakeIntensity = 0;
                this.shakeDuration = 0;
                this.shakeFadeOutDuration = 0;
                return { x: 0, y: 0 };
            }

            // Calculate progress
            const progress = elapsedTime / this.shakeDuration;

            let fadeOutFactor = 1;
            if (this.shakeFadeOutDuration > 0 && elapsedTime > this.shakeDuration - this.shakeFadeOutDuration) {
                const fadeOutProgress = (elapsedTime - (this.shakeDuration - this.shakeFadeOutDuration)) / this.shakeFadeOutDuration;
                fadeOutFactor = 1 - fadeOutProgress;
            }

            const currentIntensity = this.shakeIntensity * fadeOutFactor;

            const randomX = (Math.random() * 2 - 1) * currentIntensity;
            const randomY = (Math.random() * 2 - 1) * currentIntensity;

            return { x: randomX, y: randomY };
        }
        return { x: 0, y: 0 };
    }

    // Start spellcard wave
    startSpellcardWave(cursor) {
        const spellcard = this.currentSpellcard;

        playSoundEffect(soundEffects.powershot);

        if (spellcard.spawnPositions) {
            spellcard.spawnPositions.forEach(({ xOffset, yOffset }) => {
                shotTypeManager.shoot(true, true, cursor, xOffset, yOffset);
            });
        }

        this.waveCount--;

        if (this.waveCount > 0) {
            setTimeout(() => this.startSpellcardWave(cursor), spellcard.waveDelay);
        } else {
            console.log("Spellcard waves completed");
            this.isSpellcardActive = false;

            this.resetPlayerSpeed(cursor);
        }
    }

    // Update spellcard ring
    updateSpellcardRing() {
        if (!this.spellcardRing.isActive) return;

        const currentTime = performance.now();
        const elapsedTime = (currentTime - this.spellcardRing.startTime) / 1000;

        if (elapsedTime >= this.spellcardRing.duration) {
            this.spellcardRing.isActive = false;
            return;
        }

        const progress = elapsedTime / this.spellcardRing.duration;

        this.spellcardRing.radius = this.spellcardRing.maxRadius * progress;
        this.spellcardRing.opacity = 1 - progress;
    }

    // Render spellcard ring
    renderSpellcardRing(ctx) {
        if (!this.spellcardRing.isActive) return;

        ctx.save();
        ctx.strokeStyle = `rgba(240, 242, 179, ${this.spellcardRing.opacity})`;
        ctx.lineWidth = this.spellcardRing.thickness;
        ctx.beginPath();
        ctx.arc(this.spellcardRing.x, this.spellcardRing.y, this.spellcardRing.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    // Update darkening layer
    updateDarkeningLayer() {
        if (!this.darkeningLayer.isActive) return;

        const currentTime = performance.now();
        const elapsedTime = (currentTime - this.darkeningLayer.startTime) / 1000;

        if (elapsedTime >= this.darkeningLayer.duration) {
            this.darkeningLayer.isActive = false;
            return;
        }

        const progress = elapsedTime / this.darkeningLayer.duration;

        if (elapsedTime < this.darkeningLayer.fadeInDuration) {
            this.darkeningLayer.opacity = elapsedTime / this.darkeningLayer.fadeInDuration;
        } else if (elapsedTime > this.darkeningLayer.duration - this.darkeningLayer.fadeOutDuration) {
            this.darkeningLayer.opacity = 1 - (elapsedTime - (this.darkeningLayer.duration - this.darkeningLayer.fadeOutDuration)) / this.darkeningLayer.fadeOutDuration;
        } else {
            this.darkeningLayer.opacity = 1;
        }
    }

    // Render darkening layer
    renderDarkeningLayer(ctx) {
        if (!this.darkeningLayer.isActive) return;

        ctx.save();
        ctx.fillStyle = `rgba(0, 0, 0, ${this.darkeningLayer.opacity * 0.8})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }
}

const spellcardManager = new SpellcardManager();
window.spellcardManager = spellcardManager;
window.invokeSpellcard = spellcardManager.invokeSpellcard.bind(spellcardManager);