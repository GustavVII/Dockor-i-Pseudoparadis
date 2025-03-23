let menuActive = true; // Track if the menu is active

// Main menu loop
function startMenuLoop() {
    if (menuActive) {
        // Handle menu input
        if (handleMenuInput()) {
            // If handleMenuInput returns true, exit the menu
            menuActive = false;
            stopMenuMusic(); // Stop the menu music

            // Show the statbox when the game starts
            document.getElementById('statsBox').style.display = 'flex'; // Show the statbox
            updateStatsBox(); // Update the statbox content
            requestAnimationFrame(gameLoop); // Start the game loop
        }

        // Render the menu
        renderMainMenu(ctx);

        // Continue the loop
        requestAnimationFrame(startMenuLoop);
    } else {
        // If the menu is no longer active, clear the canvas
        const ctx = document.getElementById('canvas').getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        console.log('Canvas cleared after menu loop stopped');
    }
}

// Start the main menu loop when the game is ready
function startMainMenu() {
    menuActive = true;

    // Hide the statbox when the menu is active
    document.getElementById('statsBox').style.display = 'none';

    playMusic('assets/music/DiPP_01.mp3'); // Play the main menu music
    startMenuLoop();
}

// Stop the menu music
function stopMenuMusic() {
    if (musicAudio) {
        musicAudio.pause();
        musicAudio = null; // Unload the music
    }
}

// Expose the startMainMenu function to the global scope
window.startMainMenu = startMainMenu;