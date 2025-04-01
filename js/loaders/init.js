document.addEventListener('DOMContentLoaded', () => {
    // Startknapp
    document.getElementById('startButton').addEventListener('click', () => {
        // Göm startskärmen
        document.getElementById('startScreen').style.display = 'none';
        init();
    });
});
if (localStorage.getItem('clearedGame') === null) {
    localStorage.setItem('clearedGame', 'false');
}

function renderMainMenu() {
    const menuBox = document.getElementById('menuBox');
    if (!menuBox) return;
    
    const existingTitle = menuBox.querySelector('.main-menu-title');
    
    menuBox.innerHTML = '';
    if (existingTitle) {
        menuBox.appendChild(existingTitle);
    }
    
    const menuItems = [
        'start', 'extraStart', 'practiseStart', 'score', 'musicRoom', 'options', 'quit'
    ];
    
    menuItems.forEach((item, index) => {
        const buttonElement = document.createElement('div');
        buttonElement.className = `menu-button ${selectedButton === index ? 'selected' : ''}`;
        
        if (item === 'extraStart') {
            buttonElement.classList.add('extra-start');
            if (clearedGame) {
                buttonElement.classList.add('cleared');
            }
        }
        
        buttonElement.textContent = languageManager.getText(`mainMenu.${item}`);
        menuBox.appendChild(buttonElement);
    });
}

async function init() {
    // Visa inladdningsskärmen
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = 'flex';
    const settings = loadSettings();

    if (isNaN(sfxVolume) || sfxVolume < 0 || sfxVolume > 1) {
        sfxVolume = 0.8;
    }
    if (isNaN(musicVolume) || musicVolume < 0 || musicVolume > 1) {
        musicVolume = 0.6;
    }

    musicVolume = settings.music / 100;
    sfxVolume = settings.sound / 100;

    document.getElementById('canvas').style.display = 'none';
    document.getElementById('menuBox').style.display = 'none';
    document.getElementById('playerStatsDisplay').style.display = 'none';

    
    console.log("Adding event listeners");
    
    await initializeSoundEffects();

    
    await languageManager.init();
    await declareManagers();
    await loadAllAssets();

    shotTypeManager.laserImages = {
        start: assetLoader.getImage('laser1'),
        middle: assetLoader.getImage('laser2'),
        end: assetLoader.getImage('laser3'),
    };
    shotTypeManager.starImages = [
        assetLoader.getImage('star1'),
        assetLoader.getImage('star2'),
        assetLoader.getImage('star3'),
        assetLoader.getImage('star4'),
        assetLoader.getImage('star5'),
        assetLoader.getImage('star6'),
        assetLoader.getImage('star7'),
        assetLoader.getImage('star8'),
    ];

    updatePlayerStatsDisplay();

    window.addEventListener('keydown', (e) => {
        if (menuActive) {
            handleMenuKeyDown(e);
        } else {
            handleKeyDown(e);
        }
    });
    
    window.addEventListener('keyup', (e) => {
        if (menuActive) {
            handleMenuKeyUp(e);
        } else {
            handleKeyUp(e);
        }
    });

    setTimeout(async () => {
        loadingScreen.style.display = 'none';
        stopGameMusic();
        
        const menuBox = document.getElementById('menuBox');
        menuBox.appendChild(titleManager.createTitle());
        await titleManager.animateTitleEnter();
        
        startMainMenu();
        
        menuBox.style.display = 'flex';
        
        setTimeout(() => {
            titleManager.animateTitle();
            //transition.classList.add('hidden');
            
            setTimeout(() => {
                //transition.remove();
            }, 1000);
        }, 50);
        
        startMainMenu();
    }, 0);
}

async function startGame(characterId) {
    menuActive = false;
    gameRunning = true;
    
    document.getElementById('menuBox').style.display = 'none';
    document.getElementById('canvas').style.display = 'block';
    document.getElementById('playerStatsDisplay').style.display = 'flex';
    
    stopMenuMusic();
    
    characterManager.setCharacter(characterId);
    
    lastFrameTime = performance.now();
    accumulatedTime = 0;
    
    gameLoop();
    
    console.log("Game started with character:", characterId);
}

window.startGame = startGame;