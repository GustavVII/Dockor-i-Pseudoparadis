// init.js
document.addEventListener('DOMContentLoaded', () => {
    initializeStartScreen();
});

if (localStorage.getItem('clearedGame') === null) {
    localStorage.setItem('clearedGame', 'false');
}

async function init() {
    // Create all necessary elements
    createLoadingScreen();
    createBackground();
    createVignette();
    setMenuBackground('loadingBackground');
    
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'loading-indicator-container';
    
    // Create spinner element
    const spinner = document.createElement('img');
    spinner.className = 'loading-spinner';
    spinner.src = 'assets/graphics/loading.png';
    spinner.alt = 'Loading';
    
    // Create text element
    const text = document.createElement('div');
    text.className = 'loading-text';
    text.textContent = 'Loading...';
    
    // Add elements to container
    loadingContainer.appendChild(spinner);
    loadingContainer.appendChild(text);
    
    // Add container to the main container
    const mainContainer = document.querySelector('.container');
    mainContainer.appendChild(loadingContainer);
    
    // Show loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = 'flex';
    const settings = loadSettings();

    // Set volume defaults if invalid
    if (isNaN(sfxVolume) || sfxVolume < 0 || sfxVolume > 1) {
        sfxVolume = 0.8;
    }
    if (isNaN(musicVolume) || musicVolume < 0 || musicVolume > 1) {
        musicVolume = 0.6;
    }

    // Apply settings
    musicVolume = settings.music / 100;
    sfxVolume = settings.sound / 100;

    // Hide game elements initially
    const canvas = document.getElementById('canvas');
    if (canvas) canvas.style.display = 'none';
    const menuBox = document.getElementById('menuBox');
    if (menuBox) menuBox.style.display = 'none';
    const statsDisplay = document.getElementById('playerStatsDisplay');
    if (statsDisplay) statsDisplay.style.display = 'none';

    // Initialize systems
    console.log("Initializing game systems...");
    await Promise.all([
        import('../enemyLogic/enemies/baseEnemy.js'),
        import('../enemyLogic/enemies/fairy.js')
    ]);

    await initializeSoundEffects();
    await languageManager.init();
    await declareMenuManagers();
    await loadAllAssets();
    setupInputHandlers();

    // Initial UI update
    updatePlayerStatsDisplay();

    // Complete initialization
    setTimeout(async () => {
        loadingContainer.remove();
        
        loadingScreen.style.display = 'none';
        playMusic('assets/music/DiPP_01.mp3');
        
        window.menuHandler.showMenu();
        window.menuHandler.switchMenu(MENU_STATES.MAIN);
        
        // Start the menu loop
        startMenuLoop();
    }, 0);
}

function initializeStartScreen() {
    const container = document.querySelector('.container');
    if (!container) return;

    // Create start screen if it doesn't exist
    if (!container.querySelector('#startScreen')) {
        const startScreen = document.createElement('div');
        startScreen.id = 'startScreen';
        startScreen.style.display = 'flex';
        startScreen.style.flexDirection = 'column';
        startScreen.style.alignItems = 'center';
        startScreen.style.justifyContent = 'center';
        startScreen.style.position = 'absolute';
        startScreen.style.top = '0';
        startScreen.style.left = '0';
        startScreen.style.width = '100%';
        startScreen.style.height = '100%';
        startScreen.style.zIndex = '2000';

        const startButton = document.createElement('button');
        startButton.id = 'startButton';
        startButton.textContent = 'Start Game';
        startButton.style.padding = '10px 20px';
        startButton.style.fontSize = '20px';
        startButton.style.cursor = 'pointer';
        startButton.style.margin = '0';

        startButton.addEventListener('click', () => {
            startScreen.style.display = 'none';
            init();
        });

        startScreen.appendChild(startButton);
        container.appendChild(startScreen);
    }
}

function createLoadingScreen() {
    const container = document.querySelector('.container');
    if (!container || container.querySelector('#loadingScreen')) return;

    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loadingScreen';
    loadingScreen.style.position = 'absolute';
    loadingScreen.style.top = '0';
    loadingScreen.style.left = '0';
    loadingScreen.style.width = '100%';
    loadingScreen.style.height = '100%';
    loadingScreen.style.display = 'none';
    loadingScreen.style.flexDirection = 'column';
    loadingScreen.style.alignItems = 'center';
    loadingScreen.style.justifyContent = 'center';
    loadingScreen.style.zIndex = '2000';
    loadingScreen.style.boxSizing = 'border-box';
    loadingScreen.style.margin = '0';
    loadingScreen.style.padding = '0';
    loadingScreen.style.overflow = 'hidden';

    container.appendChild(loadingScreen);
}

function createBackground() {
    const container = document.querySelector('.container');
    if (!container || container.querySelector('#background')) return;

    const background = document.createElement('div');
    background.id = 'background';
    container.appendChild(background);
}

function createVignette() {
    const container = document.querySelector('.container');
    if (!container || container.querySelector('#vignette')) return;

    const vignette = document.createElement('div');
    vignette.id = 'vignette';
    container.appendChild(vignette);
}

function createGameElements() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    // Create player stats display if it doesn't exist
    if (!container.querySelector('#playerStatsDisplay')) {
        const statsDisplay = document.createElement('div');
        statsDisplay.id = 'playerStatsDisplay';
        statsDisplay.style.display = 'none';
        // ... (keep rest of stats display styling)
        container.appendChild(statsDisplay);
    }
    
    // Create title container if it doesn't exist
    if (!container.querySelector('#titleContainer')) {
        const titleContainer = document.createElement('div');
        titleContainer.id = 'titleContainer';
        container.appendChild(titleContainer);
    }
    
    // Create menu box if it doesn't exist
    if (!container.querySelector('#menuBox')) {
        const menuBox = document.createElement('div');
        menuBox.id = 'menuBox';
        container.appendChild(menuBox);
    }
}

// Set up input handlers
function setupInputHandlers() {
    window.addEventListener('keydown', (e) => {
        if (window.pauseMenuActive && window.pauseMenu) {
            window.pauseMenu.handleKeyDown(e);
            // Prevent other handlers from processing
            e.preventDefault();
            e.stopPropagation();
        } else if (menuActive) {
            if (typeof handleMenuKeyDown === 'function') {
                handleMenuKeyDown(e);
            }
        } else {
            if (typeof handleKeyDown === 'function') {
                handleKeyDown(e);
            }
        }
    });
    
    window.addEventListener('keyup', (e) => {
        if (window.pauseMenuActive && window.pauseMenu) {
            window.pauseMenu.handleKeyUp(e);
            // Prevent other handlers from processing
            e.preventDefault();
            e.stopPropagation();
        } else if (menuActive) {
            if (typeof handleMenuKeyUp === 'function') {
                handleMenuKeyUp(e);
            }
        } else {
            if (typeof handleKeyUp === 'function') {
                handleKeyUp(e);
            }
        }
    });
}

async function startGame(characterId) {
    if (window.menuHandler.inputLocked) return;

    stopGameMusic()
    
    // Create canvas and container here
    const container = document.querySelector('.container');
    if (!container.querySelector('.canvas-container')) {
        const canvasContainer = document.createElement('div');
        canvasContainer.className = 'canvas-container';
        canvasContainer.style.position = 'absolute';

        const canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        canvas.width = 574;
        canvas.height = 670;
        canvas.style.display = 'block';

        canvasContainer.appendChild(canvas);
        container.appendChild(canvasContainer);
    }

    window.canvas = document.getElementById('canvas');
    window.ctx = canvas.getContext('2d');
    
    menuActive = false;
    gameRunning = true;
    window.pauseMenuActive = false;
    window.pauseMenu = null;
    
    // Clean up menu elements
    if (window.menuHandler.difficultySelect) {
        window.menuHandler.difficultySelect.cleanup();
        window.menuHandler.difficultySelect = null;
    }
    if (window.menuHandler.characterSelect) {
        window.menuHandler.characterSelect.cleanup();
        window.menuHandler.characterSelect = null;
    }

    createGameElements();
    await declareGameManagers();
    await window.shotTypeManager.loadShotTypes();
    
    document.getElementById('menuBox').style.display = 'none';
    setMenuBackground('gameBackground');
    document.getElementById('canvas').style.display = 'block';
    document.getElementById('playerStatsDisplay').style.display = 'flex';
    
    // Initialize game systems that need canvas
    await initializeGameSystems();
    
    characterManager.setCharacter(characterId);

    const gameMode = window.menuHandler?.difficultySelect?.gameMode || 'normal';
    const difficulty = window.menuHandler?.difficultySelect?.difficulties?.[
        window.menuHandler.difficultySelect.selectedIndex
    ]?.id || 'normal';

    // Determine stage to load
    let stageId;
    if (gameMode === 'practice' || gameMode === 'extra') {
        stageId = window.stageManager.selectedPracticeStage || 1;
    } else {
        stageId = 1; // Start from stage 1 in normal mode
    }

    // Hide menu elements
    document.getElementById('menuBox').style.display = 'none';
    document.getElementById('canvas').style.display = 'block';
    document.getElementById('playerStatsDisplay').style.display = 'flex';

    try {
        // Initialize game systems
        await initializeGameSystems();

        // Set character
        characterManager.setCharacter(characterId);

        // Start game loop
        lastFrameTime = performance.now();
        accumulatedTime = 0;
        gameLoop();

        console.log("Game started with character:", characterId);
    } catch (error) {
        console.error("Error starting game:", error);
        errorHandler.handleError(error);
        // Fallback to menu if game fails to start
        window.quitToMenu();
    }
}

function setMenuBackground(backgroundName) {
    const bgElement = document.getElementById('background');
    if (bgElement) {
        bgElement.style.setProperty(
            '--menu-bg',
            `url('../assets/graphics/backgrounds/${backgroundName}.png')`
        );
    }
}

// Set default background
setMenuBackground('mainMenu');

window.startGame = startGame;