function handleKeyPress(e) {
    if ((e.key === 'f' || e.key === 'F') && selectedCard) {

        // Teleporteringen mellan canvases
        if (selectedCard.canvas === 'top') {
            selectedCard.canvas = 'bottom'; // Flyttar ner
        } else if (selectedCard.canvas === 'bottom') {
            selectedCard.canvas = 'top'; // Flyttar upp
        }

        // Vänder kortet 180 grader
        selectedCard.flipped180 = !selectedCard.flipped180;
    }
}

// Tillägg av eventlyssnare för funktionen
window.addEventListener('keydown', handleKeyPress);