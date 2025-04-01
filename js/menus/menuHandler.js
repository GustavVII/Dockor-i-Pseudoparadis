let lastMenuInput = Date.now();
let selectedButton = 0;
const menuButtons = ['Start', 'Extra Start', 'Practice Start', 'Score', 'Music Room', 'Options', 'Quit'];
const MENU_BOX_ID = 'menuBox';
const CANVAS_ID = 'canvas';
const STATS_BOX_ID = 'playerStatsDisplay';
const MENU_STATES = {
    MAIN: 0,
    OPTIONS: 1,
    CHARACTER_SELECT: 2,
    MUSIC_ROOM: 3
};
let currentMenuState = MENU_STATES.MAIN;
let clearedGame = localStorage.getItem('clearedGame') === 'true';
let needsRender = true;
let inputLocked = false;

window.clearedGame = clearedGame;

window.toggleClearedGame = function() {
    clearedGame = !clearedGame;
    localStorage.setItem('clearedGame', clearedGame);
    window.clearedGame = clearedGame;
    console.log('clearedGame set to:', clearedGame);
    renderMainMenu();
    return clearedGame;
};

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

function showMenu() {
    const menuBox = document.getElementById(MENU_BOX_ID);
    if (!menuBox) {
        console.error(`Element with ID '${MENU_BOX_ID}' not found`);
        return false;
    }

    menuBox.style.display = 'flex';
    
    const canvas = document.getElementById(CANVAS_ID);
    const statsBox = document.getElementById(STATS_BOX_ID);
    
    if (canvas) canvas.style.display = 'none';
    if (statsBox) statsBox.style.display = 'none';

    renderMainMenu();
    return true;
}

function hideMenu() {
    const menuBox = document.getElementById('menuBox');
    const canvas = document.getElementById('canvas');
    const statsBox = document.getElementById('playerStatsDisplay');
    
    if (menuBox) menuBox.style.display = 'none';
    if (canvas) canvas.style.display = 'block';
    if (statsBox) statsBox.style.display = 'flex';
}

function startMainMenu() {
    menuActive = true;
    
    if (!showMenu()) {
        console.error('Failed to show menu');
        return;
    }
    
    playMusic('assets/music/DiPP_01.mp3');
    startMenuLoop();
    console.log('Main menu started successfully');
}

function handleMenuInput() {
    try {
        if (currentMenuState === MENU_STATES.MAIN) {
            return handleMainMenuInput();
        } else if (currentMenuState === MENU_STATES.OPTIONS) {
            return handleOptionsMenuInput();
        } else if (currentMenuState === MENU_STATES.CHARACTER_SELECT) {
            if (window.characterSelect && window.characterSelect.handleInput) {
                return window.characterSelect.handleInput();
            } else {
                console.error('Character select not properly initialized');
                return false;
            }
        } else if (currentMenuState === MENU_STATES.MUSIC_ROOM) {
            if (window.musicRoom && window.musicRoom.handleInput) {
                return window.musicRoom.handleInput();
            } else {
                console.error('Music room not properly initialized');
                return false;
            }
        }
        return false;
    } catch (error) {
        console.error('Menu input error:', error);
        return false;
    }
}

function handleMainMenuInput() {
    if (inputLocked) return false;
    
    const now = Date.now();
    if (now - lastMenuInput < 100) return false;
    lastMenuInput = now;

    try {
        let selectionChanged = false;
        
        if (menuInputHandler.keys.ArrowUp) {
            do {
                selectedButton = (selectedButton - 1 + menuButtons.length) % menuButtons.length;
            } while (selectedButton === 1 && !clearedGame && menuButtons.length > 1);
            menuInputHandler.keys.ArrowUp = false;
            selectionChanged = true;
        }
        
        if (menuInputHandler.keys.ArrowDown) {
            do {
                selectedButton = (selectedButton + 1) % menuButtons.length;
            } while (selectedButton === 1 && !clearedGame && menuButtons.length > 1);
            menuInputHandler.keys.ArrowDown = false;
            selectionChanged = true;
        }

        if (selectionChanged) {
            updateMenuSelection();
            playSoundEffect(soundEffects.select);
        }

        if (menuInputHandler.keys.z || menuInputHandler.keys.Z) {
            playSoundEffect(soundEffects.ok);
            switch (selectedButton) {
                case 0: // Start
                    playSoundEffect(soundEffects.ok);
                    transitionToMenu(MENU_STATES.CHARACTER_SELECT);
                    characterSelect.render();
                    return false;
                case 1: // Extra Start
                    playSoundEffect(soundEffects.ok);
                    console.log('Extra Start selected');
                    break;
                case 2: // Practice Start
                    playSoundEffect(soundEffects.ok);
                    transitionToMenu(MENU_STATES.CHARACTER_SELECT);
                    break;
                case 3: // Score
                    playSoundEffect(soundEffects.ok);
                    console.log('Score selected');
                    break;
                case 4: // Music Room
                    transitionToMenu(MENU_STATES.MUSIC_ROOM);
                    musicRoom.render();
                    playSoundEffect(soundEffects.ok);
                    titleManager.animateMenuButtonsExit();
                    return false;
                case 5: // Options
                    transitionToMenu(MENU_STATES.OPTIONS);
                    optionsMenu.render();
                    playSoundEffect(soundEffects.ok);
                    currentMenuState = MENU_STATES.OPTIONS;
                    return false;
                case 6: // Quit
                    playSoundEffect(soundEffects.cancel);
                    // Hide all menus and show start screen
                    document.getElementById('menuBox').style.display = 'none';
                    document.getElementById('optionsMenuContainer').style.display = 'none';
                    resetGame();
                    break;
            }
            menuInputHandler.keys.z = false;
            menuInputHandler.keys.Z = false;
        }

        if (menuInputHandler.keys.x || menuInputHandler.keys.X) {
            playSoundEffect(soundEffects.cancel);
            console.log('Back button pressed');
            menuInputHandler.keys.x = false;
            menuInputHandler.keys.X = false;
        }

        return false
    } catch (error) {
        console.error('Menu input error:', error);
        return false;
    }
}

function handleOptionsMenuInput() {
    if (optionsMenu.handleInput()) {
        // Options menu wants to exit
        currentMenuState = MENU_STATES.MAIN;
        transitionToMenu(MENU_STATES.MAIN);

        renderMainMenu();
    }
    return false;
}

// Function to reset the game
function resetGame() {
    if (musicAudio) {
        musicAudio.pause();
        musicAudio = null;
    }

    menuActive = false;
    selectedButton = 0;

    document.getElementById('startScreen').style.display = 'flex';
    document.getElementById('menuBox').style.display = 'none';
    document.getElementById('canvas').style.display = 'none';
    document.getElementById('playerStatsDisplay').style.display = 'none';
}

async function transitionToMenu(newState) {
    if (inputLocked) return;
    inputLocked = true;
    
    const menuBox = document.getElementById('menuBox');
    if (!menuBox) return;

    // 1. First handle exit animations for current state
    if (currentMenuState === MENU_STATES.MAIN) {
        // Animate menu buttons out
        const buttons = Array.from(menuBox.querySelectorAll('.menu-button'));
        await Promise.all(
            buttons.map((button, index) => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        button.style.transition = 'all 0.5s ease-out';
                        button.style.opacity = '0';
                        button.style.transform = 'translateX(100%)';
                        setTimeout(resolve, 500);
                    }, index * 50);
                });
            })
        );
        
        // If going to character/music room, animate title out
        if (newState === MENU_STATES.CHARACTER_SELECT || newState === MENU_STATES.MUSIC_ROOM) {
            await titleManager.animateTitleExit();
        }
    } 
    else if (currentMenuState === MENU_STATES.CHARACTER_SELECT || 
             currentMenuState === MENU_STATES.MUSIC_ROOM) {
        await titleManager.animateTitleExit();
    }

    // 2. Clear current menu only after animations complete
    menuBox.innerHTML = '';
    menuBox.style.display = 'none';
    document.getElementById('optionsMenuContainer').style.display = 'none';

    // 3. Now change state and render new menu
    currentMenuState = newState;
    menuBox.style.display = 'flex';
    
    if (newState === MENU_STATES.MAIN) {
        // Add title back if it doesn't exist
        menuBox.appendChild(titleManager.createTitle());
        renderMainMenu();
        await titleManager.animateTitleEnter();
    } 
    else if (newState === MENU_STATES.CHARACTER_SELECT) {
        window.characterSelect.render();
        // Fade in the new menu
        const charSelect = document.querySelector('.character-select-container');
        if (charSelect) {
            charSelect.style.animation = 'fadeIn 0.5s forwards';
        }
    }
    else if (newState === MENU_STATES.MUSIC_ROOM) {
        window.musicRoom.render();
        // Fade in the new menu
        const musicRoom = document.querySelector('.music-room-container');
        if (musicRoom) {
            musicRoom.style.animation = 'fadeIn 0.5s forwards';
        }
    }
    else if (newState === MENU_STATES.OPTIONS) {
        if (!optionsMenu.container) {
            optionsMenu.createContainer();
        }
        optionsMenu.show();
    }

    inputLocked = false;
}

function completeMenuTransition(newState) {
    const menuBox = document.getElementById('menuBox');
    menuBox.innerHTML = '';
    menuBox.style.display = 'flex';
    
    switch(newState) {
        case MENU_STATES.MAIN:
            renderMainMenu();
            break;
        case MENU_STATES.OPTIONS:
            if (!optionsMenu.container) {
                optionsMenu.createContainer();
            }
            optionsMenu.show();
            break;
        case MENU_STATES.CHARACTER_SELECT:
            window.characterSelect.render();
            break;
        case MENU_STATES.MUSIC_ROOM:
            window.musicRoom.render();
            break;
    }
}

function updateMenuSelection() {
    const menuBox = document.getElementById('menuBox');
    if (!menuBox) return;
    
    const buttons = menuBox.querySelectorAll('.menu-button');
    buttons.forEach((button, index) => {
        button.classList.toggle('selected', index === selectedButton);
    });
}

// Expose functions to the global scope
window.renderMainMenu = renderMainMenu;
window.handleMenuInput = handleMenuInput;
window.resetGame = resetGame;
window.MENU_STATES = MENU_STATES;