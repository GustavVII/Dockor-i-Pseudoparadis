// startMenuLoop.js

let menuActive = true; // Track if the menu is active
let selectedButton = 0; // Track the currently selected button (0 = Start)

// Render the main menu
function renderMainMenu(ctx) {
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw the menu background (optional, can be an image or color)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw the "Start" button
    ctx.fillStyle = selectedButton === 0 ? 'yellow' : 'white'; // Highlight selected button
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Start', ctx.canvas.width / 2, ctx.canvas.height / 2);
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
            requestAnimationFrame(gameLoop); // Start the game loop
        }
    }

    // Go back with X (not needed for now, but can be used later)
    if (keys.x || keys.X) {
        // Handle going back (if needed)
    }
}

// Main menu loop
function startMenuLoop() {
    if (menuActive) {
        // Handle menu input
        handleMenuInput();

        // Render the menu
        renderMainMenu(ctx);

        // Continue the loop
        requestAnimationFrame(startMenuLoop);
    }
}

// Start the main menu loop when the game is ready
function startMainMenu() {
    menuActive = true;
    startMenuLoop();
}