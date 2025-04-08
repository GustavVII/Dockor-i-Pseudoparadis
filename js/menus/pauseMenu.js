class PauseMenu {
    constructor() {
        this.container = null;
        this.buttons = [];
        this.selectedIndex = 0;
        this.confirmingQuit = false;
        this.isActive = false;
    }

    create() {
        if (this.container) return;
        
        this.container = document.createElement('div');
        this.container.className = 'pause-menu-container';
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'pause-menu-overlay';
        
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
        this.container.append(overlay, menuContent);
        
        document.querySelector('.container').appendChild(this.container);
        this.isActive = true;
        this.render();
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
    }

    resumeGame() {
        playSoundEffect(soundEffects.ok);
        this.cleanup();
        resumeGame();
    }

    quitGame() {
        playSoundEffect(soundEffects.cancel);
        this.cleanup();
        
        // Clean up game elements
        const container = document.querySelector('.container');
        const canvasContainer = container.querySelector('.canvas-container');
        if (canvasContainer) canvasContainer.remove();
        
        const statsDisplay = container.querySelector('#playerStatsDisplay');
        if (statsDisplay) statsDisplay.remove();
        
        // Reset game state
        gameRunning = false;
        menuActive = true;
        
        // Return to main menu
        window.menuHandler.showMenu();
        window.menuHandler.switchMenu(MENU_STATES.MAIN);
    }

    cleanup() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.isActive = false;
    }
}

const pauseMenu = new PauseMenu();
window.pauseMenu = pauseMenu;