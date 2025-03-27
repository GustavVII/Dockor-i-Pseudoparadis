class MenuInputHandler {
    constructor() {
        this.keys = {
            'ArrowUp': false,
            'ArrowDown': false,
            'ArrowLeft': false,
            'ArrowRight': false,
            'z': false,
            'Z': false,
            'x': false,
            'X': false
        };
    }

    handleKeyDown(e) {
        const key = e.key;
        if (key in this.keys) {
            this.keys[key] = true;
            
            if (key === 'ArrowUp' || key === 'ArrowDown') {
                if (window.playSoundEffect && window.soundEffects?.select) {
                    window.playSoundEffect(window.soundEffects.select);
                }
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
            playSoundEffect(soundEffects.cancel);
        }

        // Prevent default behavior for menu navigation keys
        if (key === 'ArrowUp' || key === 'ArrowDown') {
            e.preventDefault();
        }
    }

    handleKeyUp(e) {
        const key = e.key;
        if (key in this.keys) {
            this.keys[key] = false;
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
}