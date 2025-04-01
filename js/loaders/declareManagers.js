function declareManagers() {
    const assetLoader = new AssetLoader();
    window.assetLoader = assetLoader;

    const characterManager = new CharacterManager();
    window.characterManager = characterManager;

    const portraitManager = new PortraitManager(characterManager);
    window.portraitManager = portraitManager;

    const shotTypeManager = new ShotTypeManager();
    window.shotTypeManager = shotTypeManager;

    const spellcardManager = new SpellcardManager(characterManager, portraitManager);
    window.spellcardManager = spellcardManager;

    const bulletManager = new BulletManager();
    window.bulletManager = bulletManager;

    const spawnerManager = new SpawnerManager();
    window.spawnerManager = spawnerManager;

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

    // Lägg till lite mer
    window.shoot = shotTypeManager.shoot.bind(shotTypeManager)
}

window.sfxVolume = parseFloat(localStorage.getItem('sfxVolume')) || 0.6;
window.musicVolume = parseFloat(localStorage.getItem('musicVolume')) || 0.8;

window.declareManagers = declareManagers;
window.handleKeyDown = (e) => gameInputHandler.handleKeyDown(e);
window.handleKeyUp = (e) => gameInputHandler.handleKeyUp(e);
window.handleInput = () => gameInputHandler.handleInput();
window.handleMenuKeyDown = (e) => menuInputHandler.handleKeyDown(e);
window.handleMenuKeyUp = (e) => menuInputHandler.handleKeyUp(e);