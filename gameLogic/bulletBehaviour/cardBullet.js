class CardBullet {
    constructor(x, y, speed, card) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.card = card; // The card object (e.g., from your card data)
        this.width = 32; // Card width
        this.height = 32; // Card height;

        // Debug: Log the card image
    }

    update() {
        this.y -= this.speed; // Move upward
    }

    render(ctx) {
        if (this.card.image) {
            ctx.drawImage(
                this.card.image,
                0, 0, 32, 32, // Source rectangle (from the card image)
                this.x, this.y, this.width, this.height // Destination rectangle (on the canvas)
            );
        } else {
            console.error("Card image is missing or not loaded.");
        }
    }

    isOffScreen() {
        return this.y + this.height < 0; // Check if the bullet is off-screen
    }
}

// Export the CardBullet class
window.CardBullet = CardBullet;