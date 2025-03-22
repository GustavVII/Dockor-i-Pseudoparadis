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

// Ladda in Back.png som en gemensam bild för baksidan av korten
let backImage = null;
async function loadBackImage() {
    backImage = await loadImage('assets/graphics/cards/Back.png');
}

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

// Ladda in korten
async function initializeCards() {
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
    //shuffleArray(cards);

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


// Funktion att visa alla kort på rätt kanvas
function renderCards(ctx) {
    
    const cardsOnCanvas = cards.filter(card => card.canvas);

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

// Bildinladdningsfunktion
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
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

    // Ladda kortbild
    loadImage(`assets/graphics/cards/${suit}${number}.png`).then((img) => {
        card.image = img;
        cards.push(card); // Lägg till kort i array
        console.log(`Kort tillagt i array: ${suit}${number} vid (${adjustedX}, ${adjustedY}) på kanvaset`);
        console.log('Kort för närvarande i array:', cards);

    }).catch((error) => {
        console.error('Fel i bildinladdning:', error);
    });
}