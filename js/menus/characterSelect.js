class CharacterSelect {
    constructor() {
        this.currentCharacterIndex = 0;
        this.characters = characterData.characters;
        this.transitionState = {
            active: false,
            direction: null,
            progress: 0,
            nextIndex: 0
        };
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
        const menuBox = document.getElementById('menuBox');
        if (!menuBox) return;
        
        const currentCharacter = this.characters[this.currentCharacterIndex];
        if (!currentCharacter) return;
        
        menuBox.innerHTML = '';
        
        // Instructions using translations
        const instructions = document.createElement('div');
        instructions.className = 'character-select-instructions';
        instructions.innerHTML = `
            <div>${languageManager.getText('startMenu.instructions.Z')}</div>
            <div>${languageManager.getText('startMenu.instructions.X')}</div>
        `;
        menuBox.appendChild(instructions);
    
        if (this.transitionState.active) {
            // Render both characters during transition
            const currentContainer = document.createElement('div');
            currentContainer.className = 'character-container current';
            
            const nextContainer = document.createElement('div');
            nextContainer.className = 'character-container next';
            
            if (this.transitionState.direction === 'right') {
                currentContainer.style.transform = `translateX(${-100 * this.transitionState.progress}%)`;
                nextContainer.style.transform = `translateX(${100 - (100 * this.transitionState.progress)}%)`;
            } else { // left
                currentContainer.style.transform = `translateX(${100 * this.transitionState.progress}%)`;
                nextContainer.style.transform = `translateX(${-100 + (100 * this.transitionState.progress)}%)`;
            }
            
            this.populateCharacterData(currentContainer, currentCharacter);
            this.populateCharacterData(nextContainer, 
                this.characters[this.transitionState.nextIndex]);
                
            menuBox.appendChild(currentContainer);
            menuBox.appendChild(nextContainer);
        } else {
            // Normal view - just show current character
            const container = document.createElement('div');
            container.className = 'character-container';
            this.populateCharacterData(container, currentCharacter);
            menuBox.appendChild(container);
        }
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
        
        this.createStatRow(statsContainer, 
            languageManager.getText('startMenu.movementRating'), 
            character.speedRating);
        this.createStatRow(statsContainer, 
            languageManager.getText('startMenu.attackRangeRating'), 
            character.attackRangeRating);
        this.createStatRow(statsContainer, 
            languageManager.getText('startMenu.attackPowerRating'), 
            character.attackPowerRating);
        
        container.appendChild(statsContainer);
        
        // Localized shot type and spellcard
        const shotTypeElement = document.createElement('div');
        shotTypeElement.className = 'character-ability';
        shotTypeElement.innerHTML = `
            <span>${languageManager.getText('startMenu.shotType')}:</span> 
            ${languageManager.getText(`shotTypes.${character.shotTypeId}`)}
        `;
        container.appendChild(shotTypeElement);
        
        const spellcardElement = document.createElement('div');
        spellcardElement.className = 'character-ability';
        spellcardElement.innerHTML = `
            <span>${languageManager.getText('startMenu.spellcard')}:</span> 
            ${languageManager.getText(`spellcards.${character.spellcardId}`)}
        `;
        container.appendChild(spellcardElement);
    }

    handleInput() {
        if (this.transitionState.active) return false;
        
        if (window.menuInputHandler.keys.ArrowLeft) {
            this.startTransition('left');
            window.menuInputHandler.keys.ArrowLeft = false;
            return false;
        }
        
        if (window.menuInputHandler.keys.ArrowRight) {
            this.startTransition('right');
            window.menuInputHandler.keys.ArrowRight = false;
            return false;
        }
        
        if (window.menuInputHandler.keys.z || window.menuInputHandler.keys.Z) {
            if (window.soundEffects?.ok && window.playSoundEffect) {
                window.playSoundEffect(window.soundEffects.ok);
            }
            
            // Get the selected character ID instead of name
            const selectedCharacterId = this.characters[this.currentCharacterIndex].id;
            
            // Call startGame with the character ID
            window.startGame(selectedCharacterId);
            
            window.menuInputHandler.keys.z = false;
            window.menuInputHandler.keys.Z = false;
            return true;
        }
        
        if (window.menuInputHandler.keys.x || window.menuInputHandler.keys.X) {
            if (window.soundEffects && window.soundEffects.cancel && window.playSoundEffect) {
                playSoundEffect(soundEffects.cancel);
            }
            transitionToMenu(MENU_STATES.MAIN);
            window.menuInputHandler.keys.x = false;
            window.menuInputHandler.keys.X = false;
            return true;
        }
        
        return false;
    }

    startTransition(direction) {
        // Add safety check for sound effects
        if (window.soundEffects && window.soundEffects.select && window.playSoundEffect) {
            window.playSoundEffect(window.soundEffects.select);
        }
        
        // Rest of the method remains the same...
        let nextIndex;
        if (direction === 'right') {
            nextIndex = (this.currentCharacterIndex + 1) % this.characters.length;
        } else { // left
            nextIndex = (this.currentCharacterIndex - 1 + this.characters.length) % this.characters.length;
        }
        
        this.transitionState = {
            active: true,
            direction,
            progress: 0,
            nextIndex
        };
        
        const transitionDuration = 300;
        const startTime = Date.now();
        
        const animateTransition = () => {
            const elapsed = Date.now() - startTime;
            this.transitionState.progress = Math.min(elapsed / transitionDuration, 1);
            
            this.render();
            
            if (this.transitionState.progress < 1) {
                requestAnimationFrame(animateTransition);
            } else {
                this.currentCharacterIndex = this.transitionState.nextIndex;
                this.transitionState.active = false;
                this.render();
            }
        };
        
        animateTransition();
    }
}