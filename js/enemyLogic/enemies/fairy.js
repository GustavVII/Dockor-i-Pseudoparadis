class FairyEnemy extends BaseEnemy {
    static types = { fairyTypes: {} };
    static loaded = false;

    static async loadTypes() {
        try {
            const response = await fetch('data/fairies.json');
            FairyEnemy.types = await response.json();
            FairyEnemy.loaded = true;
            console.log('Fairy types loaded successfully');
        } catch (error) {
            console.error('Error loading fairy types:', error);
            FairyEnemy.types = { fairyTypes: {} };
            FairyEnemy.loaded = true;
        }
    }

    constructor(config) {
        // Load fairy-specific config
        const type = config.type || 'red';
        const fairyConfig = FairyEnemy.loaded 
            ? FairyEnemy.types.fairyTypes[type] 
            : {};
        
        super({
            ...config,
            ...fairyConfig,
            imageName: `${type}Fairy`,
            width: 32,
            height: 32
        });
    }

    update(deltaTime) {
        super.update(deltaTime);
    }

    render(ctx) {
        super.render(ctx);
    }
}

// Register the class
document.addEventListener('DOMContentLoaded', () => {
    if (window.enemyManager && FairyEnemy) {
        window.enemyManager.registerEnemyType('fairy', FairyEnemy);
        FairyEnemy.loadTypes();
    }
});