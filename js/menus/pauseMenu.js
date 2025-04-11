class PauseMenu {
    constructor() {
        this.container = null;
        this.buttons = [];
        this.selectedIndex = 0;
        this.confirmingQuit = false;
        this.isActive = false;
        this.inputLocked = false;
        this.keys = {
            'ArrowUp': false,
            'ArrowDown': false,
            'z': false,
            'Z': false,
            'x': false,
            'X': false,
            'Escape': false
        };
    }

    create() {
        if (this.container) return;
        
        this.container = document.createElement('div');
        this.container.className = 'pause-menu-container';
        
        // Create menu content
        const menuContent = document.createElement('div');
        menuContent.className = 'pause-menu-content';
        
        const title = document.createElement('div');
        title.className = 'pause-menu-title';
        title.textContent = 'Pause';
        this.titleElement = title;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'pause-menu-buttons';
        
        // Create buttons
        this.resumeButton = this.createButton('Resume');
        this.manualButton = this.createButton('Manual');
        this.quitButton = this.createButton('Quit Game');
        
        // Yes/No buttons (hidden initially)
        this.yesButton = this.createButton('Yes');
        this.noButton = this.createButton('No');
        this.yesButton.style.display = 'none';
        this.noButton.style.display = 'none';
        
        buttonContainer.append(
            this.resumeButton, 
            this.manualButton, 
            this.quitButton,
            this.yesButton,
            this.noButton
        );
        
        menuContent.append(title, buttonContainer);
        this.container.append(menuContent);
        
        document.querySelector('.container').appendChild(this.container);
        this.isActive = true;
        this.render();
        
        // Start pause menu loop
        this.startPauseLoop();
    }

    startPauseLoop() {
        const loop = (currentTime) => {
            if(!window.pauseMenuActive) return;
            this.handleInput();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    createButton(text) {
        const button = document.createElement('div');
        button.className = 'pause-menu-button';
        button.textContent = text;
        return button;
    }

    render() {
        if (!this.container) return;
        
        if (this.confirmingQuit) {
            this.titleElement.textContent = 'Really?';
            this.resumeButton.style.display = 'none';
            this.manualButton.style.display = 'none';
            this.quitButton.style.display = 'none';
            this.yesButton.style.display = '';
            this.noButton.style.display = '';
            this.selectedIndex = 1; // Default to No
        } else {
            this.titleElement.textContent = 'Pause';
            this.resumeButton.style.display = '';
            this.manualButton.style.display = '';
            this.quitButton.style.display = '';
            this.yesButton.style.display = 'none';
            this.noButton.style.display = 'none';
            this.selectedIndex = 0; // Default to Resume
        }
        
        this.updateButtonSelection();
    }

    updateButtonSelection() {
        const buttons = this.getActiveButtons();
        buttons.forEach((button, index) => {
            if (index === this.selectedIndex) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });
    }

    getActiveButtons() {
        if (this.confirmingQuit) {
            return [this.yesButton, this.noButton];
        }
        return [this.resumeButton, this.manualButton, this.quitButton];
    }

    handleInput() {
        const buttons = this.getActiveButtons();
        
        if (window.menuInputHandler.isKeyPressed('ArrowUp')) {
            this.selectedIndex = (this.selectedIndex - 1 + buttons.length) % buttons.length;
            playSoundEffect(soundEffects.select);
            this.updateButtonSelection();
        }
        
        if (window.menuInputHandler.isKeyPressed('ArrowDown')) {
            this.selectedIndex = (this.selectedIndex + 1) % buttons.length;
            playSoundEffect(soundEffects.select);
            this.updateButtonSelection();
        }
        
        if (window.menuInputHandler.isKeyPressed('z') || window.menuInputHandler.isKeyPressed('Z')) {
            this.handleSelection();
        }
        
        if (window.menuInputHandler.isKeyPressed('Escape')) {
            if (this.confirmingQuit) {
                this.confirmingQuit = false;
                this.render();
            } else {
                this.resumeGame();
            }
        }
    }

    handleSelection() {
        this.inputLocked = true;
        
        const buttons = this.getActiveButtons();
        const selectedButton = buttons[this.selectedIndex];
        
        if (this.confirmingQuit) {
            if (selectedButton === this.yesButton) {
                this.quitGame();
            } else {
                this.confirmingQuit = false;
                this.render();
            }
        } else {
            if (selectedButton === this.resumeButton) {
                this.resumeGame();
            } else if (selectedButton === this.manualButton) {
                console.log("Manual selected");
            } else if (selectedButton === this.quitButton) {
                this.confirmingQuit = true;
                this.render();
            }
        }
        
        this.inputLocked = false;
    }

    resumeGame() {
        playSoundEffect(soundEffects.ok);
        this.cleanup();
        window.resumeGame();
    }

    cleanup() {
        // Clear all key states
        for (const key in this.keys) {
            this.keys[key] = false;
        }

        // Remove DOM elements
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        // Clear references
        this.container = null;
        this.isActive = false;
        this.buttons = [];
    }

    quitGame() {
        playSoundEffect(soundEffects.cancel);
        this.cleanup();
        // Use window reference to ensure we're calling the global function
        window.quitToMenu();
    }

    handleKeyDown(e) {
        const key = e.key;
        if (key in this.keys) {
            this.keys[key] = true;
            e.preventDefault();
        }
        
        // Directly handle pause menu input
        this.processInput();
    }

    handleKeyUp(e) {
        const key = e.key;
        if (key in this.keys) {
            this.keys[key] = false;
        }
    }

    processInput() {
        if (this.keys['Escape']) {
            if (this.confirmingQuit) {
                this.confirmingQuit = false;
                this.render();
            } else {
                this.resumeGame();
            }
            this.keys['Escape'] = false;
            return;
        }

        if (this.keys['ArrowUp']) {
            this.selectedIndex = Math.max(0, this.selectedIndex - 1);
            playSoundEffect(soundEffects.select);
            this.updateButtonSelection();
            this.keys['ArrowUp'] = false;
        }

        if (this.keys['ArrowDown']) {
            const buttons = this.getActiveButtons();
            this.selectedIndex = Math.min(buttons.length - 1, this.selectedIndex + 1);
            playSoundEffect(soundEffects.select);
            this.updateButtonSelection();
            this.keys['ArrowDown'] = false;
        }

        if (this.keys['z'] || this.keys['Z']) {
            this.handleSelection();
            this.keys['z'] = false;
            this.keys['Z'] = false;
        }
    }
}