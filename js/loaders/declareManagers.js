function declareManagers() {
    // Create an instance of AssetLoader
    const assetLoader = new AssetLoader();
    window.assetLoader = assetLoader;

    // Create an instance of CharacterManager
    const characterManager = new CharacterManager();
    window.characterManager = characterManager;

    // Create an instance of PortraitManager (requires characterManager)
    const portraitManager = new PortraitManager(characterManager);
    window.portraitManager = portraitManager;

    // Create an instance of ShotTypeManager
    const shotTypeManager = new ShotTypeManager();
    window.shotTypeManager = shotTypeManager;

    // Create an instance of SpellcardManager (requires characterManager and portraitManager)
    const spellcardManager = new SpellcardManager(characterManager, portraitManager);
    window.spellcardManager = spellcardManager;

    // Create an instance of BulletManager
    const bulletManager = new BulletManager();
    window.bulletManager = bulletManager;

    // Create an instance of SpawnerManager
    const spawnerManager = new SpawnerManager();
    window.spawnerManager = spawnerManager;

    // Create an instance of TextBarManager
    const textBarManager = new TextBarManager();
    window.textBarManager = textBarManager;

    const bulletRenderer = new BulletRenderer();
    window.bulletRenderer = bulletRenderer;

    const gameInputHandler = new GameInputHandler();
    window.gameInputHandler = gameInputHandler;

    const menuInputHandler = new MenuInputHandler();
    window.menuInputHandler = menuInputHandler;

    const optionsMenu = new OptionsMenu();
    window.optionsMenu = optionsMenu;

    const characterSelect = new CharacterSelect();
    window.characterSelect = characterSelect;
    window.selectedCharacter = characterSelect.selectedCharacter

    const musicRoom = new MusicRoom();
    window.musicRoom = musicRoom

    // Add more managers here as needed
    window.shoot = shotTypeManager.shoot.bind(shotTypeManager)
}

// Export the declareManagers function
window.sfxVolume = parseFloat(localStorage.getItem('sfxVolume')) || 0.6;
window.musicVolume = parseFloat(localStorage.getItem('musicVolume')) || 0.8;
window.isMusicMuted = localStorage.getItem('isMusicMuted') === 'true';


window.declareManagers = declareManagers;
window.handleKeyDown = (e) => gameInputHandler.handleKeyDown(e);
window.handleKeyUp = (e) => gameInputHandler.handleKeyUp(e);
window.handleInput = () => gameInputHandler.handleInput();
window.handleMenuKeyDown = (e) => menuInputHandler.handleKeyDown(e);
window.handleMenuKeyUp = (e) => menuInputHandler.handleKeyUp(e);