// js/backgroundHandlers/gameInputHandler.js
class GameInputHandler {
    constructor() {
        this.keys = {
            'ArrowLeft': false,
            'ArrowRight': false,
            'ArrowUp': false,
            'ArrowDown': false,
            'z': false,  // Shoot
            'Z': false,  // Shoot
            'x': false,  // Bomb/Spellcard
            'X': false,  // Bomb/Spellcard
            'Shift': false,
            'f': false,
            'F': false,
            '1': false,
            '2': false,
            '3': false,
            '4': false,
            '+': { pressed: false, handled: false },
            '-': { pressed: false, handled: false },
            'Escape': false
        };
    }

    resetAllKeys() {
        for (const key in this.keys) {
            if (key === '+' || key === '-') {
                this.keys[key] = { pressed: false, handled: false };
            } else {
                this.keys[key] = false;
            }
        }
    }

    handleKeyDown(e) {
        if (!gameRunning || window.pauseMenuActive) return;
        const key = e.key;

        if (key === 'Escape') {
            window.pauseGame();
            this.resetAllKeys();
            return;
        }

        if (key in this.keys) {
            if (key === '+' || key === '-') {
                if (!this.keys[key].pressed) {
                    this.keys[key].pressed = true;
                    this.keys[key].handled = false;
                }
            } else {
                this.keys[key] = true;
            }
        }

        // Handle case-insensitive keys
        if (key === 'z' || key === 'Z') {
            this.keys.z = true;
            this.keys.Z = true;
        }
        if (key === 'x' || key === 'X') {
            this.keys.x = true;
            this.keys.X = true;
        }

        // Character switching
        if (key === '1') {
            characterManager.setCharacter('Murasa');
        } else if (key === '2') {
            characterManager.setCharacter('Reimu');
        } else if (key === '3') {
            characterManager.setCharacter('Marisa');
        } else if (key === '4') {
            characterManager.setCharacter('Nue');
        }

        // Prevent default behavior
        if (key === ' ' || 
            key === 'ArrowLeft' || 
            key === 'ArrowRight' || 
            key === 'ArrowUp' || 
            key === 'ArrowDown' ||
            key === 'z' ||
            key === 'Z' ||
            key === 'x' ||
            key === 'X' ||
            key === 'f' ||
            key === 'F') {
            e.preventDefault();
        }
    }

    handleKeyUp(e) {
        if (!gameRunning || window.pauseMenuActive) return;
        const key = e.key;

        if (key === 'Escape') {
            return;
        }

        if (key in this.keys) {
            if (key === '+' || key === '-') {
                this.keys[key].pressed = false;
                this.keys[key].handled = false;
            } else {
                this.keys[key] = false;
            }
        }

        // Handle case-insensitive keys
        if (key === 'z' || key === 'Z') {
            this.keys.z = false;
            this.keys.Z = false;
        }
        if (key === 'x' || key === 'X') {
            this.keys.x = false;
            this.keys.X = false;
        }
    }

    handleInput() {     
        if (!gameRunning) return;
        // Shooting (both Z and Space)
        if ((this.keys.z || this.keys.Z) && shotTypeManager.cooldownCounter <= 0) {
            shotTypeManager.shoot(characterManager.cursor);
        }
    
        // Bomb/Spellcard
        if ((this.keys.x || this.keys.X) && gameRunning && !characterManager.isSpellcardActive) {
            spellcardManager.invokeSpellcard(characterManager.currentCharacter.name);
        }
    
        // Power adjustment
        if (this.keys['+'].pressed && !this.keys['+'].handled) {
            updatePower(1);
            this.keys['+'].handled = true;
        }
        if (this.keys['-'].pressed && !this.keys['-'].handled) {
            decreasePower(1);
            this.keys['-'].handled = true;
        }
        if (this.keys.f || this.keys.F) {
            enemyManager.spawnFairy(); // Spawn at random position with random color
        }
    
        // Focus mode
        if (this.keys.Shift) {
            characterManager.setFocusMode(true);
        } else {
            characterManager.setFocusMode(false);
        }
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
        
        this.container = null;
        this.isActive = false;
    }
}

function pauseGame() {
    if (!gameRunning || window.pauseMenu) return;
    
    window.pauseMenuActive = true;
    gameRunning = false;
    menuActive = false;
    
    // Pause audio
    if (window.musicAudio) {
        window.musicAudio.pause();
    }
    
    // Create new pause menu instance
    window.pauseMenu = new PauseMenu();
    window.pauseMenu.create();
    playSoundEffect(soundEffects.pause);
}

function resumeGame() {
    if (!window.pauseMenuActive || !window.pauseMenu) return;
    
    window.pauseMenuActive = false;
    gameRunning = true;
    menuActive = false;
    
    // Clean up pause menu
    window.pauseMenu.cleanup();
    window.pauseMenu = null;
    
    // Resume audio
    if (window.musicAudio) {
        window.musicAudio.play();
    }
    
    // Resume game loop
    lastFrameTime = performance.now();
    requestAnimationFrame(gameLoop);
}

function quitToMenu() {
    // Clean up pause menu first
    if (window.pauseMenu) {
        window.pauseMenu.cleanup();
        window.pauseMenu = null;
    }

    // Reset states
    window.pauseMenuActive = false;
    gameRunning = false;
    window.menuActive = true;

    // Clean up game elements
    const canvasContainer = document.querySelector('.canvas-container');
    if (canvasContainer) canvasContainer.remove();
    
    const statsDisplay = document.getElementById('playerStatsDisplay');
    if (statsDisplay) statsDisplay.remove();
    
    // Reset input states
    if (window.gameInputHandler && typeof window.gameInputHandler.resetAllKeys === 'function') {
        window.gameInputHandler.resetAllKeys();
    }
    if (window.menuInputHandler && typeof window.menuInputHandler.resetAllKeys === 'function') {
        window.menuInputHandler.resetAllKeys();
    }

    // Return to main menu
    if (window.menuHandler) {
        window.menuHandler.showMenu();
        window.menuHandler.switchMenu(MENU_STATES.MAIN);
        undeclareGameManagers();
        startMenuLoop();
    }

    menuActive = true
}

window.pauseGame = pauseGame;
window.resumeGame = resumeGame;
window.quitToMenu = quitToMenu;