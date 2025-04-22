let highScore = localStorage.getItem('highScore') || 0;
let score = 0;
let playerLives = parseInt(localStorage.getItem('playerLives')) || 3;
let bombs = parseInt(localStorage.getItem('bombs')) || 3;
let power = 0;
let graze = 0;
let points = 0;
const POWER_LEVELS = [32, 64, 96, 128];
const MAX_POWER = 128;
let powerLevel = 0;

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
    if (!menuActive) {
        const playerStatsDisplay = document.getElementById('playerStatsDisplay');
        if (playerStatsDisplay) {
            playerStatsDisplay.innerHTML = `
                <br>
                <br>
                <div style="display: flex;">
                    <span class="highscore-text">High Score</span>
                    <span class="highscore-data">${padNumber(highScore, 9)}</span>
                </div>
                <div style="display: flex;">
                    <span class="score-text">Score</span>
                    <span class="score-data">${padNumber(score, 9)}</span>
                </div>
                <br>
                <div style="display: flex;">
                    <span class="player-text">Player</span>
                    <span>${generateStars(Math.min(playerLives - 1, 7), 'health')}</span>
                </div>
                <div style="display: flex;">
                    <span class="bomb-text">Bomb</span>
                    <span>${generateStars(Math.min(bombs, 7), 'bomb')}</span>
                </div>
                <br>
                <div style="display: flex;">
                    <span class="power-text">Power</span>
                    <span class="power-data">${power >= MAX_POWER ? 'MAX POWER' : `${power}`}</span>
                </div>
                <div style="display: flex;">
                    <span class="graze-text">Graze</span>
                    <span class="graze-data">${graze}</span>
                </div>
                <div style="display: flex;">
                    <span class="point-text">Point</span>
                    <span class="point-data">${points}</span>
                </div>
                <div class="statstitle", style="display: flex; justify-content: center;">
                    <span class="first-char">蓬</span>
                </div>
                <div class="statstitle", style="display: flex; justify-content: center;">
                    <span class="second-char">莱</span>
                </div>
                <div class="statstitle", style="display: flex; justify-content: center;">
                    <span class="third-char">人</span>
                </div>
                <div class="statstitle", style="display: flex; justify-content: center;">
                    <span class="fourth-char">形</span>
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
    playerLives = Math.min(Math.max(lives, 0), 8); // Clamp between 0-8
    updatePlayerStatsDisplay();
}

// Uppdatera antal bomber
function updateBombs(bombCount) {
    bombs = Math.min(Math.max(bombCount, 0), 7); // Clamp between 0-7
    updatePlayerStatsDisplay();
}

// Uppdatera antal power
function updatePower(points) {
    power = Math.min(power + points, 128);
    if (window.shotTypeManager) {
        window.shotTypeManager.setPower(power);
    }
    updatePlayerStatsDisplay();
}

function decreasePower(points) {
    power = Math.max(power - points, 0);
    if (window.shotTypeManager) {
        window.shotTypeManager.setPower(power);
    }
    updatePlayerStatsDisplay();
}

// Uppdatera antalet graze
function updateGraze(grazeCount) {
    graze = grazeCount;
    updatePlayerStatsDisplay();
}

function updatePoints(value) {
    points = Math.max(0, points + value);
    updatePlayerStatsDisplay();
}

// Testfunktion att återställa alla nummer
function resetStats() {
    score = 0;
    points = 0;
    playerLives = parseInt(localStorage.getItem('playerLives')) || 3;
    bombs = parseInt(localStorage.getItem('bombs')) || 3;
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