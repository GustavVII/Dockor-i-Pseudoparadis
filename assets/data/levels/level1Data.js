const level1Data = {
    levelName: "Level 1 - Tutorial",
    music: "assets/music/DiPP_02.mp3", // Music for the level
    boss: "Murasa", // Boss for the level
    deck: [
        { suit: "H", number: 1, x: 100, y: 100, isFaceDown: false, flipped180: false }, // Ace of Hearts
        { suit: "S", number: 13, x: 150, y: 100, isFaceDown: true, flipped180: false }, // King of Spades
        { suit: "D", number: 7, x: 200, y: 100, isFaceDown: false, flipped180: true }, // 7 of Diamonds
        { suit: "C", number: 10, x: 250, y: 100, isFaceDown: true, flipped180: true }, // 10 of Clubs
        // Add more cards as needed
    ],
    dialogue: [
        { id: 1, speaker: "Murasa", text: "Welcome to the tutorial!" },
        { id: 2, speaker: "Player", text: "Let's get started!" },
        // Add more dialogue as needed
    ]
};

// Expose the level data to the global scope
window.level1Data = level1Data;