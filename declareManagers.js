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

    // Add more managers here as needed
}

// Export the declareManagers function
window.declareManagers = declareManagers;