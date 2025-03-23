// inputHandler.js

const keys = {
    'ArrowLeft': false,
    'ArrowRight': false,
    'ArrowUp': false,
    'ArrowDown': false,
    z: false,
    Z: false,
    ' ': false, // Mellanslag
    x: false,
    X: false,
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '+': { pressed: false, handled: false },
    '-': { pressed: false, handled: false },
    Shift: false
};

function handleKeyDown(e) {
    const key = e.key; // Tryckt tangent

    if (key === 'Escape') {
        // Toggle pause menu
        if (pauseMenuActive) {
            resumeGame();
        } else {
            pauseGame();
        }
    }

    if (key in keys) {
        if (key === '+' || key === '-') {
            // Antispam
            if (!keys[key].pressed) {
                keys[key].pressed = true;
                keys[key].handled = false;
            }
        } else {
            keys[key] = true;
        }
    }

    // Fix så tangenter fungerar både med och utan shift
    if (key === 'z' || key === 'Z') {
        keys.z = true;
        keys.Z = true;
    }
    if (key === 'x' || key === 'X') {
        keys.x = true;
        keys.X = true;
    }

    // Karaktärsbyte
    if (key === '1') {
        characterManager.setCharacter('Murasa');
    } else if (key === '2') {
        characterManager.setCharacter('Reimu');
    } else if (key === '3') {
        characterManager.setCharacter('Marisa');
    } else if (key === '4') {
        characterManager.setCharacter('Nue');
    }

    // Stoppa en massa tangenter från sina vanliga beteenden
    // Som mellanslags skärmskroll eller piltangenternas flyttande
    if (key === ' ') {
        e.preventDefault();
    }
    if (key === 'ArrowLeft') {
        e.preventDefault();
    }
    if (key === 'ArrowRight') {
        e.preventDefault();
    }
    if (key === 'ArrowUp') {
        e.preventDefault();
    }
    if (key === 'ArrowDown') {
        e.preventDefault();
    }
}

function handleKeyUp(e) {
    const key = e.key; // Släppt tangent

    if (key === 'Escape') {
        // Do nothing on key up for Escape
        return;
    }

    // Antispam 2
    if (key in keys) {
        if (key === '+' || key === '-') {
            keys[key].pressed = false;
            keys[key].handled = false;
        } else {
            keys[key] = false; // Update the key state for all other keys
        }
    }

    // Shift fix 2
    if (key === 'z' || key === 'Z') {
        keys.z = false;
        keys.Z = false;
    }
    if (key === 'x' || key === 'X') {
        keys.x = false;
        keys.X = false;
    }
}

// Generell referensfunktion för input
function handleInput() {
    // Karaktärsförflyttning
    if (keys.ArrowLeft) {
        characterManager.moveCursor('left');
    }
    if (keys.ArrowRight) {
        characterManager.moveCursor('right');
    }
    if (keys.ArrowUp) {
        characterManager.moveCursor('up');
    }
    if (keys.ArrowDown) {
        characterManager.moveCursor('down');
    }

    // Skotlossning
    if ((keys.z || keys.Z) && shotTypeManager.cooldownCounter <= 0) {
        shotTypeManager.shoot(false, false, characterManager.cursor);
    }

    // Trollkortsåbekallning (only if pause menu is not active)
    if ((keys.x || keys.X) && !spellcardManager.isSpellcardActive && !pauseMenuActive) {
        spellcardManager.invokeSpellcard('', characterManager.cursor);
        spellcardManager.isSpellcardActive = true;
    }

    // Tag bort detta senare; för testande
    if (keys['+'].pressed && !keys['+'].handled) {
        increasePowerLevel();
        keys['+'].handled = true;
    }
    if (keys['-'].pressed && !keys['-'].handled) {
        decreasePowerLevel();
        keys['-'].handled = true;
    }

    // Fokusläge med shift
    if (keys.Shift) {
        characterManager.setFocusMode(true);
    } else {
        characterManager.setFocusMode(false);
    }
}

// Handle menu input
function handleMenuInput() {
    if (keys.ArrowUp || keys.ArrowDown) {
        // For now, since there's only one button, we don't need to change the selection
        // But we can add more buttons later and handle navigation here
    }

    // Select the button with Z
    if (keys.z || keys.Z) {
        if (selectedButton === 0) {
            // Start the game
            menuActive = false; // Exit the menu
            stopMenuMusic(); // Stop the menu music
            requestAnimationFrame(gameLoop); // Start the game loop
        }
    }

    // Go back with X (not needed for now, but can be used later)
    if (keys.x || keys.X) {
        // Handle going back (if needed)
    }

    return false; // Stay in the menu
}

// Globalizerung :swagger:
window.handleInput = handleInput;
window.handleMenuInput = handleMenuInput; // Export handleMenuInput