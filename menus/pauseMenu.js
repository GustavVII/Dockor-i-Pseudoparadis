let pauseMenuActive = false; // Track if the pause menu is active
let selectedPauseOption = 0; // Track the currently selected option (0 = Resume, 1 = Options, 2 = Exit)
let exitConfirmationActive = false; // Track if the exit confirmation menu is active
let selectedExitOption = 0; // Track the currently selected exit option (0 = No, 1 = Yes)

// Render the pause menu
function renderPauseMenu(ctx) {
    // Darken the game screen
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw the pause menu options
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';

    const options = ['Resume', 'Options', 'Exit'];
    const startY = ctx.canvas.height / 2 - 60;

    options.forEach((option, index) => {
        if (index === selectedPauseOption) {
            ctx.fillStyle = 'yellow'; // Highlight selected option
        } else {
            ctx.fillStyle = 'white';
        }
        ctx.fillText(option, ctx.canvas.width / 2, startY + index * 60);
    });

    // Render exit confirmation menu if active
    if (exitConfirmationActive) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(ctx.canvas.width / 2 - 150, ctx.canvas.height / 2 - 100, 300, 200);

        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Are you sure?', ctx.canvas.width / 2, ctx.canvas.height / 2 - 40);

        const exitOptions = ['Yes', 'No'];
        const exitStartY = ctx.canvas.height / 2;

        exitOptions.forEach((option, index) => {
            if (index === selectedExitOption) {
                ctx.fillStyle = 'yellow'; // Highlight selected option
            } else {
                ctx.fillStyle = 'white';
            }
            ctx.fillText(option, ctx.canvas.width / 2, exitStartY + index * 60);
        });
    }
}

// Handle pause menu input
function handlePauseMenuInput() {
    if (exitConfirmationActive) {
        // Handle exit confirmation menu input
        if (keys.ArrowUp || keys.ArrowDown) {
            selectedExitOption = (selectedExitOption + 1) % 2; // Toggle between No and Yes
            keys.ArrowUp = false; // Reset key state
            keys.ArrowDown = false; // Reset key state
        }

        if (keys.z || keys.Z) {
            if (selectedExitOption === 1) {
                // Yes: Set flag to exit to main menu
                shouldExitToMainMenu = true;
                pauseMenuActive = false;
                exitConfirmationActive = false;
            } else {
                // No: Close the exit confirmation menu
                exitConfirmationActive = false;
            }
            keys.z = false; // Reset key state
            keys.Z = false; // Reset key state
        }

        // Handle X key to cancel exit confirmation
        if (keys.x || keys.X) {
            exitConfirmationActive = false;
            keys.x = false; // Reset key state
            keys.X = false; // Reset key state
        }
    } else {
        // Handle main pause menu input
        if (keys.ArrowUp || keys.ArrowDown) {
            selectedPauseOption = (selectedPauseOption + 1) % 3; // Cycle through options
            keys.ArrowUp = false; // Reset key state
            keys.ArrowDown = false; // Reset key state
        }

        if (keys.z || keys.Z) {
            if (selectedPauseOption === 0) {
                // Resume: Unpause the game
                pauseMenuActive = false;
            } else if (selectedPauseOption === 1) {
                // Options: Do nothing for now (future implementation)
            } else if (selectedPauseOption === 2) {
                // Exit: Open the exit confirmation menu
                exitConfirmationActive = true;
                selectedExitOption = 0; // Default to "No"
            }
            keys.z = false; // Reset key state
            keys.Z = false; // Reset key state
        }

        // Handle X key to close the pause menu
        if (keys.x || keys.X) {
            pauseMenuActive = false;
            keys.x = false; // Reset key state
            keys.X = false; // Reset key state
        }
    }
}

// Pause the game and show the pause menu
function pauseGame() {
    pauseMenuActive = true;
    if (window.gameMusic) {
        window.gameMusic.pause(); // Pause the game music
    }
}

// Resume the game
function resumeGame() {
    pauseMenuActive = false;
    if (window.gameMusic) {
        window.gameMusic.play(); // Resume the game music
    }
}

// Expose functions to the global scope
window.renderPauseMenu = renderPauseMenu;
window.handlePauseMenuInput = handlePauseMenuInput;
window.pauseGame = pauseGame;
window.resumeGame = resumeGame;