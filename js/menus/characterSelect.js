class CharacterSelect {
    constructor() {
        this.currentCharacterIndex = 0;
        this.characters = characterData.characters;
        this.transitionState = {
            active: false,
            direction: null,
            nextIndex: 0
        };
        this.container = null;
        this.isAnimatingIn = false;
        this.isAnimatingOut = false;
    }

    createStatRow = (container, label, rating) => {
        const row = document.createElement('div');
        row.className = 'character-stat-row';
        
        const labelElement = document.createElement('span');
        labelElement.className = 'stat-label';
        labelElement.textContent = label;
        row.appendChild(labelElement);
        
        const ratingContainer = document.createElement('div');
        ratingContainer.className = 'rating-container';
        
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('img');
            star.src = window.assetLoader.getImage('rating').src;
            star.className = 'rating-star';
            if (i < rating) star.classList.add('active');
            ratingContainer.appendChild(star);
        }
        
        row.appendChild(ratingContainer);
        container.appendChild(row);
    }

    render() {
        const container = this.ensureContainer();
        // Create container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'characterSelectContainer';
            this.container.className = 'character-select-container';
            document.querySelector('.container').appendChild(this.container);
            
            // Set initial position for entrance animation
            this.container.style.transform = 'translateX(100%)';
            this.container.style.opacity = '0';
        }

        // Only clear container if not animating
        if (!this.transitionState.active && !this.isAnimatingIn) {
            container.innerHTML = '';
        }
        
        const currentCharacter = this.characters[this.currentCharacterIndex];
        if (!currentCharacter) return;
        
        // Add instructions if not in transition
        if (!this.transitionState.active && !this.isAnimatingIn) {
            const instructions = document.createElement('div');
            instructions.className = 'character-select-instructions';
            instructions.innerHTML = `
                <div>${languageManager.getText('menus.startMenu.instructions.Z')}</div>
                <div>${languageManager.getText('menus.startMenu.instructions.X')}</div>
            `;
            this.container.appendChild(instructions);
        }
    
        if (this.transitionState.active) {
            // ... (keep existing transition logic)
        } else if (this.isAnimatingIn) {
            // During entrance animation, just create character container
            const container = this.createCharacterContainer(currentCharacter);
            this.container.appendChild(container);
        } else {
            // Normal view - just show current character
            const container = this.createCharacterContainer(currentCharacter);
            this.container.appendChild(container);
        }
        
        this.container.style.display = 'flex';
    }

    ensureContainer() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'characterSelectContainer';
            this.container.className = 'character-select-container';
            document.querySelector('.container').appendChild(this.container);
            
            // Set initial position for entrance animation
            this.container.style.transform = 'translateX(100%)';
            this.container.style.opacity = '0';
            this.container.style.display = 'none'; // Start hidden
        }
        return this.container;
    }

    async animateIn() {
        if (this.isAnimatingIn) return;
        this.isAnimatingIn = true;
        
        const container = this.ensureContainer();
        container.style.display = 'flex';
        
        // Force reflow - now safe because container exists
        container.offsetHeight;
        
        // Animate in from right
        container.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease';
        container.style.transform = 'translateX(0)';
        container.style.opacity = '1';
        
        await new Promise(resolve => {
            setTimeout(resolve, 500);
        });
        
        this.isAnimatingIn = false;
    }

    async animateOut() {
        if (this.isAnimatingOut || !this.container) return;
        this.isAnimatingOut = true;
        window.menuHandler.inputLocked = true;
    
        return new Promise((resolve) => {
            // Set up transition
            this.container.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease';
            
            // Force reflow
            this.container.offsetHeight;
            
            // Animate out
            this.container.style.transform = 'translateX(100%)';
            this.container.style.opacity = '0';
            
            // Clean up after animation completes
            const onComplete = () => {
                this.container.removeEventListener('transitionend', onComplete);
                this.cleanup();
                this.isAnimatingOut = false;
                window.menuHandler.inputLocked = false;
                resolve();
            };
            this.container.addEventListener('transitionend', onComplete);
            setTimeout(onComplete, 500); // Fallback
        });
    }
    
    populateCharacterData(container, character) {
        if (!container || !character) return;
        
        container.innerHTML = '';
        
        const portrait = document.createElement('img');
        portrait.className = 'character-portrait';
        const portraitImage = window.assetLoader.getImage(`portrait${character.id}`);
        if (portraitImage) portrait.src = portraitImage.src;
        container.appendChild(portrait);
        
        const nameElement = document.createElement('div');
        nameElement.className = 'character-name';
        nameElement.textContent = languageManager.getText(`characters.${character.id}.name`);

        container.appendChild(nameElement);
        
        const titleElement = document.createElement('div');
        titleElement.className = 'character-title';
        titleElement.textContent = languageManager.getText(`characters.${character.id}.title`);
        container.appendChild(titleElement);
        
        // Stats container
        const statsContainer = document.createElement('div');
        statsContainer.className = 'character-stats';
        
        this.createStatRow(statsContainer, languageManager.getText('menus.startMenu.movementRating'), character.speedRating);
        this.createStatRow(statsContainer, languageManager.getText('menus.startMenu.attackRangeRating'), character.attackRangeRating);
        this.createStatRow(statsContainer, languageManager.getText('menus.startMenu.attackPowerRating'), character.attackPowerRating);
        
        container.appendChild(statsContainer);
        
        // Localized shot type and spellcard
        const shotTypeElement = document.createElement('div');
        shotTypeElement.className = 'character-ability';
        shotTypeElement.innerHTML = `
            <span>${languageManager.getText('menus.startMenu.shotType')}:</span> 
            ${languageManager.getText(`spells.shotTypes.${character.shotTypeId}`)}
        `;
        container.appendChild(shotTypeElement);
        
        const spellcardElement = document.createElement('div');
        spellcardElement.className = 'character-ability';
        spellcardElement.innerHTML = `
            <span>${languageManager.getText('menus.startMenu.spellcard')}:</span> 
            ${languageManager.getText(`spells.spellcards.${character.spellcardId}`)}
        `;
        container.appendChild(spellcardElement);
    }

    handleInput() {
        if (this.transitionState.active || window.menuHandler.inputLocked) return false;
        
        if (window.menuInputHandler.isKeyPressed('ArrowLeft')) {
            this.startTransition('left');
            return false;
        }
        
        if (window.menuInputHandler.isKeyPressed('ArrowRight')) {
            this.startTransition('right');
            return false;
        }
        
        if (window.menuInputHandler.isKeyPressed('z') || window.menuInputHandler.isKeyPressed('Z')) {
            playSoundEffect(soundEffects.ok);
            
            // Hide both menu containers before starting game
            if (this.container) {
                this.container.style.display = 'none';
            }
            if (window.menuHandler.difficultySelect?.container) {
                window.menuHandler.difficultySelect.container.style.display = 'none';
            }
            
            const selectedCharacterId = this.characters[this.currentCharacterIndex].id;
            window.startGame(selectedCharacterId);
            
            return true;
        }
        
        if (window.menuInputHandler.isKeyPressed('x') || window.menuInputHandler.isKeyPressed('X')) {
            // Reset difficulty selection
            if (window.menuHandler.difficultySelect) {
                window.menuHandler.difficultySelect.resetSelection();
            }
            //this.container.style.display = 'none';
            playSoundEffect(soundEffects.cancel);
            return false;
        }
        
        return false;
    }

    startTransition(direction) {
        if (this.transitionState.active) return;
                
        playSoundEffect(soundEffects.select);

        let nextIndex;
        if (direction === 'right') {
            nextIndex = (this.currentCharacterIndex + 1) % this.characters.length;
        } else {
            nextIndex = (this.currentCharacterIndex - 1 + this.characters.length) % this.characters.length;
        }

        // Get current container
        const currentContainer = this.container.querySelector('.character-container');
        if (!currentContainer) {
            console.error('Current character container not found');
            return;
        }

        // Create next container
        const nextContainer = this.createCharacterContainer(this.characters[nextIndex]);
        
        // Set initial state for next container
        nextContainer.style.position = 'absolute';
        nextContainer.style.top = '0';
        nextContainer.style.opacity = '0';
        
        if (direction === 'right') {
            nextContainer.style.transform = 'rotateY(-90deg)';
            nextContainer.style.left = '0';
            nextContainer.style.transformOrigin = 'right center';
        } else {
            nextContainer.style.transform = 'rotateY(90deg)';
            nextContainer.style.right = '0';
            nextContainer.style.transformOrigin = 'left center';
        }
        
        // Add next container
        this.container.appendChild(nextContainer);
        
        // Force reflow
        currentContainer.offsetHeight;
        nextContainer.offsetHeight;
        
        // Start transition
        this.transitionState = {
            active: true,
            direction,
            nextIndex
        };
        
        // Apply animation classes - IMPORTANT: Remove any existing first
        currentContainer.classList.remove('fold-out-right', 'fold-out-left');
        nextContainer.classList.remove('fold-in-right', 'fold-in-left');
        
        if (direction === 'right') {
            currentContainer.classList.add('fold-out-left');
            nextContainer.classList.add('fold-in-right');
        } else if (direction === 'left') {
            currentContainer.classList.add('fold-out-right');
            nextContainer.classList.add('fold-in-left');
        }
        
        // After animation completes
        setTimeout(() => {
            currentContainer.remove();
            this.currentCharacterIndex = nextIndex;
            this.transitionState.active = false;
            
            // Reset next container styles
            nextContainer.style.position = '';
            nextContainer.style.top = '';
            nextContainer.style.left = '';
            nextContainer.style.right = '';
            nextContainer.style.transform = '';
            nextContainer.style.transformOrigin = '';
            nextContainer.style.opacity = '';
            
            // Remove animation classes
            nextContainer.classList.remove('fold-in-right', 'fold-in-left');
        }, 500);
    }
    
    createCharacterContainer(character) {
        const container = document.createElement('div');
        container.className = 'character-container';
        
        // Populate character data
        const portrait = document.createElement('img');
        portrait.className = 'character-portrait';
        const portraitImage = window.assetLoader.getImage(`portrait${character.id}`);
        if (portraitImage) portrait.src = portraitImage.src;
        container.appendChild(portrait);
        
        const nameElement = document.createElement('div');
        nameElement.className = 'character-name';
        nameElement.textContent = languageManager.getText(`characters.${character.id}.name`);
        container.appendChild(nameElement);
        this.populateCharacterData(container, character);
        return container;
    }

    cleanup() {
        if (this.container && this.container.parentNode) {
            this.container.remove();
        }
        this.container = null;
    }
}