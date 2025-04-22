class ItemManager {
    constructor() {
        this.items = [];
    }

    spawnItem(x, y, type, dropChance = 1) {
        if (Math.random() <= dropChance) {
            const item = new Item(x, y, type, dropChance);
            this.items.push(item);
            return item;
        }
        return null;
    }

    update() {
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            item.update();

            // Check collision with player
            if (item.checkCollision(characterManager.cursor)) {
                item.collect();
            }

            // Remove inactive items
            if (!item.active) {
                this.items.splice(i, 1);
            }
        }
    }

    render(ctx) {
        this.items.forEach(item => item.render(ctx));
    }

    clear() {
        this.items = [];
    }
}