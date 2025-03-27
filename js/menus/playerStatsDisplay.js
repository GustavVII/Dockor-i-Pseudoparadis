let highScore = localStorage.getItem('highScore') || 0;
let score = 0;
let playerLives = 3;
let bombs = 3;
let power = 0;
let graze = 0;

// Få nummer att starta med 0
function padNumber(number, length) {
    return String(number).padStart(length, '0');
}

// Funktion för att kalla på ikonerna i lådan
function generateStars(count, type) {
    let stars = '';
    for (let i = 0; i < count; i++) {
        stars += `<img src="assets/graphics/menu/${type}.png" alt="${type}" class="star">`;
    }
    return stars;
}

// Updaterande av lådan
function updatePlayerStatsDisplay() {
    if (!menuActive) { // Rendera endast om inte i menyn, dvs i spelet
        const playerStatsDisplay = document.getElementById('playerStatsDisplay');
        if (playerStatsDisplay) {
            playerStatsDisplay.innerHTML = `
                <br>
                <br>
                <div style="display: flex; justify-content: space-between;">
                    <span class="highscore-text">High Score</span>
                    <span class="highscore-data">${padNumber(highScore, 9)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span class="score-text">Score</span>
                    <span class="score-data">${padNumber(score, 9)}</span>
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
                    <span class="power-text">Power</span>
                    <span class="power-data">${power}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span class="graze-text">Graze</span>
                    <span class="graze-data">${graze}</span>
                </div>
            `;
        }
    }
}

// poänguppdateringsfunktion
function updateScore(points) {
    score += points;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore); // Spara highscore till lokalminne
    }
    updatePlayerStatsDisplay();
}

// Uppdatera antal liv
function updatePlayerLives(lives) {
    playerLives = lives;
    updatePlayerStatsDisplay();
}

// Uppdatera antal bomber
function updateBombs(bombCount) {
    bombs = bombCount;
    updatePlayerStatsDisplay();
}

// Uppdatera antal power
function updatePower(powerLevel) {
    power = powerLevel;
    updatePlayerStatsDisplay();
}

// Uppdatera antalet graze
function updateGraze(grazeCount) {
    graze = grazeCount;
    updatePlayerStatsDisplay();
}

// Testfunktion att återställa alla nummer
function resetStats() {
    score = 0;
    playerLives = 3;
    bombs = 3;
    power = 0;
    graze = 0;
    updatePlayerStatsDisplay();
}

// Återställning vid tryck av R
window.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        resetStats();
    }
});