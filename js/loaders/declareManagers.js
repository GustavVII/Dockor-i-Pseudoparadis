// declareManagers.js
function declareMenuManagers() {
    const assetLoader = new AssetLoader();
    window.assetLoader = assetLoader;

    const menuInputHandler = new MenuInputHandler();
    window.menuInputHandler = menuInputHandler;

    window.menuHandler = new MenuHandler();

    window.handleMenuKeyDown = (e) => menuInputHandler.handleKeyDown(e);
    window.handleMenuKeyUp = (e) => menuInputHandler.handleKeyUp(e);

    return Promise.resolve();
}

async function declareGameManagers() {
    // Only declare these when game starts
    window.animationManager = new SpriteAnimationManager();
    window.characterManager = new CharacterManager();
    window.shotTypeManager = new ShotTypeManager();
    window.bulletManager = new BulletManager();
    window.gameInputHandler = new GameInputHandler();
    window.itemManager = new ItemManager();
    window.spawnerManager = new SpawnerManager();
    window.spawnerManager.init();
    window.enemyManager = new EnemyManager();
    window.enemyBulletManager = new EnemyBulletManager();
    window.patternProcessor = new PatternProcessor();
    await Promise.all([
        import('../enemyLogic/bullets/bulletBehaviours.js'),
        import('../enemyLogic/bullets/patternProcessor.js')
    ]);

    await FairyEnemy.loadTypes();
    window.enemyManager.registerEnemyType('fairy', FairyEnemy);
    window.enemyManager.registerEnemyType('yinyang', YinyangEnemy);
    window.enemyManager.registerEnemyType('spinner', SpinnerEnemy);
    
    // Mark enemy manager as ready
    window.enemyManager.setReady();

    window.bulletManager.registerBulletType('card', CardBullet);
    window.bulletManager.registerBulletType('homingCard', HomingCardBullet);
    window.bulletManager.registerBulletType('star', StarBullet);


    window.handleKeyDown = (e) => gameInputHandler.handleKeyDown(e);
    window.handleKeyUp = (e) => gameInputHandler.handleKeyUp(e);
    window.handleInput = () => gameInputHandler.handleInput();

    window.addEventListener('blur', handleWindowBlur);

    // Initialize systems that need canvas
    initializeGameSystems();
    await loadPatterns();

    return Promise.resolve();
}

function initializeGameSystems() {
    const canvas = document.getElementById('canvas');
    if (canvas) {
        // Initialize canvas-dependent systems
        if (window.characterManager) {
            window.characterManager.init(canvas);
        }
        if (window.cardManager) {
            window.cardManager.init(canvas);
        }
    }
}

async function loadPatterns() {
    try {
        const response = await fetch('data/patterns.json');
        const data = await response.json();
        // Convert array to object with name as key
        window.patternDatabase = {};
        data.patterns.forEach(pattern => {
            window.patternDatabase[pattern.name] = pattern;
        });
        console.log('Loaded patterns:', Object.keys(window.patternDatabase));
    } catch (error) {
        console.error('Failed to load patterns:', error);
        window.patternDatabase = {};
    }
}

function undeclareGameManagers() {
    // Clean up game managers when returning to menu
    resetStats()
    window.characterManager = null;
    window.animationManager = null
    window.shotTypeManager = null;
    window.bulletManager = null;
    window.gameInputHandler = null;
    window.enemyManager = null
    window.itemManager = null;
    window.spawnerManager = null;
    window.enemyBulletManager = null;
    
    // Remove game input handlers
    window.handleKeyDown = null;
    window.handleKeyUp = null;
    window.handleInput = null;

    window.removeEventListener('blur', handleWindowBlur);
}

function handleWindowBlur() {
    if (!window.pauseMenuActive) {
        pauseGame();
    }
}

window.declareMenuManagers = declareMenuManagers;
window.declareGameManagers = declareGameManagers;
window.undeclareGameManagers = undeclareGameManagers;