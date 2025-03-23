// Öka kraftnivån
function increasePowerLevel() {
    if (shotTypeManager.powerLevel < 3) {
        shotTypeManager.powerLevel++;
        shotTypeManager.updateCooldownFrames();

        const spawnPositions = shotTypeManager.getSpawnPositions();
        spawnerManager.currentSpawnerPositions = spawnPositions.map(pos => ({ ...pos }));
        spawnerManager.targetSpawnerPositions = spawnPositions.map(pos => ({ ...pos }));

    }
}

// Minksa kraftnivån
function decreasePowerLevel() {
    if (shotTypeManager.powerLevel > 0) {
        shotTypeManager.powerLevel--;
        shotTypeManager.updateCooldownFrames();

        const spawnPositions = shotTypeManager.getSpawnPositions();
        spawnerManager.currentSpawnerPositions = spawnPositions.map(pos => ({ ...pos }));
        spawnerManager.targetSpawnerPositions = spawnPositions.map(pos => ({ ...pos }));

    }
}

// Ladda in korten
async function testDeck() {
    // Ladda Back.png first
    await loadBackImage();
    
    let x = 0;
    let y = 0;

    // Skapa alla kort
    for (const suit of suits) {
        for (let number = startNumber; number <= endNumber; number++) {
            // Tvinga flytta korten till nästa rad
            if (x + CARD_WIDTH > canvas.width) {
                x = 0;
                y += CARD_HEIGHT + 5; // Radmellanrum
            }

            const card = createCard(suit, number, x, y);
            card.image = await loadImage(`assets/graphics/cards/${suit}${number}.png`);

            cards.push(card);

            x += CARD_WIDTH + 5; // Mellanrum mellan på bred kort
        }

        x = 0;
        y += CARD_HEIGHT + 5;
    }

    // Blanda kort i slumpmässig ordning
    shuffleArray(cards);

    let index = 0;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 13; col++) {
            if (index < cards.length) {
                cards[index].x = col * (CARD_WIDTH + 5);
                cards[index].y = row * (CARD_HEIGHT + 5);
                index++;
            }
        }
    }

    renderCards(ctx);
}

window.increasePowerLevel = increasePowerLevel;
window.decreasePowerLevel = decreasePowerLevel;
window.testDeck = testDeck;

// Konsolfunktioner
window.spawnCard = spawnCard;
window.shoot = shotTypeManager.shoot.bind(shotTypeManager)