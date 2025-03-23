let selectedButton = 0; // Track the currently selected button
const menuButtons = ['Start', 'Practice Start', 'Score', 'Music Room', 'Options', 'Quit']; // List of menu buttons

// Render the main menu
function renderMainMenu(ctx) {
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw the menu background (optional, can be an image or color)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw the menu buttons
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';

    menuButtons.forEach((button, index) => {
        ctx.fillStyle = selectedButton === index ? 'yellow' : 'white'; // Highlight selected button
        ctx.fillText(button, ctx.canvas.width / 2, ctx.canvas.height / 2 + index * 50);
    });
}

// Handle menu input
function handleMenuInput() {
    // Handle navigation with arrow keys
    if (keys.ArrowUp) {
        selectedButton = (selectedButton - 1 + menuButtons.length) % menuButtons.length;
        keys.ArrowUp = false; // Reset key state to prevent continuous movement
    }
    if (keys.ArrowDown) {
        selectedButton = (selectedButton + 1) % menuButtons.length;
        keys.ArrowDown = false; // Reset key state to prevent continuous movement
    }

    // Select the button with Z
    if (keys.z || keys.Z) {
        switch (selectedButton) {
            case 0: // Start
                startGame(); // Start the game
                return true; // Signal to exit the menu
            case 1: // Practice Start
                console.log('Practice Start selected'); // Placeholder for now
                break;
            case 2: // Score
                console.log('Score selected'); // Placeholder for now
                break;
            case 3: // Music Room
                console.log('Music Room selected'); // Placeholder for now
                break;
            case 4: // Options
                console.log('Options selected'); // Placeholder for now
                break;
            case 5: // Quit
                resetGame(); // Reset the game
                break;
        }
        keys.z = false; // Reset key state to prevent multiple triggers
        keys.Z = false;
    }

    // Go back with X (not needed for now, but can be used later)
    if (keys.x || keys.X) {
        console.log('Back button pressed'); // Placeholder for now
        keys.x = false; // Reset key state to prevent multiple triggers
        keys.X = false;
    }

    return false; // Stay in the menu
}

// Function to reset the game
function resetGame() {
    // Unload/reset everything
    if (musicAudio) {
        musicAudio.pause();
        musicAudio = null;
    }

    // Stop the menu loop
    menuActive = false;

    // Reset selected button to Start
    selectedButton = 0;

    // Re-show the start screen
    document.getElementById('startScreen').style.display = 'flex';

    // Hide the statbox when returning to the menu
    document.getElementById('statsBox').style.display = 'none';

    // Clear the canvas after a short delay to ensure it happens after the final frame
    setTimeout(() => {
        const ctx = document.getElementById('canvas').getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        console.log('Canvas cleared after reset');
    }, 0); // 0ms delay ensures it runs after the current frame
}

// Expose functions to the global scope
window.renderMainMenu = renderMainMenu;
window.handleMenuInput = handleMenuInput;
window.resetGame = resetGame;