class DifficultySelect {
    constructor(gameMode) {
        this.gameMode = gameMode;
        
        this.allDifficulties = [
            { id: 'easy', name: 'Easy' },
            { id: 'normal', name: 'Normal' },
            { id: 'hard', name: 'Hard' },
            { id: 'lunatic', name: 'Lunatic' },
            { id: 'extra', name: 'Extra' }
        ];
        
        // Filter difficulties based on game mode
        this.difficulties = this.getFilteredDifficulties();
        
        this.selectedIndex = 0;
        this.difficultySelected = false;
        this.container = null;
        this.buttons = [];
        this.clone = null;
        this.isAnimatingIn = false;
        this.isAnimatingOut = false;
    }

    getFilteredDifficulties() {
        switch(this.gameMode) {
            case 'extra':
                return this.allDifficulties.filter(d => d.id === 'extra');
            case 'practice':
                return this.allDifficulties.filter(d => d.id !== 'extra');
            default: // normal
                return this.allDifficulties.filter(d => d.id !== 'extra');
        }
    }

    async animateIn() {
        if (this.isAnimatingIn) return;
        this.isAnimatingIn = true;
        
        // Create container if it doesn't exist
        if (!this.container) {
            this.render();
        }

        // Set initial positions
        const title = this.container.querySelector('.difficulty-title');
        title.style.transform = 'translateY(-1000%)';
        
        this.buttons.forEach(button => {
            button.style.transform = 'translateX(300%)';
        });

        // Force reflow
        this.container.offsetHeight;

        // Animate in
        return new Promise(resolve => {
            // Title animation
            title.style.transform = 'translateY(0)';
            title.style.opacity = '1';

            // Buttons animation (staggered)
            this.buttons.forEach((button, index) => {
                setTimeout(() => {
                    button.style.opacity = index === this.selectedIndex ? '1' : '0.5';
                    button.style.transform = 'translateX(0)';
                }, 100);
            });

            setTimeout(() => {
                this.isAnimatingIn = false;
                resolve();
            }, 500);
        });
    }

    async animateOut() {
        if (this.isAnimatingOut || !this.container) return;
        this.isAnimatingOut = true;

        // Set initial positions
        const title = this.container.querySelector('.difficulty-title');
        title.style.transform = 'translateY(-1000%)';
        
        this.buttons.forEach(button => {
            button.style.transform = 'translateX(300%)';
        });

        // Force reflow
        this.container.offsetHeight;
        
        return new Promise(resolve => {
            // Title animation
            title.style.transition = 'transform 0.5s ease-out';
            title.style.transform = 'translateY(-1000%)';

            // Buttons animation
            this.buttons.forEach((button) => {
                setTimeout(() => {
                    button.style.transition = 'transform 0.5s ease-out';
                    button.style.transform = 'translateX(300%)';
                }, 500);
            });

            setTimeout(() => {
                this.isAnimatingOut = false;
                this.container.style.display = 'none';
                resolve();
            }, 500);
        });
    }

    async render() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'difficultySelectContainer';
            this.container.className = 'menu-container';
            document.querySelector('.container').appendChild(this.container);
        }

        this.container.innerHTML = '';
        
        // Use language manager for title
        const title = document.createElement('div');
        title.className = 'difficulty-title';
        this.container.appendChild(title);
        
        this.buttons = [];
        
        // Create buttons with fallback text
        title.textContent = languageManager.getText('menus.difficultySelect.title');
    
        this.difficulties.forEach((difficulty, index) => {
            const button = document.createElement('div');
            button.className = `difficulty-button ${difficulty.id} ${this.selectedIndex === index ? 'selected' : ''}`;
            
            const nameElement = document.createElement('div');
            nameElement.className = 'difficulty-name';
            nameElement.textContent = languageManager.getText(
                `menus.difficultySelect.difficulties.${difficulty.id}.name`,
                difficulty.name // fallback
            );
            
            const descElement = document.createElement('div');
            descElement.className = 'difficulty-description';
            descElement.textContent = languageManager.getText(
                `menus.difficultySelect.difficulties.${difficulty.id}.description`,
                'Default description' // fallback
            );
            
            button.appendChild(nameElement);
            button.appendChild(descElement);
            this.container.appendChild(button);
            this.buttons.push(button);
        });

        if (title) {
            title.style.transform = '';
            title.style.opacity = '';
        }
        
        this.buttons.forEach(button => {
            button.style.transform = '';
            button.style.opacity = '';
        });
        
        this.container.style.display = 'flex';
    }

    async animateSelection() {
        if (!this.buttons.length) return;
        
        window.menuHandler.inputLocked = true; // Lock input during transition
        const title = this.container.querySelector('.difficulty-title');
        const selectedButton = this.buttons[this.selectedIndex];
        
        // Add null check for selectedButton
        if (!selectedButton) {
            window.menuHandler.inputLocked = false;
            return;
        }
    
        // Ensure character data is loaded before proceeding
        if (window.menuHandler.characterSelect && !window.menuHandler.characterSelect.isInitialized) {
            await window.menuHandler.characterSelect.ensureDataLoaded();
        }
    
        try {
            // 1. Create clone of selected button
            this.clone = selectedButton.cloneNode(true);
            this.clone.classList.add('difficulty-clone');
            
            // Copy all computed styles
            const computedStyle = window.getComputedStyle(selectedButton);
            this.clone.style.cssText = computedStyle.cssText;
            
            // Set initial position
            const containerRect = this.container.getBoundingClientRect();
            const buttonRect = selectedButton.getBoundingClientRect();
            
            this.originalX = buttonRect.left - containerRect.left;
            this.originalY = buttonRect.top - containerRect.top;
            
            this.clone.style.position = 'absolute';
            this.clone.style.left = `${this.originalX}px`;
            this.clone.style.top = `${this.originalY}px`;
            this.clone.style.margin = '0';
            this.clone.style.pointerEvents = 'none';
            this.clone.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Append to container
            this.container.appendChild(this.clone);
            
            // 2. Hide original selected button
            selectedButton.style.opacity = '0';
            selectedButton.style.pointerEvents = 'none';
            
            // 3. Prepare character select menu (hidden at first)
            if (window.menuHandler.characterSelect) {
                await window.menuHandler.characterSelect.render();
                window.menuHandler.characterSelect.container.style.transform = 'translateX(100%)';
                window.menuHandler.characterSelect.container.style.opacity = '0';
                window.menuHandler.characterSelect.container.style.display = 'flex';
            }
            
            // 4. Start ALL animations simultaneously
            this.difficultySelected = true;
            
            // Force reflow to ensure animations trigger
            this.container.offsetHeight;
            
            // Animate everything at once
            await Promise.all([
                // Animate clone to corner
                new Promise(resolve => {
                    this.clone.style.left = '100px';
                    this.clone.style.top = `calc(100% - 150px)`;
                    this.clone.style.opacity = '0.8';
                    setTimeout(resolve, 500);
                }),
                
                // Animate other buttons out
                new Promise(resolve => {
                    const title = this.container.querySelector('.difficulty-title');
                    if (title) title.classList.add('fly-out');
                    
                    this.buttons.forEach((button, index) => {
                        if (index !== this.selectedIndex) {
                            button.classList.add('fly-out');
                        }
                    });
                    setTimeout(resolve, 500);
                }),
                
                // Animate character select in
                window.menuHandler.characterSelect?.animateIn()
            ]);
        } catch (error) {
            console.error('Error during animateSelection:', error);
            errorHandler.handleError(error);
        } finally {
            window.menuHandler.inputLocked = false; // Unlock when done
        }
    }

    async resetSelection() {
        if (!this.difficultySelected || !this.clone || window.menuHandler.inputLocked) return;
        
        window.menuHandler.inputLocked = true;
        
        // Store references
        const title = this.container.querySelector('.difficulty-title');
        const selectedButton = this.buttons[this.selectedIndex];

        try {
            // 1. Start ALL animations simultaneously
            await Promise.all([
                // Character select slides out
                window.menuHandler.characterSelect?.animateOut(),
                
                // Clone button returns to position
                new Promise(resolve => {
                    this.clone.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    this.clone.style.left = `${this.originalX}px`;
                    this.clone.style.top = `${this.originalY}px`;
                    this.clone.style.transform = 'scale(1)';
                    this.clone.style.opacity = '1';
                    setTimeout(resolve, 500);
                }),
                
                // Other buttons fly in
                new Promise(resolve => {
                    if (title) {
                        title.classList.remove('fly-out');
                        title.classList.add('fly-in-prepare');
                    }
                    
                    this.buttons.forEach(button => {
                        if (button !== selectedButton) {
                            button.classList.remove('fly-out');
                            button.classList.add('fly-in-prepare');
                        }
                    });
                    
                    // Force reflow
                    this.container.offsetHeight;
                    
                    if (title) title.classList.add('fly-in');
                    this.buttons.forEach(button => {
                        if (button !== selectedButton) {
                            button.classList.add('fly-in');
                        }
                    });
                    
                    setTimeout(resolve, 500);
                })
            ]);
            
            // 2. Final cleanup after all animations
            this.difficultySelected = false;
            this.container.style.display = 'flex';
            
            if (selectedButton) {
                selectedButton.style.opacity = '1';
                selectedButton.style.pointerEvents = '';
            }
            
            if (this.clone) {
                this.clone.remove();
                this.clone = null;
            }
            
            // Clean up animation classes
            if (title) {
                title.classList.remove('fly-in-prepare', 'fly-in');
            }
            this.buttons.forEach(button => {
                button.classList.remove('fly-in-prepare', 'fly-in');
            });
            
            this.render();
        } finally {
            window.menuHandler.inputLocked = false;
        }
    }

    async handleInput() {
        if (this.difficultySelected) return false;
        
        if (window.menuInputHandler.isKeyPressed('ArrowUp')) {
            this.selectedIndex = (this.selectedIndex - 1 + this.difficulties.length) % this.difficulties.length;
            playSoundEffect(soundEffects.select);
            this.render();
            return false;
        }
        
        if (window.menuInputHandler.isKeyPressed('ArrowDown')) {
            this.selectedIndex = (this.selectedIndex + 1) % this.difficulties.length;
            this.render();
            playSoundEffect(soundEffects.select);
            return false;
        }
        
        if (window.menuInputHandler.isKeyPressed('z') || window.menuInputHandler.isKeyPressed('Z')) {
            this.animateSelection();
            playSoundEffect(soundEffects.ok);
            return false;
        }
        
        if (window.menuInputHandler.isKeyPressed('x') || window.menuInputHandler.isKeyPressed('X')) {
            playSoundEffect(soundEffects.cancel);
            this.animateOut();
            await this.fadeToBlack();
            window.menuHandler.switchMenu(MENU_STATES.MAIN);
            return false;
        }
    }

    async fadeToBlack() {
        return new Promise((resolve) => {
            // Create black overlay
            this.blackOverlay = document.createElement('div');
            Object.assign(this.blackOverlay.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
                zIndex: '9999',
                opacity: '0',
                pointerEvents: 'none',
                transition: 'opacity 1s ease-out'
            });

            // Add to container
            const container = document.querySelector('.container');
            if (container) {
                container.appendChild(this.blackOverlay);
            } else {
                document.body.appendChild(this.blackOverlay);
            }

            // Force layout
            this.blackOverlay.getBoundingClientRect();

            // Start fade in
            this.blackOverlay.style.opacity = '1';

            const overlayElement = this.blackOverlay;

            // Remove after animation and resolve
            const onComplete = () => {
                if (overlayElement && overlayElement.parentNode) {
                    overlayElement.removeEventListener('transitionend', onComplete);
                    overlayElement.remove();
                }
                this.blackOverlay = null;
                resolve();
            };

            this.blackOverlay.addEventListener('transitionend', onComplete);
            
            // Fallback
            setTimeout(onComplete, 1100);
        });
    }

    cleanup() {
        if (this.container && this.container.parentNode) {
            this.container.remove();
        }
        this.container = null;
        this.buttons = [];
        if (this.clone && this.clone.parentNode) {
            this.clone.remove();
        }
        this.clone = null;
    }
}