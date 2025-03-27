// Function to initialize the level
function initializeLevel(levelData) {
    // Load level music
    playMusic(levelData.music);

    // Spawn the deck of cards
    spawnDeck(levelData.deck);

    // Initialize dialogue (if any)
    if (levelData.dialogue && levelData.dialogue.length > 0) {
        initializeDialogue(levelData.dialogue);
    }

    console.log(`Initialized level: ${levelData.levelName}`);
}

// Function to spawn the deck of cards
function spawnDeck(deck) {
    deck.forEach(card => {
        spawnCard(card.x, card.y, card.suit, card.number, card.isFaceDown, card.flipped180);
    });
}

// Function to initialize dialogue
function initializeDialogue(dialogue) {
    dialogue.forEach(message => {
        console.log(`Dialogue - ${message.speaker}: ${message.text}`);
        // Add your dialogue rendering logic here
    });
}

// Expose functions to the global scope
window.initializeLevel = initializeLevel;
window.spawnDeck = spawnDeck;
window.initializeDialogue = initializeDialogue;