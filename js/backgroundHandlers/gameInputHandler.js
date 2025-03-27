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
            ' ': false,  // Alternative shoot
            'Shift': false,
            '1': false,
            '2': false,
            '3': false,
            '4': false,
            '+': { pressed: false, handled: false },
            '-': { pressed: false, handled: false },
            'Escape': false
        };
    }

    handleKeyDown(e) {
        const key = e.key;

        if (key === 'Escape') {
            if (pauseMenuActive) {
                resumeGame();
            } else {
                pauseGame();
            }
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
            key === 'X') {
            e.preventDefault();
        }
    }

    handleKeyUp(e) {
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
        // Character movement
        if (this.keys.ArrowLeft) {
            characterManager.moveCursor('left');
        }
        if (this.keys.ArrowRight) {
            characterManager.moveCursor('right');
        }
        if (this.keys.ArrowUp) {
            characterManager.moveCursor('up');
        }
        if (this.keys.ArrowDown) {
            characterManager.moveCursor('down');
        }

        // Shooting (both Z and Space)
        if ((this.keys.z || this.keys.Z ) && shotTypeManager.cooldownCounter <= 0) {
            shotTypeManager.shoot(false, false, characterManager.cursor);
        }

        // Bomb/Spellcard
        if ((this.keys.x || this.keys.X) && !pauseMenuActive && !characterManager.isSpellcardActive) {
            spellcardManager.invokeSpellcard(characterManager.currentCharacter.name);
        }

        // Power level adjustment
        if (this.keys['+'].pressed && !this.keys['+'].handled) {
            increasePowerLevel();
            this.keys['+'].handled = true;
        }
        if (this.keys['-'].pressed && !this.keys['-'].handled) {
            decreasePowerLevel();
            this.keys['-'].handled = true;
        }

        // Focus mode
        if (this.keys.Shift) {
            characterManager.setFocusMode(true);
        } else {
            characterManager.setFocusMode(false);
        }
    }
}
const gameInputHandler = new GameInputHandler();
    window.gameInputHandler = gameInputHandler;