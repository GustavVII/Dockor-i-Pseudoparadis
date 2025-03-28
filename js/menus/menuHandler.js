let lastMenuInput = Date.now();
let selectedButton = 0;
const menuButtons = ['Start', 'Practice Start', 'Score', 'Music Room', 'Options', 'Quit'];
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


// Render the main menu
function renderMainMenu() {
    const menuBox = document.getElementById('menuBox');
    if (!menuBox) return;
    
    menuBox.innerHTML = '';
    
    const menuItems = [
        'start', 'practiseStart', 'score', 'musicRoom', 'options', 'quit'
    ];
    
    menuItems.forEach((item, index) => {
        const buttonElement = document.createElement('div');
        buttonElement.className = `menu-button ${selectedButton === index ? 'selected' : ''}`;
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

    // Set display first to ensure visibility
    menuBox.style.display = 'flex';
    
    // Hide other elements
    const canvas = document.getElementById(CANVAS_ID);
    const statsBox = document.getElementById(STATS_BOX_ID);
    
    if (canvas) canvas.style.display = 'none';
    if (statsBox) statsBox.style.display = 'none';

    // Force re-render and return success
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
            return window.characterSelect.handleInput();
        } else if (currentMenuState === MENU_STATES.MUSIC_ROOM) {
            return window.musicRoom.handleInput();
        }
        return false;
    } catch (error) {
        console.error('Menu input error:', error);
        return false;
    }
}

function handleMainMenuInput() {
    const now = Date.now();
    
    // Only process input if enough time has passed (100ms)
    if (now - lastMenuInput < 100) {
        return false;
    }
    lastMenuInput = now;

    try {
        if (menuInputHandler.keys.ArrowUp) {
            playSoundEffect(soundEffects.select);
            selectedButton = (selectedButton - 1 + menuButtons.length) % menuButtons.length;
            menuInputHandler.keys.ArrowUp = false;
        }
        
        if (menuInputHandler.keys.ArrowDown) {
            playSoundEffect(soundEffects.select);
            selectedButton = (selectedButton + 1) % menuButtons.length;
            menuInputHandler.keys.ArrowDown = false;
        }
        
        

        if (menuInputHandler.keys.z || menuInputHandler.keys.Z) {
            playSoundEffect(soundEffects.ok);
            switch (selectedButton) {
                case 0: // Start
                    playSoundEffect(soundEffects.ok);
                    transitionToMenu(MENU_STATES.CHARACTER_SELECT);
                    characterSelect.render();
                    return false;
                case 1: // Practice Start
                    playSoundEffect(soundEffects.ok);
                    console.log('Practice Start selected');
                    break;
                case 2: // Score
                    playSoundEffect(soundEffects.ok);
                    console.log('Score selected');
                    break;
                case 3: // Music Room
                    transitionToMenu(MENU_STATES.MUSIC_ROOM);
                    musicRoom.render();
                    playSoundEffect(soundEffects.ok);
                    currentMenuState = MENU_STATES.MUSIC_ROOM;
                    return false;
                case 4: // Options
                    transitionToMenu(MENU_STATES.OPTIONS);
                    optionsMenu.render();
                    playSoundEffect(soundEffects.ok);
                    currentMenuState = MENU_STATES.OPTIONS;
                    return false;
                case 5: // Quit
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

function transitionToMenu(newState) {
    const menuBox = document.getElementById('menuBox');
    document.getElementById('menuBox').style.display = 'none';
    document.getElementById('optionsMenuContainer').style.display = 'none';
    if (!menuBox) return;

    // Start transition
    menuBox.classList.add('menu-transition');
    menuBox.style.opacity = '0';
    
    setTimeout(() => {
        currentMenuState = newState;
        
        menuBox.classList.remove('menu-transition');
        menuBox.innerHTML = ''; // Clear previous content
        
        // Make sure menu is visible after transition
        menuBox.style.display = 'flex';
        menuBox.style.opacity = '1';
        
        
        // Render the appropriate menu
        switch(newState) {
            case MENU_STATES.MAIN:
                document.getElementById('menuBox').style.display = 'flex';
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
    }, 300); // Match this duration with your CSS transition time
} 

// Expose functions to the global scope
window.renderMainMenu = renderMainMenu;
window.handleMenuInput = handleMenuInput;
window.resetGame = resetGame;
window.MENU_STATES = MENU_STATES;