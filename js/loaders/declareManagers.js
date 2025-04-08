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

function declareGameManagers() {
    // Only declare these when game starts
    window.characterManager = new CharacterManager();
    window.portraitManager = new PortraitManager(window.characterManager);
    window.shotTypeManager = new ShotTypeManager();
    window.spellcardManager = new SpellcardManager(window.characterManager, window.portraitManager);
    window.bulletManager = new BulletManager();
    window.spawnerManager = new SpawnerManager();
    window.textBarManager = new TextBarManager();
    window.bulletRenderer = new BulletRenderer();
    window.gameInputHandler = new GameInputHandler();

    window.handleKeyDown = (e) => gameInputHandler.handleKeyDown(e);
    window.handleKeyUp = (e) => gameInputHandler.handleKeyUp(e);
    window.handleInput = () => gameInputHandler.handleInput();

    // Initialize systems that need canvas
    initializeGameSystems();

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

function undeclareGameManagers() {
    // Clean up game managers when returning to menu
    window.characterManager = null;
    window.portraitManager = null;
    window.shotTypeManager = null;
    window.spellcardManager = null;
    window.bulletManager = null;
    window.spawnerManager = null;
    window.textBarManager = null;
    window.bulletRenderer = null;
    window.gameInputHandler = null;
    
    // Remove game input handlers
    window.handleKeyDown = null;
    window.handleKeyUp = null;
    window.handleInput = null;
}

window.declareMenuManagers = declareMenuManagers;
window.declareGameManagers = declareGameManagers;
window.undeclareGameManagers = undeclareGameManagers;