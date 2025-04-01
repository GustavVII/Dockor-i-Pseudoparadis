class OptionsMenu {
    constructor() {
        this.options = [
            { 
                key: 'player', 
                value: parseInt(localStorage.playerLives) || 3, 
                min: 1, 
                max: 5, 
                step: 1 
            },
            { 
                key: 'bomb', 
                value: parseInt(localStorage.bombs) || 3, 
                min: 0, 
                max: 3, 
                step: 1 
            },
            { 
                key: 'music', 
                value: parseInt(localStorage.musicVolume) || 80, 
                min: 0, 
                max: 100, 
                step: 5 
            },
            { 
                key: 'sound', 
                value: parseInt(localStorage.sfxVolume) || 60, 
                min: 0, 
                max: 100, 
                step: 5 
            },
            { 
                key: 'restoreDefault', 
            },
            { 
                key: 'quit', 
            }
        ];
        this.selectedOption = 0;
        this.soundTestInterval = null;
        this.container = document.getElementById('optionsMenuContainer');
    }

    show() {
        if (!this.container) {
            this.createContainer();
        }
        this.container.style.display = 'block';
        this.render();
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'optionsMenuContainer';
        container.className = 'menu-container';
        container.style.display = 'none';
        document.querySelector('.container').appendChild(container);
        this.container = container;
    }

    render() {
        if (!this.container) return;
        
        this.container.innerHTML = /*Dra titeln från språktiteln. Detta händer vid varje benämning av "key"*/`
            <div class="options-header">${languageManager.getText('optionsMenu.title')}</div>
            <div class="options-list" id="optionsList"></div>
        `;

        const optionsList = document.getElementById('optionsList');
        if (!optionsList) return;

        this.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = `option-item ${this.selectedOption === index ? 'selected' : ''}`;
            
            if (option.step !== undefined) {
                if (option.key === 'player' || option.key === 'bomb') {
                    optionElement.innerHTML = `
                        <span class="option-name ${this.selectedOption === index ? 'selected' : ''}">
                            ${languageManager.getText(`optionsMenu.${option.key}`)}
                        </span>
                        <div class="option-values">
                            ${this.generateValueOptions(option)}
                        </div>
                    `;
                } else if (option.key === 'language') {
                    optionElement.innerHTML = `
                        <span class="option-name">${languageManager.getText(`optionsMenu.${option.key}`)}</span>
                        <span class="language-value">
                            ${languageManager.availableLanguages[option.value]}
                        </span>
                    `;
                } else {
                    optionElement.innerHTML = `
                        <span class="option-name ${this.selectedOption === index ? 'selected' : ''}">
                            ${languageManager.getText(`optionsMenu.${option.key}`)}
                        </span>
                        <span class="single-value">${option.value}%</span>
                    `;
                }
            } else {
                optionElement.className = `action-item ${this.selectedOption === index ? 'selected' : ''}`;
                optionElement.textContent = languageManager.getText(`optionsMenu.${option.key}`);
            }
            
            optionsList.appendChild(optionElement);
        });
    }

    generateValueOptions(option) {
        let html = '';
        for (let i = option.min; i <= option.max; i += option.step) {
            const isActive = i === option.value;
            html += `
                <span class="value-option ${isActive ? 'active' : ''}">
                    ${i}
                </span>
            `;
        }
        return html;
    }

    handleInput() {
        const now = Date.now();

        if (now - lastMenuInput < 100) {
            return false;
        }
        lastMenuInput = now;

        if (menuInputHandler.keys.ArrowUp) {
            this.stopSoundTest();
            this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
            menuInputHandler.keys.ArrowUp = false;
            this.startSoundTestIfNeeded();
            playSoundEffect(soundEffects.select);
        }
        if (menuInputHandler.keys.ArrowDown) {
            this.stopSoundTest();
            this.selectedOption = (this.selectedOption + 1) % this.options.length;
            menuInputHandler.keys.ArrowDown = false;
            this.startSoundTestIfNeeded();
            playSoundEffect(soundEffects.select);
        }

        const currentOption = this.options[this.selectedOption];
        
        if (menuInputHandler.keys.ArrowRight) {
            if (currentOption.step !== undefined) {
                currentOption.value = Math.min(
                    currentOption.value + currentOption.step,
                    currentOption.max
                );
                this.updateSettings();
                playSoundEffect(soundEffects.select);
            }
            menuInputHandler.keys.ArrowRight = false;
        }
        
        if (menuInputHandler.keys.ArrowLeft) {
            if (currentOption.step !== undefined) {
                currentOption.value = Math.max(
                    currentOption.value - currentOption.step,
                    currentOption.min
                );
                this.updateSettings();
                playSoundEffect(soundEffects.select);
            }
            menuInputHandler.keys.ArrowLeft = false;
        }

        if (menuInputHandler.keys.z || menuInputHandler.keys.Z) {
            if (currentOption.key === 'restoreDefault') {
                playSoundEffect(soundEffects.ok);
                this.restoreDefaults();
            } else if (currentOption.key === 'quit') {
                playSoundEffect(soundEffects.cancel);
                menuInputHandler.keys.z = false;
                menuInputHandler.keys.Z = false;
                this.stopSoundTest();
                return true;
            }
            menuInputHandler.keys.z = false;
            menuInputHandler.keys.Z = false;
        }

        if (menuInputHandler.keys.x || menuInputHandler.keys.X) {
            playSoundEffect(soundEffects.cancel);
            this.stopSoundTest();
            return true;
        }

        this.render();
        return false;
    }

    playSoundTest() {
        playSoundEffect(soundEffects.timeout);
    }

    updateSettings() {
        // Uppdatera inställningar med nya värden
        const musicOption = this.options.find(o => o.key === 'music');
        const soundOption = this.options.find(o => o.key === 'sound');
        
        if (musicOption) {
            musicVolume = musicOption.value / 100;
            if (musicAudio) musicAudio.volume = musicVolume;
        }
        
        if (soundOption) {
            sfxVolume = soundOption.value / 100;
        }
        
        saveSettings();
        this.render(); // Uppdatera containern
    }

    updateVolume() {
        const musicOption = this.options.find(o => o.name === 'Music');
        const soundOption = this.options.find(o => o.name === 'Sound');
        
        if (musicOption) {
            window.musicVolume = musicOption.value / 100;
            if (window.musicAudio) {
                window.musicAudio.volume = window.musicVolume;
            }
        }
        
        if (soundOption) {
            window.sfxVolume = soundOption.value / 100;
        }
        
        window.saveAudioSettings();
    }


    startSoundTestIfNeeded() {
        if (this.options[this.selectedOption].key === 'sound') {
            this.stopSoundTest();
            this.playSoundTest();
            this.soundTestInterval = setInterval(() => this.playSoundTest(), 1000);
        }
    }

    playSoundTest() {
        if (soundEffects.timeout) {
            soundEffects.timeout.volume = this.options.find(o => o.key === 'sound').value / 100;
            playSoundEffect(soundEffects.timeout);
        }
    }

    stopSoundTest() {
        if (this.soundTestInterval) {
            clearInterval(this.soundTestInterval);
            this.soundTestInterval = null;
        }
    }

    restoreDefaults() {
        this.options[0].value = 3; // Player lives
        this.options[1].value = 3; // Bombs
        this.options[2].value = 80; // Music volume
        this.options[3].value = 60; // Sound volume
        
        this.updateSettings();
        saveSettings();
        this.render();
    }
    updateSettings() {
        // Update runtime values
        musicVolume = this.options[2].value / 100;
        sfxVolume = this.options[3].value / 100;
        
        // Update audio if available
        if (musicAudio) musicAudio.volume = musicVolume;
        
        // Save to storage
        saveSettings();
    }
    
    addLanguageOption() {
        this.options.splice(4, 0, { 
            key: 'language',
            name: 'Language',
            value: languageManager.currentLanguage,
            options: Object.keys(languageManager.availableLanguages)
        });
    }
}