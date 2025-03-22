const keys = {
    'ArrowLeft': false,
    'ArrowRight': false,
    'ArrowUp': false,
    'ArrowDown': false,
    z: false,
    Z: false,
    ' ': false, // Space
    x: false,
    X: false,
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '+': { pressed: false, handled: false }, // Track if '+' has been handled
    '-': { pressed: false, handled: false }, // Track if '-' has been handled
    Shift: false, // Add Shift key for focus mode
};

// Handle key down events
function handleKeyDown(e) {

    const key = e.key; // Get the key that was pressed

    if (key in keys) {
        if (key === '+' || key === '-') {
            // Only process the key if it's not already pressed (to avoid key repeat)
            if (!keys[key].pressed) {
                keys[key].pressed = true; // Mark the key as pressed
                keys[key].handled = false; // Reset the handled flag
            }
        } else {
            keys[key] = true; // Update the key state for all other keys
        }
    }

    // Handle lowercase/uppercase synchronization for z and x
    if (key === 'z' || key === 'Z') {
        keys.z = true; // Update lowercase z
        keys.Z = true; // Update uppercase Z
    }
    if (key === 'x' || key === 'X') {
        keys.x = true; // Update lowercase x
        keys.X = true; // Update uppercase X
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

    if (key === ' ') {
        e.preventDefault(); // Prevent space from scrolling the page
    }
    if (key === 'ArrowLeft') {
        e.preventDefault(); // Prevent space from scrolling the page
    }
    if (key === 'ArrowRight') {
        e.preventDefault(); // Prevent space from scrolling the page
    }
    if (key === 'ArrowUp') {
        e.preventDefault(); // Prevent space from scrolling the page
    }
    if (key === 'ArrowDown') {
        e.preventDefault(); // Prevent space from scrolling the page
    }
}

function handleKeyUp(e) {

    const key = e.key; // Get the key that was released

    if (key in keys) {
        if (key === '+' || key === '-') {
            keys[key].pressed = false; // Mark the key as released
            keys[key].handled = false; // Reset the handled flag
        } else {
            keys[key] = false; // Update the key state for all other keys
        }
    }

    // Handle lowercase/uppercase synchronization for z and x
    if (key === 'z' || key === 'Z') {
        keys.z = false; // Update lowercase z
        keys.Z = false; // Update uppercase Z
    }
    if (key === 'x' || key === 'X') {
        keys.x = false; // Update lowercase x
        keys.X = false; // Update uppercase X
    }
}

// General input handling function
function handleInput() {
    // Handle movement
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

    // Handle shooting (check both z and Z)
    if ((keys.z || keys.Z) && shotTypeManager.cooldownCounter <= 0) {
        shotTypeManager.shoot(false, false, characterManager.cursor);
    }

    // Handle spellcard activation (check both x and X)
    if ((keys.x || keys.X) && !spellcardManager.isSpellcardActive) {
        spellcardManager.invokeSpellcard('Card Invokation: Threeshot', characterManager.cursor);
    }

    // Handle power level changes (debug)
    if (keys['+'].pressed && !keys['+'].handled) {
        increasePowerLevel();
        keys['+'].handled = true; // Mark the key as handled
    }
    if (keys['-'].pressed && !keys['-'].handled) {
        decreasePowerLevel();
        keys['-'].handled = true; // Mark the key as handled
    }

    // Handle focus mode
    if (keys.Shift) {
        characterManager.setFocusMode(true); // Enable focus mode
    } else {
        characterManager.setFocusMode(false); // Disable focus mode
    }
}

// Add event listeners for key handling

window.handleInput = handleInput;