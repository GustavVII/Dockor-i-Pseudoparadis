let highScore = localStorage.getItem('highScore') || 0; // Load high score from local storage
let score = 0;
let playerLives = 3; // Player starts with 3 lives (2 extra lives)
let bombs = 3; // Player starts with 3 bombs
let power = 0; // Power level
let graze = 0; // Graze count

// Function to pad numbers with leading zeros
function padNumber(number, length) {
    return String(number).padStart(length, '0');
}

// Function to generate star images
function generateStars(count, type) {
    let stars = '';
    for (let i = 0; i < count; i++) {
        stars += `<img src="assets/graphics/menu/${type}.png" alt="${type}" class="star">`;
    }
    return stars;
}

// Function to update the stats box
function updateStatsBox() {
    if (!menuActive) { // Only update the statbox if the game is active
        const statsBox = document.getElementById('statsBox');
        if (statsBox) {
            // High Score and Score
            statsBox.innerHTML = `
                <br>
                <br>
                <div style="display: flex; justify-content: space-between;">
                    <span>High Score</span>
                    <span>${padNumber(highScore, 9)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Score</span>
                    <span>${padNumber(score, 9)}</span>
                </div>
                <br>
                <div style="display: flex; justify-content: space-between;">
                    <span class="player-text">Player</span>
                    <span>${generateStars(playerLives - 1, 'health')}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span class="bomb-text">Bomb</span>
                    <span>${generateStars(bombs, 'bomb')}</span>
                </div>
                <br>
                <div style="display: flex; justify-content: space-between;">
                    <span>Power</span>
                    <span>${power}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Graze</span>
                    <span>${graze}</span>
                </div>
            `;
        }
    }
}

// Function to update the score
function updateScore(points) {
    score += points;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore); // Save new high score to local storage
    }
    updateStatsBox();
}

// Function to update player lives
function updatePlayerLives(lives) {
    playerLives = lives;
    updateStatsBox();
}

// Function to update bombs
function updateBombs(bombCount) {
    bombs = bombCount;
    updateStatsBox();
}

// Function to update power
function updatePower(powerLevel) {
    power = powerLevel;
    updateStatsBox();
}

// Function to update graze
function updateGraze(grazeCount) {
    graze = grazeCount;
    updateStatsBox();
}

// Function to reset all stats (except high score)
function resetStats() {
    score = 0;
    playerLives = 3;
    bombs = 3;
    power = 0;
    graze = 0;
    updateStatsBox();
}

// Reset stats when 'R' is pressed
window.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        resetStats();
    }
});