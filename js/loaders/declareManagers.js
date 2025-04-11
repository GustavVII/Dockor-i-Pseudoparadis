// declareManagers.js
function declareMenuManagers() {
    const assetLoader = new AssetLoader();
    window.assetLoader = assetLoader;

    const menuInputHandler = new MenuInputHandler();
    window.menuInputHandler = menuInputHandler;

    window.menuHandler = new MenuHandler();

    window.stageManager = new StageManager();

    window.handleMenuKeyDown = (e) => menuInputHandler.handleKeyDown(e);
    window.handleMenuKeyUp = (e) => menuInputHandler.handleKeyUp(e);

    return Promise.resolve();
}

function declareGameManagers() {
    // Only declare these when game starts
    window.characterManager = new CharacterManager();
    window.shotTypeManager = new ShotTypeManager();
    window.bulletManager = new BulletManager();
    window.gameInputHandler = new GameInputHandler();
    window.enemyManager = new EnemyManager();

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
    window.shotTypeManager = null;
    window.bulletManager = null;
    window.gameInputHandler = null;
    window.enemyManager = null
    
    // Remove game input handlers
    window.handleKeyDown = null;
    window.handleKeyUp = null;
    window.handleInput = null;
}

window.declareMenuManagers = declareMenuManagers;
window.declareGameManagers = declareGameManagers;
window.undeclareGameManagers = undeclareGameManagers;