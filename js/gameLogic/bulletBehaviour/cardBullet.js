class CardBullet {
    static patterns = {
        single: [{ xOffset: 0, yOffset: 0 }],
        double: [
            { xOffset: -16, yOffset: 0 },
            { xOffset: 16, yOffset: 0 }
        ],
        triple: [
            { xOffset: -24, yOffset: 0 },
            { xOffset: 0, yOffset: -10 },
            { xOffset: 24, yOffset: 0 }
        ],
        quad: [
            { xOffset: -32, yOffset: 0 },
            { xOffset: -12, yOffset: -10 },
            { xOffset: 12, yOffset: -10 },
            { xOffset: 32, yOffset: 0 }
        ]
    };

    static create(x, y, damage = 10) {
        const suits = ['H', 'D', 'C', 'S'];
        const numbers = Array.from({length: 13}, (_, i) => i + 1);
        return new CardBullet({
            x: x - 16,
            y: y - 16,
            speed: 15,
            card: {
                suit: suits[Math.floor(Math.random() * suits.length)],
                number: numbers[Math.floor(Math.random() * numbers.length)]
            },
            damage: damage,
            opacity: 0.4
        });
    }

    static createPattern(patternName, x, y, damage) {
        const pattern = CardBullet.patterns[patternName];
        return pattern ? pattern.map(pos => CardBullet.create(
            x + pos.xOffset,
            y + pos.yOffset,
            damage
        )) : [];
    }

    constructor(config) {
        Object.assign(this, {
            x: config.x,
            y: config.y,
            speed: config.speed || 15,
            card: config.card,
            damage: config.damage || 10,
            opacity: config.opacity || 1.0,
            width: 32,
            height: 32
        });
        this.image = window.assetLoader?.getImage(`card${this.card.suit}${this.card.number}`);
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