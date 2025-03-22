let flippedCardCount = 0;
let totalCardsFired = 0;
let totalSpellcardsInvoked = 0;
let currentPowerLevel = 0;

// Statbox uppdaterare
function updateStatsBox() {
    const statsBox = document.getElementById('statsBox');
    if (statsBox) {
        statsBox.innerHTML = `
            Flipped Cards: ${flippedCardCount}<br>
            Cards Fired: ${totalCardsFired}<br>
            Spellcards Invoked: ${totalSpellcardsInvoked}<br>
            Power Level: ${currentPowerLevel}<br>
            Active Spawners: ${currentPowerLevel + 1}
        `;
    }
}

// Funktioner för att öka alla olika stats
function incrementFlipCounter() {
    flippedCardCount += 1;
    updateStatsBox();
}

function incrementCardsFired() {
    totalCardsFired += 1;
    updateStatsBox();
}

function incrementSpellcardsInvoked() {
    totalSpellcardsInvoked += 1;
    updateStatsBox();
}

function updatePowerLevel(powerLevel) {
    currentPowerLevel = powerLevel;
    updateStatsBox();
}

// Funktion för at återställa alla stats
function resetStats() {
    flippedCardCount = 0;
    totalCardsFired = 0;
    totalSpellcardsInvoked = 0;
    currentPowerLevel = 0;
    updateStatsBox();
}

// R för återställning av stats
window.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        resetStats();
    }
});