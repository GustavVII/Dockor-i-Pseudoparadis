let pauseMenuActive = false;
let selectedPauseOption = 0;
let exitConfirmationActive = false;
let selectedExitOption = 0;

// Pausmeny
function renderPauseMenu(ctx) {
    // Darken the game screen
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Rita in valen
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';

    const options = ['Resume', 'Options', 'Exit'];
    const startY = ctx.canvas.height / 2 - 60;

    options.forEach((option, index) => {
        if (index === selectedPauseOption) {
            ctx.fillStyle = 'yellow'; // Highlighta vald knapp
        } else {
            ctx.fillStyle = 'white';
        }
        ctx.fillText(option, ctx.canvas.width / 2, startY + index * 60);
    });

    // Visa bekräftelsemeny
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
                ctx.fillStyle = 'yellow';
            } else {
                ctx.fillStyle = 'white';
            }
            ctx.fillText(option, ctx.canvas.width / 2, exitStartY + index * 60);
        });
    }
}

// Hantera input för pausmenyn
function handlePauseMenuInput() {
    if (exitConfirmationActive) {
        // Bekräftelse för att lämna
        if (keys.ArrowUp || keys.ArrowDown) {
            selectedExitOption = (selectedExitOption + 1) % 2;
            keys.ArrowUp = false;
            keys.ArrowDown = false;
        }

        if (keys.z || keys.Z) {
            if (selectedExitOption === 0) {
                shouldExitToMainMenu = true;
                pauseMenuActive = false;
                exitConfirmationActive = false;
            } else {
                exitConfirmationActive = false;
            }
            keys.z = false;
            keys.Z = false;
        }

        if (keys.x || keys.X) {
            exitConfirmationActive = false;
            keys.x = false;
            keys.X = false;
        }
    } else {
        // Egentliga pausmenyn
        if (keys.ArrowUp || keys.ArrowDown) {
            selectedPauseOption = (selectedPauseOption + 1) % 3;
            keys.ArrowUp = false;
            keys.ArrowDown = false;
        }

        if (keys.z || keys.Z) {
            if (selectedPauseOption === 0) {
                // Resume: fortsätt spelet
                pauseMenuActive = false;
            } else if (selectedPauseOption === 1) {
                // Options: Framtida saker här
            } else if (selectedPauseOption === 2) {
                // Exit: Öppna meny för bekräftelse
                exitConfirmationActive = true;
                selectedExitOption = 1;
            }
            keys.z = false;
            keys.Z = false;
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