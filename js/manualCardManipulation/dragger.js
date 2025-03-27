// Kolla för närvarande valt kort
let selectedCard = null;

// Funktion för att kolla om en viss punk är inom ramarna av ett kort
function isPointInCard(x, y, card) {
    return (
        x >= card.x &&
        x <= card.x + CARD_WIDTH &&
        y >= card.y &&
        y <= card.y + CARD_HEIGHT
    );
}

// Funktion för att föra fram kort
function bringCardToFront(card) {
    const index = cards.indexOf(card);
    if (index !== -1) {
        cards.splice(index, 1);
        cards.push(card);
    }
}

// Hantering av musklick
function handleMouseDown(e) {
    const rect = e.target.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left);
    const mouseY = (e.clientY - rect.top);

    // Finn kort under musen
    for (let i = cards.length - 1; i >= 0; i--) {
        const card = cards[i];
        if (isPointInCard(mouseX, mouseY, card)) {
            selectedCard = card;
            bringCardToFront(card); // Dra fram kortet
            break;
        }
    }
}

// Hantera musförflyttning
function handleMouseMove(e) {
    if (selectedCard) {
        const rect = e.target.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left);
        const mouseY = (e.clientY - rect.top);

        // Updatera kortets position
        if (selectedCard.flipped180) {
            // Justera för upponervända kort
            selectedCard.x = mouseX - (CARD_WIDTH / 2);
            selectedCard.y = mouseY - (CARD_HEIGHT / 2);
        } else {
            // Normal positionering
            selectedCard.x = mouseX - (CARD_WIDTH / 2);
            selectedCard.y = mouseY - (CARD_HEIGHT / 2);
        }
    }
}

// Hantera klick-släpp
function handleMouseUp() {
    selectedCard = null;
}

// Hantera tryck av E för att vända kort
function handleKeyPress(e) {
    if ((e.key === 'e' || e.key === 'E') && selectedCard) {
        selectedCard.isFaceDown = !selectedCard.isFaceDown; // Vänd kortet
        console.log(`Kort vänt, ${selectedCard.isFaceDown ? 'Baksida visas' : 'Framsida visas'}`);
    }
}

// Händelseavlyssnare
canvas.addEventListener('mousedown', (e) => handleMouseDown(e));
canvas.addEventListener('mousemove', (e) => handleMouseMove(e));
canvas.addEventListener('mouseup', handleMouseUp);

// Lyssnare för att vända kort
window.addEventListener('keydown', handleKeyPress);