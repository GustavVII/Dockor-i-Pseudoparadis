class CharacterManager {
    constructor() {
        this.characters = [];
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
            image: null,
            hitboxWidth: 8,  // Inner hitbox size
            hitboxHeight: 8
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
        this.animationManager = window.animationManager;
        this.currentDirection = 'idle';
        
        // Focus mode visuals
        this.focusVisualAlpha = 0;
        this.grazeRingRotation = 0;
        this.focusTransitionSpeed = 0.05; // Alpha change per frame (~0.5s transition)
        this.focusTransitionState = 'idle'; // 'idle' | 'focusing' | 'unfocusing'
        this.focusSoundPlayed = false;
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
        // Center the character on initialization
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
        window.shotTypeManager?.setCharacter(character);
    
        if (!this.isSpellcardActive) {
            this.cursor.speed = character.speed;
            this.originalSpeed = character.speed;
        }
    
        // Setup animations
        this.animationManager.addAnimation('idle', [1, 2, 3, 4], 5, true);
        this.animationManager.addAnimation('left', [5, 6, 7], 5, false);
        this.animationManager.addAnimation('right', [8, 9, 10], 5, false);
        
        this.animationManager.playAnimation('idle');
        this.currentDirection = 'idle';
    }

    setFocusMode(isFocused) {
        if (this.isSpellcardActive) return;

        if (isFocused && !this.focusMode) {
            // Starting to focus
            this.focusTransitionState = 'focusing';
            this.focusSoundPlayed = false;
        } else if (!isFocused && this.focusMode) {
            // Starting to unfocus
            this.focusTransitionState = 'unfocusing';
        }

        this.focusMode = isFocused;
        this.cursor.speed = isFocused ? this.originalSpeed * 0.5 : this.originalSpeed;
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
        // Reset velocities first
        this.cursor.velocityX = 0;
        this.cursor.velocityY = 0;

        // Handle animation state changes
        let newDirection = 'idle';
        if (gameInputHandler.keys.ArrowLeft && !gameInputHandler.keys.ArrowRight) {
            newDirection = 'left';
        } else if (gameInputHandler.keys.ArrowRight && !gameInputHandler.keys.ArrowLeft) {
            newDirection = 'right';
        }

        if (newDirection !== this.currentDirection) {
            this.currentDirection = newDirection;
            this.animationManager.playAnimation(newDirection);
        } else if (newDirection === 'idle' && !this.animationManager.isPlaying) {
            // Return to idle animation when movement keys are released
            this.animationManager.playAnimation('idle');
        }

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
        // Update animation
        this.animationManager.update();

        // Handle focus transition
        switch (this.focusTransitionState) {
            case 'focusing':
                this.focusVisualAlpha = Math.min(1, this.focusVisualAlpha + this.focusTransitionSpeed);
                if (this.focusVisualAlpha >= 1) {
                    this.focusTransitionState = 'idle';
                }
                
                // Play focus sound when transition starts
                if (!this.focusSoundPlayed && window.playSoundEffect) {
                    playSoundEffect(soundEffects.focus);
                    this.focusSoundPlayed = true;
                }
                break;
                
            case 'unfocusing':
                this.focusVisualAlpha = Math.max(0, this.focusVisualAlpha - this.focusTransitionSpeed * 0.5); // Slower fade out
                if (this.focusVisualAlpha <= 0) {
                    this.focusTransitionState = 'idle';
                }
                break;
                
            case 'idle':
                // Maintain current alpha if fully focused or unfocused
                this.focusVisualAlpha = this.focusMode ? 1 : 0;
                break;
        }

        // Update graze ring rotation (only when visible)
        if (this.focusVisualAlpha > 0) {
            this.grazeRingRotation += Math.PI / 120; // ~1/4 rotation per second
        }

        // Update cursor position
        this.cursor.x = Math.round(this.cursor.x + this.cursor.velocityX);
        this.cursor.y = Math.round(this.cursor.y + this.cursor.velocityY);

        // Keep the cursor centered within the canvas bounds
        this.cursor.x = Math.max(this.cursor.width / 2, 
                               Math.min(canvas.width - (this.cursor.width / 2), 
                               this.cursor.x));
        this.cursor.y = Math.max(this.cursor.height / 2, 
                                Math.min(canvas.height - (this.cursor.height / 2), 
                                this.cursor.y));
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
        const frameNumber = this.animationManager.getCurrentFrame();
        if (frameNumber) {
            const cursorImageKey = `character${this.currentCharacter.id}Cursor${padNumber(frameNumber, 2)}`;
            const cursorImage = window.assetLoader.getImage(cursorImageKey);
            
            if (cursorImage) {
                // Draw character centered
                const drawX = Math.round(this.cursor.x - (this.cursor.width / 2));
                const drawY = Math.round(this.cursor.y - (this.cursor.height / 2));
                
                ctx.drawImage(
                    cursorImage,
                    0, 0, 48, 48,
                    drawX, drawY, 48, 48
                );

                // Draw focus visuals if visible
                if (this.focusVisualAlpha > 0) {
                    this.renderFocusVisuals();
                }
            }
        }
    }

    renderFocusVisuals() {
        if (this.focusVisualAlpha <= 0) return;
        
        const centerX = this.cursor.x;
        const centerY = this.cursor.y;
        
        // Draw hitbox
        const hitboxImg = window.assetLoader.getImage('hitbox');
        if (hitboxImg) {
            const hitboxX = centerX - (this.cursor.hitboxWidth / 2);
            const hitboxY = centerY - (this.cursor.hitboxHeight / 2);
            
            ctx.globalAlpha = this.focusVisualAlpha;
            ctx.drawImage(
                hitboxImg,
                hitboxX, hitboxY,
                this.cursor.hitboxWidth, this.cursor.hitboxHeight
            );
        }

        // Draw graze ring
        const grazeRingImg = window.assetLoader.getImage('grazeRing');
        if (grazeRingImg) {
            const ringSize = 64;
            
            ctx.save();
            ctx.globalAlpha = this.focusVisualAlpha * 0.6;
            ctx.translate(centerX, centerY);
            ctx.rotate(this.grazeRingRotation);
            
            ctx.drawImage(
                grazeRingImg,
                -ringSize/2, -ringSize/2,
                ringSize, ringSize
            );
            
            ctx.restore();
        }
        
        ctx.globalAlpha = 1.0;
    }
}