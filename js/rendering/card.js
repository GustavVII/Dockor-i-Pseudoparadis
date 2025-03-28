// Skaffa kontexter
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Definera korten
const suits = ['H', 'S', 'D', 'C'];
const startNumber = 1;
const endNumber = 13;

// Array för kortleken
const cards = [];
const CARD_WIDTH = 20;
const CARD_HEIGHT = 30;

const cardImages = new Map();

// Ladda in Back.png som en gemensam bild för baksidan av korten
let backImage = null;

// Funktion för att rita in kort
function createCard(suit, number, x, y) {
    return {
        suit,
        number,
        x,
        y,
        image: null,
        flipped180: false,
        isFaceDown: false, 
        flipCooldown: 0,
        isAnimating: false,
        scaleX: 1,
        canvas: "canvas",
        targetScaleX: 1,
    };
}

// Blanda arrayen med Fisher-Yates algoritm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // byt element
    }
}

function updateCardAnimation(card) {
    if (card.isAnimating) {
        const animationSpeed = 0.5; // Animationshastighet
        if (card.scaleX !== card.targetScaleX) {
            card.scaleX += (card.targetScaleX - card.scaleX) * animationSpeed;

            // Vänd kort när dess bredd är tunn nog
            if (Math.abs(card.scaleX) < 0.01) {
                card.scaleX = 0;
                card.isFaceDown = !card.isFaceDown;
                card.targetScaleX = 1;
            }
        } else if (card.scaleX === 1) {
            card.isAnimating = false;
        }
    }
}

// Funktion att visa alla kort på rätt kanvas
function renderCards(ctx) {
    const cardsOnCanvas = cards.filter(card => card.canvas);

    // Use the preloaded Back.png image from assetLoader
    const backImage = assetLoader.getImage('cardBack');

    cardsOnCanvas.forEach(card => {
        updateCardAnimation(card); // Uppdatera kortanimation

        const imageToDraw = card.isFaceDown ? backImage : card.image; // Använd baksida för nervända kort
        if (imageToDraw) {
            const cropX = 6;
            const cropY = 1;
            const cropWidth = 20;
            const cropHeight = 30;

            // Få kort att följa rutnät för att undvika blurrighet
            const snappedX = Math.round(card.x);
            const snappedY = Math.round(card.y);

            ctx.save();
            ctx.translate(snappedX + cropWidth / 2, snappedY + cropHeight / 2);
            ctx.scale(card.scaleX, 1);
            ctx.translate(-(snappedX + cropWidth / 2), -(snappedY + cropHeight / 2));

            if (card.flipped180) {
                ctx.translate(snappedX + cropWidth / 2, snappedY + cropHeight / 2);
                ctx.rotate(Math.PI);
                ctx.drawImage(
                    imageToDraw,
                    cropX, cropY, cropWidth, cropHeight,
                    -cropWidth / 2, -cropHeight / 2, cropWidth, cropHeight
                );
            } else {
                ctx.drawImage(
                    imageToDraw,
                    cropX, cropY, cropWidth, cropHeight,
                    snappedX, snappedY, cropWidth, cropHeight
                );
            }

            ctx.restore();
        }
    });
}

// Funktion att framkalla kort
function spawnCard(x, y, suit = null, number = null, isFaceDown = false, flipped180 = false) {
    const adjustedX = x;
    const adjustedY = y;

    // Välj slumpmässigt kort om ej angivet
    if (suit === null || number === null) {
        suit = suits[Math.floor(Math.random() * suits.length)];
        number = Math.floor(Math.random() * (endNumber - startNumber + 1)) + startNumber;
    }

    // Kolla om koordinater är inuti kanvas
    if (adjustedX < 0 || adjustedX + CARD_WIDTH > canvas.width || adjustedY < 0 || adjustedY + CARD_HEIGHT > canvas.height) {
        console.warn(`Koordinater (${adjustedX}, ${adjustedY}) ligger utanför kanvasets gränser`);
        return;
    }

    console.log(`Kort framkallat: ${suit}${number} vid (${adjustedX}, ${adjustedY}) på kanvaset`);

    // Create the card
    const card = createCard(suit, number, adjustedX, adjustedY);
    card.isFaceDown = isFaceDown; // Set face up/down
    card.flipped180 = flipped180; // Set flipped 180 degrees

    // Use the preloaded card image from assetLoader
    const imageKey = `card${suit}${number}`;
    card.image = assetLoader.getImage(imageKey);

    if (!card.image) {
        console.error(`Card image for ${suit}${number} not found in assetLoader.`);
    } else {
        cards.push(card); // Lägg till kort i array
        console.log(`Kort tillagt i array: ${suit}${number} vid (${adjustedX}, ${adjustedY}) på kanvaset`);
        console.log('Kort för närvarande i array:', cards);
    }
}

// Expose functions to the global scope
window.spawnCard = spawnCard;
window.renderCards = renderCards;
window.updateCardAnimation = updateCardAnimation;
window.cardImages = cardImages;