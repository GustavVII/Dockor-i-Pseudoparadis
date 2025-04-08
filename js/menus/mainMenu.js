// mainMenu.js
class MainMenu {
    constructor() {
        this.selectedButton = 0;
        this.menuButtons = ['start', 'extraStart', 'practiseStart', 'score', 'musicRoom', 'options', 'quit'];
        this.isAnimatingOut = false;
        this.title = new Title();
        this.showingTitle = true;
        this.buttonsVisible = false;
        this.titleInitialized = false;

        this.lastSelectionTime = 0;
        this.initialDelay = window.menuInputHandler?.initialDelay || 500;
        this.repeatDelay = window.menuInputHandler?.repeatDelay || 125;
        this.isFirstPress = true;

        this.optionsMenu = null;
        this.isOptionsSubmenuActive = false;
    }

    createWhiteOverlay() {
        // Remove existing overlay if it exists
        if (this.whiteOverlay) {
            this.whiteOverlay.remove();
        }

        // Create new overlay
        this.whiteOverlay = document.createElement('div');
        this.whiteOverlay.className = 'main-menu-overlay';
        
        // Style the overlay
        Object.assign(this.whiteOverlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            zIndex: '9999',
            opacity: '1',
            pointerEvents: 'none', // Allow clicks to pass through
            transition: 'opacity 3s ease-out'
        });

        // Add to container instead of body
        const container = document.querySelector('.container');
        if (container) {
            container.appendChild(this.whiteOverlay);
        } else {
            document.body.appendChild(this.whiteOverlay);
        }
    }

    async initialize() {
        // Ensure overlay exists
        if (!this.whiteOverlay) {
            this.createWhiteOverlay();
        }

        // Force layout before starting animation
        this.whiteOverlay.getBoundingClientRect();

        // Start fade out animation
        this.whiteOverlay.style.opacity = '0';

        // Set up removal after animation
        const removeOverlay = () => {
            this.whiteOverlay.removeEventListener('transitionend', removeOverlay);
            this.whiteOverlay.remove();
            this.whiteOverlay = null;
        };
        this.whiteOverlay.addEventListener('transitionend', removeOverlay);

        // Fallback removal in case transitionend doesn't fire
        setTimeout(() => {
            if (this.whiteOverlay && this.whiteOverlay.style.opacity === '0') {
                this.whiteOverlay.remove();
                this.whiteOverlay = null;
            }
        }, 3100); // Slightly longer than the transition duration

        if (!this.titleInitialized) {
            await this.title.create();
            await this.title.animateIn();
            this.titleInitialized = true;
        }
        this.renderButtons(false);
    }

    renderButtons(visible) {
        
        const menuBox = document.getElementById('menuBox');
        if (!menuBox) return;
        
        // Clear existing content
        menuBox.innerHTML = '';
        
        // Create buttons container if it doesn't exist
        let buttonsContainer = menuBox.querySelector('.menu-buttons-container');
        if (!buttonsContainer) {
            buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'menu-buttons-container';
            menuBox.appendChild(buttonsContainer);
        }
        
        // Create buttons
        this.menuButtons.forEach((item, index) => {
            const buttonElement = document.createElement('div');
            buttonElement.className = `menu-button ${this.selectedButton === index ? 'selected' : ''}`;
            
            if (item === 'extraStart') {
                buttonElement.classList.add('extra-start');
                if (!window.clearedGame) {
                    buttonElement.classList.add('disabled');
                }
            }
            
            buttonElement.textContent = languageManager.getText(`menus.mainMenu.${item}`);
            buttonsContainer.appendChild(buttonElement);
            
            // Set initial state
            buttonElement.style.transform = visible ? 'translateX(0)' : 'translateX(100%)';
            buttonElement.style.opacity = visible ? '1' : '0';
        });
        
        this.buttonsVisible = visible;
    }

    async handleInput() {
        if (window.menuHandler.inputLocked || this.isAnimatingOut) {
            return false;
        }

        // Handle title screen state
        if (this.showingTitle) {
            if ((window.menuInputHandler.isKeyPressed('z') || window.menuInputHandler.isKeyPressed('Z'))) {
                playSoundEffect(soundEffects.ok);
                window.menuHandler.inputLocked = true;
                
                try {
                    // Move title to side and animate buttons in
                    await this.title.moveToSide();
                    await this.animateButtonsIn();
                    
                    this.showingTitle = false;
                } finally {
                    window.menuHandler.inputLocked = false;
                }
                return false;
            }
            return false;
        }
    
        const now = Date.now();
        let selectionChanged = false;

        // Handle up arrow
        if (window.menuInputHandler.isKeyPressed('ArrowUp')) {
            const delay = this.isFirstPress ? 0 : (now - this.lastSelectionTime > this.initialDelay ? this.repeatDelay : 0);
            
            if (now - this.lastSelectionTime > delay) {
                do {
                    this.selectedButton = (this.selectedButton - 1 + this.menuButtons.length) % this.menuButtons.length;
                } while (this.selectedButton === 1 && !window.clearedGame && this.menuButtons.length > 1);
                selectionChanged = true;
                this.isFirstPress = false;
            }
        }
        
        // Handle down arrow
        if (window.menuInputHandler.isKeyPressed('ArrowDown')) {
            const delay = this.isFirstPress ? 0 : (now - this.lastSelectionTime > this.initialDelay ? this.repeatDelay : 0);
            
            if (now - this.lastSelectionTime > delay) {
                do {
                    this.selectedButton = (this.selectedButton + 1) % this.menuButtons.length;
                } while (this.selectedButton === 1 && !window.clearedGame && this.menuButtons.length > 1);
                selectionChanged = true;
                this.isFirstPress = false;
            }
        }

        // Reset first press flag if no keys are pressed
        if (!window.menuInputHandler.isKeyPressed('ArrowUp') && !window.menuInputHandler.isKeyPressed('ArrowDown')) {
            this.isFirstPress = true;
        }

        // If selection changed, update state and play sound
        if (selectionChanged) {
            this.lastSelectionTime = now;
            this.renderButtons(true);
            playSoundEffect(soundEffects.select);
            return false;
        }

        // Handle Z button (confirmation)
        if ((window.menuInputHandler.isKeyPressed('z') || window.menuInputHandler.isKeyPressed('Z')) && 
            !this.isAnimatingOut) {
            playSoundEffect(soundEffects.ok);
            this.isAnimatingOut = true;
            
            // Reset key states immediately
            window.menuInputHandler.keys.z = false;
            window.menuInputHandler.keys.Z = false;
            
            try {
                await this.animateButtonsExit();
                await this.transitionToNextMenu();
            } finally {
                this.isAnimatingOut = false;
            }
            return false;
        }

        // Handle X button (back/cancel)
        if (window.menuInputHandler.isKeyPressed('x') || window.menuInputHandler.isKeyPressed('X')) {
            playSoundEffect(soundEffects.cancel);
            console.log('Back button pressed');
            return false;
        }

        return false;
    }

    async transitionToNextMenu() {
        
        if (this.selectedButton !== 5) { // Not options menu
            this.fadeToBlack();
        }

        // Use different title animations based on destination
        const titleAnimation = this.selectedButton === 5 
            ? this.title.animateToLeft() // For options menu
            : this.title.animateOut();   // For other menus

        if(this.selectedButton === 5) {
            this.optionsMenu = new OptionsMenu();
            this.optionsMenu.render();
        }
        
        // Animate buttons out and appropriate title animation
        await Promise.all([
            this.animateButtonsExit(),
            titleAnimation
        ]);
        
        // Then proceed with menu transition
        switch (this.selectedButton) {
            case 0: // Start
                await window.menuHandler.switchMenu(MENU_STATES.CHARACTER_SELECT, 'normal');
                break;
                
            case 1: // Extra Start (if cleared)
                await window.menuHandler.switchMenu(MENU_STATES.CHARACTER_SELECT, 'extra');
                break;
                
            case 2: // Practice Start
                await window.menuHandler.switchMenu(MENU_STATES.CHARACTER_SELECT, 'practice');
                break;
                
            case 4: // Music Room
                await window.menuHandler.switchMenu(MENU_STATES.MUSIC_ROOM);
                break;
                
            case 5: // Options
                await this.animateToOptions();
                break;
                
            case 6: // Quit
                window.menuHandler.resetGame();
                break;
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

    async animateButtonsIn() {
        const buttons = document.querySelectorAll('.menu-button');
        if (!buttons.length) return;
        
        return new Promise(resolve => {
            buttons.forEach((button, index) => {
                setTimeout(() => {
                    button.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    button.style.opacity = '1';
                    button.style.transform = 'translateX(0)';
                }, 100);
            });
            
            setTimeout(resolve, 500);
        });
    }

    async animateButtonsEnter() {
        const buttonsContainer = document.querySelector('#menuBox .menu-buttons-container');
        if (!buttonsContainer) return;
        
        const buttons = buttonsContainer.querySelectorAll('.menu-button');
        if (!buttons.length) return;
        
        return new Promise(resolve => {
            // Force reflow
            void buttonsContainer.offsetHeight;
            
            buttons.forEach(button => {
                button.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.5s ease-out';
                button.style.transform = 'translateX(0)';
                button.style.opacity = '1';
            });
            
            setTimeout(resolve, 500);
        });
    }
    
    async animateButtonsExit() {
        const buttonsContainer = document.querySelector('#menuBox .menu-buttons-container');
        if (!buttonsContainer) return;
        
        const buttons = buttonsContainer.querySelectorAll('.menu-button');
        if (!buttons.length) return;
        
        return new Promise(resolve => {
            buttons.forEach(button => {
                button.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-out';
                button.style.transform = 'translateX(100vw)';
            });
            
            resolve();
        });
    }

    async animateToOptions() {
        if (this.isOptionsSubmenuActive) return;

        window.menuHandler.inputLocked = true;
        this.isOptionsSubmenuActive = true;
                
        
        // Start all animations
        await Promise.all([
            this.optionsMenu.animateInFromLeft(),
            this.title.animateToLeft(),
            this.animateButtonsExit(),
        ]);
        
        window.menuHandler.isSubmenuActive = true;
        window.menuHandler.inputLocked = false;
    }

    async returnFromOptions() {
        if (!this.isOptionsSubmenuActive) return;

        window.menuHandler.inputLocked = true;
        
        await Promise.all([
            this.animateButtonsEnter(),
            this.title.animateFromLeft(),
            this.optionsMenu.animateOutToLeft()
        ]);
        
        this.optionsMenu.cleanup();
        this.optionsMenu = null;
        this.isOptionsSubmenuActive = false;
        window.menuHandler.isSubmenuActive = false;
        window.menuHandler.inputLocked = false;
    }
}