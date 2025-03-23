// spellcardHandler.js

class SpellcardManager {
    constructor(characterManager, portraitManager) {
        this.spellcards = spellcardData.spellcards;
        this.activeSpellcard = null;
        this.screenShakeIntensity = 0;
        this.screenShakeDuration = 0;
        this.screenShakeFadeOutDuration = 0;
        this.screenShakeStartTime = 0;

        // Darkening layer properties
        this.darkeningLayer = {
            isActive: false,
            opacity: 0,
            startTime: 0,
            duration: 1.5, // Total duration in seconds
            fadeInDuration: 0.5, // Fade-in duration in seconds
            fadeOutDuration: 0.5, // Fade-out duration in seconds
        };

        this.characterManager = characterManager; // Reference to CharacterManager
        this.portraitManager = portraitManager; // Reference to PortraitManager
    }

    // Method to trigger the darkening layer
    triggerDarkeningLayer() {
        this.darkeningLayer.isActive = true;
        this.darkeningLayer.opacity = 0;
        this.darkeningLayer.startTime = performance.now();
    }

    // Method to update the darkening layer
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

    // Method to render the darkening layer
    renderDarkeningLayer(ctx) {
        if (!this.darkeningLayer.isActive) return;

        ctx.save();
        ctx.fillStyle = `rgba(0, 0, 0, ${this.darkeningLayer.opacity * 0.8})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }

    // Method to invoke a spellcard
    invokeSpellcard(characterName) {
        if (this.characterManager.isSpellcardActive) return; // Prevent multiple spellcards

        // Get the character's spellcard from characterData
        const character = characterData.characters.find(char => char.name === characterName);
        if (!character || !character.spellcard) {
            console.error(`Character "${characterName}" or their spellcard not found.`);
            return;
        }

        // Find the spellcard data
        const spellcardData = this.spellcards.find(sc => sc.name === character.spellcard);
        if (!spellcardData) {
            console.error(`Spellcard "${character.spellcard}" not found.`);
            return;
        }

        // Create a new instance of the Spellcard class, passing this SpellcardManager instance
        this.activeSpellcard = new Spellcard(spellcardData, this);

        // Start the spellcard
        this.activeSpellcard.start(this.characterManager.cursor);

        // Trigger the darkening layer
        this.triggerDarkeningLayer();

        // Start the portrait animation
        this.portraitManager.start();
    }


    // Method to start screen shake
    startScreenShake(intensity, duration, fadeOutDuration) {
        this.screenShakeIntensity = intensity;
        this.screenShakeDuration = duration;
        this.screenShakeFadeOutDuration = fadeOutDuration;
        this.screenShakeStartTime = performance.now();
    }

    // Method to apply screen shake
    applyScreenShake(ctx) {
        if (this.screenShakeIntensity <= 0) return;

        const currentTime = performance.now();
        const elapsedTime = currentTime - this.screenShakeStartTime;

        if (elapsedTime >= this.screenShakeDuration) {
            this.screenShakeIntensity = 0;
            return;
        }

        const shakeProgress = elapsedTime / this.screenShakeDuration;
        const shakeFactor = Math.min(1, shakeProgress / (this.screenShakeFadeOutDuration / this.screenShakeDuration));
        const offsetX = (Math.random() - 0.5) * this.screenShakeIntensity * shakeFactor;
        const offsetY = (Math.random() - 0.5) * this.screenShakeIntensity * shakeFactor;

        ctx.translate(offsetX, offsetY);
    }
}