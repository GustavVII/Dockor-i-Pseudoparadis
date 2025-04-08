class MenuInputHandler {
    constructor() {
        this.initialDelay = 500;   // Initial delay before repeat starts (ms)
        this.repeatDelay = 125;     // Delay between repeats (ms)
        this.resetAllKeys();
    }

    resetAllKeys() {
        this.keys = {
            'ArrowUp': { 
                pressed: false, 
                lastPressed: 0, 
                isInInitialDelay: false,
                readyToFire: false 
            },
            'ArrowDown': { 
                pressed: false, 
                lastPressed: 0, 
                isInInitialDelay: false,
                readyToFire: false 
            },
            'ArrowLeft': { 
                pressed: false, 
                lastPressed: 0, 
                isInInitialDelay: false,
                readyToFire: false 
            },
            'ArrowRight': { 
                pressed: false, 
                lastPressed: 0, 
                isInInitialDelay: false,
                readyToFire: false 
            },
            'z': { pressed: false, processed: false },
            'Z': { pressed: false, processed: false },
            'x': { pressed: false, processed: false },
            'X': { pressed: false, processed: false }
        };
    }

    handleKeyDown(e) {
        if (window.menuHandler.inputLocked) {console.log("can't tap; input locked"); return;}
        const key = e.key;
        const now = Date.now();

        if (key in this.keys && !this.keys[key].pressed) {
            this.keys[key] = {
                ...this.keys[key],
                pressed: true,
                lastPressed: now,
                isInInitialDelay: true,
                readyToFire: true
            };

            // Play sounds
            if (key.startsWith('Arrow') && window.soundEffects?.select) {
                window.playSoundEffect(window.soundEffects.select);
            }
            else if ((key === 'x' || key === 'X') && window.soundEffects?.cancel) {
                window.playSoundEffect(window.soundEffects.cancel);
            }

            if (key.startsWith('Arrow')) {
                e.preventDefault();
            }
        }
    }

    handleKeyUp(e) {
        const key = e.key;
        if (key in this.keys) {
            this.keys[key] = {
                ...this.keys[key],
                pressed: false,
                processed: false,
                isInInitialDelay: false,
                readyToFire: false
            };
        }
    }

    isKeyPressed(key) {
        if (!(key in this.keys)) return false;
        
        const keyState = this.keys[key];
        const now = Date.now();

        // For action keys (Z/X) - single press only
        if (key === 'z' || key === 'Z' || key === 'x' || key === 'X') {
            if (keyState.pressed && !keyState.processed) {
                keyState.processed = true;
                return true;
            }
            return false;
        }

        // For arrow keys
        if (keyState.pressed) {
            if (keyState.readyToFire) {
                // First press or new press after release
                keyState.readyToFire = false;
                keyState.lastPressed = now;
                return true;
            } else {
                const timeSinceLast = now - keyState.lastPressed;
                const currentDelay = keyState.isInInitialDelay ? this.initialDelay : this.repeatDelay;
                
                if (timeSinceLast > currentDelay) {
                    keyState.isInInitialDelay = false;
                    keyState.lastPressed = now;
                    return true;
                }
            }
        }
        return false;
    }
}