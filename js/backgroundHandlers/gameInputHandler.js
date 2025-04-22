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
            'e': false,
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

        // test
        if (key === '1' && e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
            itemManager.spawnItem(characterManager.cursor.x, characterManager.cursor.y - 100, '1up');
        } else if (key === '2' && e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
            itemManager.spawnItem(characterManager.cursor.x, characterManager.cursor.y - 100, 'bomb');
        } else if (key === '3' && e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
            itemManager.spawnItem(characterManager.cursor.x, characterManager.cursor.y - 100, 'fragment');
        } else if (key === '4' && e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
            itemManager.spawnItem(characterManager.cursor.x, characterManager.cursor.y - 100, 'full');
        } else if (key === '5' && e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
            itemManager.spawnItem(characterManager.cursor.x, characterManager.cursor.y - 100, 'power');
        } else if (key === '6' && e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
            itemManager.spawnItem(characterManager.cursor.x, characterManager.cursor.y - 100, 'point');
        }

        // Prevent default behavior
        if (key === 'ArrowLeft' || 
            key === 'ArrowRight' || 
            key === 'ArrowUp' || 
            key === 'ArrowDown' ||
            key === 'z' ||
            key === 'Z' ||
            key === 'x' ||
            key === 'X' ||
            key === 'e') {
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
        if (this.keys.z || this.keys.Z) {
            window.shotTypeManager?.shoot(
                window.characterManager.cursor,
                window.characterManager.focusMode
            );
        }

        if (this.keys['1'] && !this.keys['Shift']) {
            if (window.enemyManager && window.patternDatabase) {
                console.log('Available patterns:', Object.keys(window.patternDatabase));
                const enemy = window.enemyManager.addEnemy('fairy', {
                    x: canvas.width / 2,
                    y: 100,
                    bulletPatterns: [
                        {
                            name: "Real", // Must match exactly with pattern name
                            cooldown: 120
                        }
                    ]
                });
                console.log('Spawned enemy with pattern:', enemy);
                this.keys['1'] = false;
            }
        }
    
        // Bomb/Spellcard
        if ((this.keys.x || this.keys.X) && gameRunning && !characterManager.isSpellcardActive) {
            //spellcardManager.invokeSpellcard(characterManager.currentCharacter.name);
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
        if (this.keys.e) { // Press 'E' to spawn 3 fairies
            if (window.enemyManager) {
                const spawnArea = {
                    x: 100,
                    y: 100,
                    width: canvas.width - 200,
                    height: 300
                };
                window.enemyManager.spawnEnemies('fairy', 3, spawnArea);
                console.log('Spawned 3 fairies', window.enemyManager.activeEnemies);
                // Reset the key so it doesn't keep spawning
                this.keys.e = false;
            } else {
                console.error('Enemy manager not found');
            }
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