class MenuHandler {
    constructor() {
        this.currentMenuState = MENU_STATES.MAIN;
        this.clearedGame = localStorage.getItem('clearedGame') === 'true';
        window.clearedGame = localStorage.getItem('clearedGame') === 'true';
        this.inputLocked = false;
        this.transitioning = false;
        this.mainMenu = new MainMenu();
        this.characterSelect = null;
        this.musicRoom = null;
        this.optionsMenu = null;
        this.stageSelect = null;
        this.isSubmenuActive = false;
        this.ensureMenuElements();
    }

    ensureMenuElements() {
        const container = document.querySelector('.container');
        if (!container.querySelector('#menuBox')) {
            const menuBox = document.createElement('div');
            menuBox.id = 'menuBox';
            container.appendChild(menuBox);
        }
    }

    showMenu() {
        const menuBox = document.getElementById('menuBox');
        if (!menuBox) {
            console.error('Menu box not found');
            return false;
        }

        menuBox.style.display = 'flex';
        
        const canvas = document.getElementById('canvas');
        const statsBox = document.getElementById('playerStatsDisplay');
        
        if (canvas) canvas.style.display = 'none';
        if (statsBox) statsBox.style.display = 'none';
        
        return true;
    }

    hideMenu() {
        const menuBox = document.getElementById('menuBox');
        const canvas = document.getElementById('canvas');
        const statsBox = document.getElementById('playerStatsDisplay');
        
        if (menuBox) menuBox.style.display = 'none';
        if (canvas) canvas.style.display = 'block';
        if (statsBox) statsBox.style.display = 'flex';
    }

    async switchMenu(newState, gameMode) {
        if (this.inputLocked) return;
    
        // Activate menu input handler
        if (window.menuInputHandler) {
            window.menuInputHandler.activate();
        }
    
        // Clean up previous menu
        if (this.currentMenuState === MENU_STATES.MAIN && this.mainMenu?.title) {
            this.mainMenu.title.cleanup();
        }
        
        // Hide previous containers
        if (this.difficultySelect?.container) {
            this.difficultySelect.container.style.display = 'none';
        }
        if (this.characterSelect?.container) {
            this.characterSelect.container.style.display = 'none';
        }
        if (this.difficultySelect) {
            this.difficultySelect.cleanup();
            this.difficultySelect = null;
        }
        if (this.characterSelect) {
            this.characterSelect.cleanup();
            this.characterSelect = null;
        }
        if (this.stageSelect) {
            this.stageSelect.cleanup();
            this.stageSelect = null;
        }
                
        // Prevent re-entrancy during transitions
        if (this.transitioning) {
            console.log('Already in transition, skipping');
            return;
        }
        
        this.transitioning = true;
        this.inputLocked = true; // Lock input at start of transition
        
        try {
            const menuBox = document.getElementById('menuBox');
            if (!menuBox) return;
            
            // Clear previous menu
            menuBox.innerHTML = '';
            
            this.currentMenuState = newState;
            
            switch(newState) {
                case MENU_STATES.MAIN:
                    setMenuBackground('mainMenu');
                    this.mainMenu = new MainMenu();
                    await this.mainMenu.initialize();
                    break;
                    
                case MENU_STATES.CHARACTER_SELECT:
                    setMenuBackground('characterSelect');
                    this.difficultySelect = new DifficultySelect(gameMode);
                    this.characterSelect = new CharacterSelect(gameMode);
                    if(gameMode === 'practice') {this.stageSelect = new StageSelect();}
                    await this.characterSelect.ensureDataLoaded(); // Ensure data is loaded
                    await this.difficultySelect.animateIn();
                    break;
                    
                case MENU_STATES.MUSIC_ROOM:
                    setMenuBackground('musicRoom');
                    this.musicRoom = new MusicRoom();
                    await this.musicRoom.render();
                    break;
    
                case MENU_STATES.OPTIONS:
                    this.optionsMenu = new OptionsMenu();
                    this.optionsMenu.render();
                    break;
            }
            
        } catch (error) {
            console.error('Menu switch error:', error);
            errorHandler.handleError(error);
        } finally {
            this.transitioning = false;
            this.inputLocked = false; // Unlock when transition is complete
        }
    }

    handleInput() {
        try {
            if (this.mainMenu?.isOptionsSubmenuActive) {
                const shouldExit = this.mainMenu.optionsMenu.handleInput();
                if (shouldExit) {
                    this.mainMenu.returnFromOptions();
                }
                return false;
            }

            switch (this.currentMenuState) {
                case MENU_STATES.MAIN:
                    return this.mainMenu.handleInput();
                case MENU_STATES.CHARACTER_SELECT:
                    if (this.difficultySelect && !this.difficultySelect.difficultySelected) {
                        return this.difficultySelect.handleInput();
                    }
                    if(this.stageSelect) {
                        if (this.stageSelect.isActive) {
                            return this.stageSelect.handleInput();
                        }
                    }
                    return this.characterSelect?.handleInput?.() || false;
                case MENU_STATES.MUSIC_ROOM:
                    return this.musicRoom?.handleInput?.() || false;
                
                default:
                    return false;
            }
        } catch (error) {
            console.error('Menu input error:', error);
            return false;
        }
    }

    resetGame() {
        if (window.musicAudio) {
            window.musicAudio.pause();
            window.musicAudio = null;
        }

        window.menuActive = false;
        this.mainMenu.selectedButton = 0;

        document.getElementById('startScreen').style.display = 'flex';
        document.getElementById('menuBox').style.display = 'none';
        document.getElementById('canvas').style.display = 'none';
        document.getElementById('playerStatsDisplay').style.display = 'none';
    }

    toggleClearedGame() {
        this.clearedGame = !this.clearedGame;
        localStorage.setItem('clearedGame', this.clearedGame);
        window.clearedGame = this.clearedGame;
        console.log('clearedGame set to:', this.clearedGame);
        if(this.clearedGame) {playSoundEffect(soundEffects.extend)} else {playSoundEffect(soundEffects.destroy)}
        return this.clearedGame;
    }
}