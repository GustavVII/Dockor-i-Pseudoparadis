class OptionsMenu {
    constructor() {
        this.options = [
            { 
                key: 'player', 
                value: parseInt(localStorage.getItem('playerLives')) || 3, 
                min: 1, 
                max: 5, 
                step: 1 
            },
            { 
                key: 'bomb', 
                value: parseInt(localStorage.getItem('bombs')) || 3, 
                min: 0, 
                max: 3, 
                step: 1 
            },
            { 
                key: 'music', 
                value: parseInt(localStorage.getItem('musicVolume')) || 80, 
                min: 0, 
                max: 100, 
                step: 5 
            },
            { 
                key: 'sound', 
                value: parseInt(localStorage.getItem('sfxVolume')) || 60, 
                min: 0, 
                max: 100, 
                step: 5 
            },
            { key: 'restoreDefault' },
            { key: 'quit' }
        ];
        this.selectedOption = 0;
        this.soundTestInterval = null;
        this.container = null;
        this.isVisible = false;
    }

    render() {
        // Create container if needed
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'options-menu-container';
            document.getElementById('menuBox').appendChild(this.container);
            this.container.style.transform = 'translateX(-100%)';
            this.container.style.opacity = '0';
        }

        // Always update content
        this.container.innerHTML = `
            <div class="options-header">${languageManager.getText('menus.optionsMenu.title')}</div>
            <div class="options-list"></div>
        `;

        const optionsList = this.container.querySelector('.options-list');
        
        this.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = `option-item ${this.selectedOption === index ? 'selected' : ''}`;
            
            if (option.step !== undefined) {
                if (option.key === 'player' || option.key === 'bomb') {
                    optionElement.innerHTML = `
                        <span class="option-name ${this.selectedOption === index ? 'selected' : ''}">
                            ${languageManager.getText(`menus.optionsMenu.${option.key}`)}
                        </span>
                        <div class="option-values">
                            ${this.generateValueOptions(option)}
                        </div>
                    `;
                } else {
                    // Keep the percentage display for volume options
                    optionElement.innerHTML = `
                        <span class="option-name ${this.selectedOption === index ? 'selected' : ''}">
                            ${languageManager.getText(`menus.optionsMenu.${option.key}`)}
                        </span>
                        <span class="single-value">${option.value}%</span>
                    `;
                }
            } else {
                optionElement.className = `action-item ${this.selectedOption === index ? 'selected' : ''}`;
                optionElement.textContent = languageManager.getText(`menus.optionsMenu.${option.key}`);
            }
            
            optionsList.appendChild(optionElement);
        });
    }

    generateValueOptions(option) {
        let html = '';
        for (let i = option.min; i <= option.max; i += option.step) {
            html += `<span class="value-option ${i === option.value ? 'active' : ''}">${i}</span>`;
        }
        return html;
    }

    handleInput() {
        if (!this.isVisible) return false;
        if (window.menuHandler.inputLocked) return false;
        
        const currentOption = this.options[this.selectedOption];
        
        if (window.menuInputHandler.isKeyPressed('ArrowUp')) {
            this.stopSoundTest();
            this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
            this.startSoundTestIfNeeded();
            playSoundEffect(soundEffects.select);
            this.render();
            return false;
        }
        
        if (window.menuInputHandler.isKeyPressed('ArrowDown')) {
            this.stopSoundTest();
            this.selectedOption = (this.selectedOption + 1) % this.options.length;
            this.startSoundTestIfNeeded();
            playSoundEffect(soundEffects.select);
            this.render();
            return false;
        }

        if (currentOption.step !== undefined) {
            if (window.menuInputHandler.isKeyPressed('ArrowRight')) {
                currentOption.value = Math.min(currentOption.value + currentOption.step, currentOption.max);
                this.updateSettings();
                playSoundEffect(soundEffects.select);
                this.render();
                return false;
            }
            
            if (window.menuInputHandler.isKeyPressed('ArrowLeft')) {
                currentOption.value = Math.max(currentOption.value - currentOption.step, currentOption.min);
                this.updateSettings();
                playSoundEffect(soundEffects.select);
                this.render();
                return false;
            }
        }

        if (window.menuInputHandler.isKeyPressed('z') || window.menuInputHandler.isKeyPressed('Z')) {
            if (currentOption.key === 'restoreDefault') {
                playSoundEffect(soundEffects.ok);
                this.restoreDefaults();
            } else if (currentOption.key === 'quit') {
                playSoundEffect(soundEffects.cancel);
                this.stopSoundTest();
                window.menuHandler.mainMenu.returnFromOptions();
                return false;
            }
            return false;
        }

        if (window.menuInputHandler.isKeyPressed('x') || window.menuInputHandler.isKeyPressed('X')) {
            playSoundEffect(soundEffects.cancel);
            this.stopSoundTest();
            window.menuHandler.mainMenu.returnFromOptions();
            return false;
        }

        return false;
    }

    cleanup() {
        this.stopSoundTest();
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }

    startSoundTestIfNeeded() {
        if (this.options[this.selectedOption].key === 'sound') {
            this.stopSoundTest();
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

    updateSettings() {
        const musicOption = this.options.find(o => o.key === 'music');
        const soundOption = this.options.find(o => o.key === 'sound');
        
        if (musicOption) {
            musicVolume = musicOption.value / 100;
            localStorage.setItem('musicVolume', musicOption.value);
            if (musicAudio) musicAudio.volume = musicVolume;
        }
        
        if (soundOption) {
            sfxVolume = soundOption.value / 100;
            localStorage.setItem('sfxVolume', soundOption.value);
        }
        
        localStorage.setItem('playerLives', this.options[0].value);
        localStorage.setItem('bombs', this.options[1].value);
    }

    restoreDefaults() {
        this.options[0].value = 3; // Player lives
        this.options[1].value = 3; // Bombs
        this.options[2].value = 80; // Music volume
        this.options[3].value = 60; // Sound volume
        this.updateSettings();
        this.render();
    }

    async animateInFromLeft() {
        this.isVisible = true;
        
        return new Promise(resolve => {
            this.container.style.transition = 'all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
            this.container.style.transform = 'translateX(0)';
            this.container.style.opacity = '1';
            
            setTimeout(resolve, 500);
        });
    }

    async animateOutToLeft() {
        return new Promise(resolve => {
            this.container.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            this.container.style.transform = 'translateX(-100%)';
            
            setTimeout(() => {
                this.isVisible = false;
                resolve();
            }, 500);
        });
    }
}