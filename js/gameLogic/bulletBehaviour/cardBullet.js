class CardBullet {
    static create(x, y, damage = 10) {
        const suits = ['H', 'D', 'C', 'S'];
        const numbers = Array.from({length: 13}, (_, i) => i + 1);
        const card = {
            suit: suits[Math.floor(Math.random() * suits.length)],
            number: numbers[Math.floor(Math.random() * numbers.length)]
        };
        return new CardBullet(x - 16, y - 16, 15, card, damage, 0.4);
    }


    constructor(x, y, speed, card, damage = 10, opacity = 1.0) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.card = card;
        this.damage = damage;
        this.opacity = opacity;
        this.width = 32;
        this.height = 32;
        this.image = window.assetLoader?.getImage(`card${card.suit}${card.number}`);
    }

    update() {
        this.y -= this.speed;
    }

    render(ctx) {
        if (!this.image) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(
            this.image,
            0, 0, this.width, this.height,
            this.x, this.y, this.width, this.height
        );
        ctx.restore();
    }

    isOffScreen() {
        return this.y + this.height < 0;
    }
}