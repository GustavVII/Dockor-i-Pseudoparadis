class CharacterManager {
    constructor() {
        this.characters = characterData.characters;
        this.currentCharacter = null;
        this.cursorImage = null;
        this.cursor = {
            x: (canvas.width / 2),
            y: (canvas.height - 64),
            width: 48,
            height: 48,
            speed: 2.5, // Default speed, will be overridden by character data
            velocityX: 0,
            velocityY: 0,
            isActive: true,
            image: null, // Will be set by the selected character
        };
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false,
            z: false,
            ' ': false, // Space
            x: false,
        };
        this.focusMode = false; // Track focus mode
        this.originalSpeed = this.cursor.speed; // Store the original speed
        this.isSpellcardActive = false; // Track whether a spellcard is active
    }

    setCharacter(characterName) {
        const character = this.characters.find(char => char.name === characterName);
        if (!character) {
            console.error(`Character "${characterName}" not found.`);
            return;
        }
    
        this.currentCharacter = character;
    
        // Only update the speed if it hasn't been modified by a spellcard or other factor
        if (!this.isSpellcardActive) {
            this.cursor.speed = character.speed;
            this.originalSpeed = character.speed; // Update original speed
        } else {
            console.log("Character speed not updated: spellcard is active"); // Debugging
        }
    
        // Use the preloaded character image from assetLoader
        const imageKey = `character${character.name}Cursor`; // Example key for the cursor image
        this.cursor.image = assetLoader.getImage(imageKey);
    
        if (!this.cursor.image) {
            console.error(`Character cursor image for "${character.name}" not found in assetLoader.`);
        }
    
        // Set the shot type for the character
        shotTypeManager.setShotType(character.shotType);
    
        console.log(`Character "${character.name}" selected.`);
    }

    setFocusMode(isFocused) {
        if (this.isSpellcardActive) {
            return; // Ignore focus mode changes during spellcards
        }
    
        this.focusMode = isFocused;
    
        // Adjust speed based on focus mode
        if (this.focusMode) {
            this.cursor.speed = this.originalSpeed * 0.5; // Slow down in focus mode
        } else {
            this.cursor.speed = this.originalSpeed; // Restore normal speed
        }
    
        // Notify ShotTypeManager about focus mode
        shotTypeManager.setFocusMode(this.focusMode);
    }

    applySlowdownFactor(slowdownFactor) {
        if (slowdownFactor) {
            this.cursor.speed = this.originalSpeed * slowdownFactor; // Apply slowdown factor
            this.isSpellcardActive = true; // Set spellcard state
            console.log(`Player speed slowed down to: ${this.cursor.speed}`); // Debugging
        } else {
            this.cursor.speed = this.originalSpeed; // Restore original speed
            this.isSpellcardActive = false; // Clear spellcard state
            console.log(`Player speed restored to: ${this.cursor.speed}`); // Debugging
        }
    }

    moveCursor(direction) {
        if (!this.cursor.isActive) return;
    
        switch (direction) {
            case 'left':
                this.cursor.velocityX = -this.cursor.speed; // Use the current speed value
                break;
            case 'right':
                this.cursor.velocityX = this.cursor.speed; // Use the current speed value
                break;
            case 'up' :
                this.cursor.velocityY = -this.cursor.speed;
                break;
            case 'down' :
                this.cursor.velocityY = this.cursor.speed;
        }
    }

    updateCursor() {
        // Update cursor position based on velocity
        this.cursor.x += this.cursor.velocityX;
        this.cursor.y += this.cursor.velocityY;
    
        // Keep the cursor within the canvas bounds
        this.cursor.x = Math.max(0, Math.min(canvas.width - this.cursor.width, this.cursor.x));
        this.cursor.y = Math.max(0, Math.min(canvas.height - this.cursor.height, this.cursor.y));
    
        // Reset velocity if no keys are pressed
        if (!this.keys.ArrowLeft && !this.keys.ArrowRight || !this.keys.ArrowUp && !this.keys.ArrowDown) {
            this.cursor.velocityX = 0;
            this.cursor.velocityY = 0;
        }
    }

    renderCursor() {
        if (this.cursor.isActive && this.cursor.image) {
            const cursorX = Math.round(this.cursor.x);
            const cursorY = Math.round(this.cursor.y);

            ctx.drawImage(
                this.cursor.image,
                0, 0, 48, 48,
                cursorX, cursorY, 48, 48
            );
        }
    }
}

// Create an instance of CharacterManager
const characterManager = new CharacterManager();
window.characterManager = characterManager;

// Add event listeners for key handling