class SpellcardManager {
    constructor() {
        this.spellcardWaveDelay = 300;
        this.waveCount = 0;
        this.isSpellcardActive = false;
        this.spellcards = [];
        this.currentSpellcard = null;
        this.laserManager = laserManager; // Use the imported laserManager
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

        // Screen shake properties
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeStartTime = 0;

        this.originalPlayerSpeed = null;

        
        
    }

    async loadSpellcards() {
        try {    
            // Load laser assets for spellcards that use them
            for (const spellcard of this.spellcards) {
                if (spellcard.behavior === "shootLaser" && spellcard.laser?.image) {
                    try {
                        spellcard.laser.image = await loadImage(spellcard.laser.image);
                        if (spellcard.laser.startImage) {
                            spellcard.laser.startImage = await loadImage(spellcard.laser.startImage);
                        }
                        if (spellcard.laser.endImage) {
                            spellcard.laser.endImage = await loadImage(spellcard.laser.endImage);
                        }
                    } catch (error) {
                        console.error("Failed to load laser images for spellcard:", spellcard.name, error);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to load spellcards:", error);
        }
    }

    // Get spellcard data by type
    getSpellcard(name) {
        return this.spellcards.find(spellcard => spellcard.name === name);
    }


    async loadLaserAssets() {
        try {
            this.laser.image = await loadImage('assets/graphics/lasers/laser2.png');
        } catch (error) {
            console.error("Failed to load laser image:", error);
        }
    
        try {
            this.laser.sound = soundEffects.laser;;
        } catch (error) {
            console.error("Failed to load laser sound:", error);
        }
    }

    

    // Invoke a spellcard based on type
    invokeSpellcard(name) {
        if (this.isSpellcardActive) {
            console.log("Spellcard not invoked: spellcard already active");
            return;
        }
    
        const spellcard = this.getSpellcard(name);
        if (!spellcard) {
            console.error("Spellcard not found:", name);
            return;
        }
    
        console.log("Spellcard invoked:", name);
    
        this.currentSpellcard = spellcard;
        this.isSpellcardActive = true;
        this.waveCount = spellcard.waveCount;
    
        // Set the spellcard state in the CharacterManager
        characterManager.isSpellcardActive = true;
    
        // Load and start the portrait animation
        const character = characterManager.currentCharacter;
        if (character && character.portrait) {
            portraitManager.loadPortrait(character.portrait).then(() => {
                portraitManager.start(); // Start the portrait animation
            });
        }
    
        // Start the text bar animation
        textBarManager.start(spellcard.name); // Start the text bar animation
    
        // Apply slowdown factor to the cursor
        this.originalPlayerSpeed = characterManager.cursor.speed; // Store the original speed
        if (spellcard.slowdownFactor) {
            characterManager.cursor.speed = this.originalPlayerSpeed * spellcard.slowdownFactor; // Apply slowdown
        }
    
        // Play sound effect
        this.playSoundEffect(spellcard.soundEffect);
    
        // Trigger effects
        this.triggerDarkeningLayer();
        this.triggerSpellcardRing(characterManager.cursor);
        this.triggerScreenShake(spellcard.shakeIntensity, spellcard.shakeDuration, spellcard.shakeFadeOutDuration);
    
        // Start the spellcard behavior
        setTimeout(() => {
            if (spellcard.behavior === "shootLaser") {
                this.laserManager.start(characterManager.cursor, this.currentSpellcard);
            } else if (spellcard.behavior === "shootCards") {
                this.startSpellcardWave(characterManager.cursor);
            }
        }, 2000);
    
        incrementSpellcardsInvoked();
    }

    checkSpellcardEnd(cursor) {
        if (this.currentSpellcard && this.currentSpellcard.behavior === "shootLaser") {
            if (laserManager.spawnComplete && laserManager.lasers.length === 0) {
                this.isSpellcardActive = false; // Deactivate the spellcard
                this.resetPlayerSpeed(cursor); // Reset player speed
                laserManager.reset(); // Reset the laser manager
            }
        }
    }

    resetPlayerSpeed(cursor) {
        if (this.originalPlayerSpeed !== null) {
            cursor.speed = this.originalPlayerSpeed; // Restore the original speed
            this.originalPlayerSpeed = null; // Reset the stored speed
        } else {
            // If no spellcard is active, reset to base speed
            cursor.speed = 2.5;
        }
    
        // Clear the spellcard state in the CharacterManager
        characterManager.isSpellcardActive = false;
    
        // Reset screenshake properties
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

    // Trigger the darkening layer effect
    triggerDarkeningLayer() {
        this.darkeningLayer.isActive = true;
        this.darkeningLayer.opacity = 0;
        this.darkeningLayer.startTime = performance.now();
    }

    // Trigger the spellcard ring effect
    triggerSpellcardRing(cursor) {
        if (this.spellcardRing.isActive) return; // Ensure only one ring is active

        // Calculate the center of the cursor
        const cursorCenterX = cursor.x + cursor.width / 2;
        const cursorCenterY = cursor.y + cursor.height / 2;

        // Initialize the ring at the cursor's position
        this.spellcardRing.isActive = true;
        this.spellcardRing.x = cursorCenterX;
        this.spellcardRing.y = cursorCenterY;
        this.spellcardRing.radius = 0;
        this.spellcardRing.opacity = 1;
        this.spellcardRing.startTime = performance.now();
    }

    triggerScreenShake(intensity, duration, fadeOutDuration) {
        this.startShake(intensity, duration, fadeOutDuration);
    }

    // Start the screen shake effect
    startShake(intensity, duration, fadeOutDuration = 0) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeFadeOutDuration = fadeOutDuration; // Store the fade-out duration
        this.shakeStartTime = performance.now();
    }

    // Update the screen shake effect and return the shake offset
    updateShake() {
        if (this.shakeDuration > 0) {
            const currentTime = performance.now();
            const elapsedTime = currentTime - this.shakeStartTime;
    
            if (elapsedTime >= this.shakeDuration) {
                // End the shake effect
                this.shakeIntensity = 0;
                this.shakeDuration = 0;
                this.shakeFadeOutDuration = 0; // Reset fade-out duration
                return { x: 0, y: 0 }; // No shake
            }
    
            // Calculate the progress of the shake (0 to 1)
            const progress = elapsedTime / this.shakeDuration;
    
            // Apply a fade-out effect to the shake intensity
            let fadeOutFactor = 1; // Default to full intensity
            if (this.shakeFadeOutDuration > 0 && elapsedTime > this.shakeDuration - this.shakeFadeOutDuration) {
                // Calculate the fade-out progress (0 to 1)
                const fadeOutProgress = (elapsedTime - (this.shakeDuration - this.shakeFadeOutDuration)) / this.shakeFadeOutDuration;
                fadeOutFactor = 1 - fadeOutProgress; // Linearly reduce intensity during fade-out
            }
    
            const currentIntensity = this.shakeIntensity * fadeOutFactor;
    
            // Calculate random shake offset with fading intensity
            const randomX = (Math.random() * 2 - 1) * currentIntensity;
            const randomY = (Math.random() * 2 - 1) * currentIntensity;
    
            return { x: randomX, y: randomY };
        }
        return { x: 0, y: 0 }; // No shake
    }
    
    // Start a spellcard wave
    startSpellcardWave(cursor) {
        const spellcard = this.currentSpellcard;
    
        // Play sound effect for each wave
        playSoundEffect(soundEffects.powershot);
    
        // Shoot cards in different directions
        if (spellcard.spawnPositions) {
            spellcard.spawnPositions.forEach(({ xOffset, yOffset }) => {
                shotTypeManager.shoot(true, true, cursor, xOffset, yOffset);
            });
        }
    
        // Decrement the wave count
        this.waveCount--;
    
        // Wait for the next wave
        if (this.waveCount > 0) {
            setTimeout(() => this.startSpellcardWave(cursor), spellcard.waveDelay);
        } else {
            console.log("Spellcard waves completed");
            this.isSpellcardActive = false; // End spellcard
    
            // Reset the player's speed
            this.resetPlayerSpeed(cursor);
        }
    }   

    // Update the spellcard ring effect
    updateSpellcardRing() {
        if (!this.spellcardRing.isActive) return;

        const currentTime = performance.now();
        const elapsedTime = (currentTime - this.spellcardRing.startTime) / 1000;

        if (elapsedTime >= this.spellcardRing.duration) {
            this.spellcardRing.isActive = false;
            return;
        }

        const progress = elapsedTime / this.spellcardRing.duration;

        // Update the ring's size and opacity
        this.spellcardRing.radius = this.spellcardRing.maxRadius * progress;
        this.spellcardRing.opacity = 1 - progress; // Fade out the ring
    }

    // Render the spellcard ring on the bottom canvas
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

    // Update the darkening layer effect
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

    // Render the darkening layer
    renderDarkeningLayer(ctx) {
        if (!this.darkeningLayer.isActive) return;

        ctx.save();
        ctx.fillStyle = `rgba(0, 0, 0, ${this.darkeningLayer.opacity * 0.8})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }
}

// Create an instance of SpellcardManager
const spellcardManager = new SpellcardManager();