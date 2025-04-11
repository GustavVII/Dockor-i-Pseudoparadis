class CharacterManager {
    constructor() {
        this.characters = []; // Initialize as empty array
        this.currentCharacter = null;
        this.cursorImage = null;
        this.cursor = {
            x: 0,
            y: 0,
            width: 48,
            height: 48,
            speed: 2.5,
            velocityX: 0,
            velocityY: 0,
            isActive: true,
            image: null,
        };
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false,
            z: false,
            ' ': false,
            x: false,
        };
        this.focusMode = false;
        this.originalSpeed = this.cursor.speed;
        this.isSpellcardActive = false;
        this.canvas = null;
        this.ctx = null;
        this.isInitialized = false;
    }

    async loadCharacterData() {
        try {
            // Load the JSON file
            const response = await fetch('data/characters.json');
            if (!response.ok) {
                throw new Error('Failed to load character data');
            }
            const characterData = await response.json();
            this.characters = characterData.characters;
            this.isInitialized = true;
        } catch (error) {
            console.error('Error loading character data:', error);
            // Fallback to empty array if loading fails
            this.characters = [];
        }
    }

    async ensureDataLoaded() {
        if (!this.isInitialized) {
            await this.loadCharacterData();
        }
    }

    async init(canvas) {
        await this.ensureDataLoaded();
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cursor.x = canvas.width / 2;
        this.cursor.y = canvas.height - 64;
    }

    async setCharacter(characterId) {
        await this.ensureDataLoaded();
        
        const character = this.characters.find(char => char.id === characterId);
        if (!character) {
            console.error(`Character "${characterId}" not found.`);
            return;
        }
    
        this.currentCharacter = character;
    
        // Only update the speed if it hasn't been modified by a spellcard or other factor
        if (!this.isSpellcardActive) {
            this.cursor.speed = character.speed;
            this.originalSpeed = character.speed;
        } else {
            console.log("Character speed not updated: spellcard is active");
        }
    
        // Get cursor image from assetLoader
        const cursorImageKey = `character${characterId}Cursor`;
        this.cursor.image = window.assetLoader.getImage(cursorImageKey);
        
        if (!this.cursor.image) {
            console.error(`Cursor image for "${characterId}" not found in assetLoader`);
        }
    
        console.log(`Character "${characterId}" selected.`);
    }

    setFocusMode(isFocused) {
        if (this.isSpellcardActive) return;
    
        this.focusMode = isFocused;
    
        if (this.focusMode) {
            this.cursor.speed = this.originalSpeed * 0.5;
        } else {
            this.cursor.speed = this.originalSpeed;
        }
    
        //shotTypeManager.setFocusMode(this.focusMode);
    }

    applySlowdownFactor(slowdownFactor) {
        if (slowdownFactor) {
            this.cursor.speed = this.originalSpeed * slowdownFactor;
            this.isSpellcardActive = true;
            console.log(`Player speed slowed down to: ${this.cursor.speed}`);
        } else {
            this.cursor.speed = this.originalSpeed;
            this.isSpellcardActive = false;
            console.log(`Player speed restored to: ${this.cursor.speed}`);
        }
    }

    handleMovement() {
        if (!this.cursor.isActive) return;

        // Reset velocities first
        this.cursor.velocityX = 0;
        this.cursor.velocityY = 0;

        // Calculate base speed (rounded to nearest integer)
        const baseSpeed = Math.round(this.cursor.speed);
        let velX = 0;
        let velY = 0;

        // Horizontal movement
        if (gameInputHandler.keys.ArrowLeft && !gameInputHandler.keys.ArrowRight) {
            velX = -baseSpeed;
        } else if (gameInputHandler.keys.ArrowRight && !gameInputHandler.keys.ArrowLeft) {
            velX = baseSpeed;
        }

        // Vertical movement
        if (gameInputHandler.keys.ArrowUp && !gameInputHandler.keys.ArrowDown) {
            velY = -baseSpeed;
        } else if (gameInputHandler.keys.ArrowDown && !gameInputHandler.keys.ArrowUp) {
            velY = baseSpeed;
        }

        // Check for diagonal movement
        if (velX !== 0 && velY !== 0) {
            // Calculate diagonal speed (speed / √2 ≈ speed * 0.7071)
            const diagonalSpeed = Math.round(baseSpeed * 0.7071);
            velX = velX > 0 ? diagonalSpeed : -diagonalSpeed;
            velY = velY > 0 ? diagonalSpeed : -diagonalSpeed;
        }

        // Apply velocities
        this.cursor.velocityX = velX;
        this.cursor.velocityY = velY;
    }

    updateCursor() {
        if (!this.cursor.isActive) return;

        // Update cursor position with rounded values
        this.cursor.x = Math.round(this.cursor.x + this.cursor.velocityX);
        this.cursor.y = Math.round(this.cursor.y + this.cursor.velocityY);

        // Keep the cursor within the canvas bounds
        this.cursor.x = Math.max(0, Math.min(canvas.width - this.cursor.width, this.cursor.x));
        this.cursor.y = Math.max(0, Math.min(canvas.height - this.cursor.height, this.cursor.y));
    }

    handleKeyDown(e) {
        if (!gameRunning) return;
        if (e.key in this.keys) {
            this.keys[e.key] = true;
        }

        if (e.key === ' ' && selectedCard) {
            e.preventDefault();
        }

        if (e.key === 'x' && !spellcardManager.isSpellcardActive) {
            const spellcardType = this.currentCharacter.spellcardId;
            spellcardManager.invokeSpellcard(spellcardType, this.cursor);
        }
    }

    handleKeyUp(e) {
        if (!gameRunning) return;
        if (e.key in this.keys) {
            this.keys[e.key] = false;
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