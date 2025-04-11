class StageSelect {
    constructor() {
        this.container = null;
        this.isActive = false;
        this.selectedIndex = 0;
    }

    async render() {
        // Create container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'stage-select-container';
            document.querySelector('.container').appendChild(this.container);
        }

        this.container.innerHTML = '';
        
        // Create stage buttons
        for (let stageId = 1; stageId <= window.stageManager.totalStages; stageId++) {
            const unlocked = window.stageManager.getStageUnlocked(
                stageId,
                window.menuHandler.difficultySelect.difficulties[
                    window.menuHandler.difficultySelect.selectedIndex
                ].id
            );

            const button = document.createElement('div');
            button.className = `stage-select-button ${this.selectedIndex === stageId - 1 ? 'selected' : ''} ${unlocked ? '' : 'locked'}`;
            
            const highScore = window.stageManager.getStageHighScore(
                stageId,
                window.menuHandler.difficultySelect.difficulties[
                    window.menuHandler.difficultySelect.selectedIndex
                ].id
            );
            
            button.textContent = `Stage ${stageId}: ${highScore}`;
            
            if (unlocked) {
                button.addEventListener('click', () => this.selectStage(stageId));
            }
            
            this.container.appendChild(button);
        }
    }

    async show() {
        this.isActive = true;
        await this.render();
        this.container.style.display = 'flex';
        // Initial animation
        this.container.style.transform = 'translateX(100%)';
        await new Promise(resolve => {
            setTimeout(() => {
                this.container.style.transition = 'transform 0.5s ease';
                this.container.style.transform = 'translateX(0)';
                setTimeout(resolve, 500);
            }, 0);
        });
    }

    async hide() {
        this.isActive = false;
        this.container.style.transform = 'translateX(100%)';
        await new Promise(resolve => {
            setTimeout(() => {
                this.container.style.display = 'none';
                resolve();
            }, 500);
        });
    }

    selectStage(stageId) {
        window.stageManager.selectedPracticeStage = stageId;
        window.menuHandler.startGame();
    }

    cancel() {
        this.hide();
        window.menuHandler.characterSelect.animateFromLeft();
    }

    handleInput() {
        if (!this.isActive) return false;

        if (window.menuInputHandler.isKeyPressed('ArrowUp')) {
            this.selectedIndex = Math.max(0, this.selectedIndex - 1);
            this.render();
            playSoundEffect(soundEffects.select);
            return true;
        }

        if (window.menuInputHandler.isKeyPressed('ArrowDown')) {
            this.selectedIndex = Math.min(window.stageManager.totalStages - 1, this.selectedIndex + 1);
            this.render();
            playSoundEffect(soundEffects.select);
            return true;
        }

        if (window.menuInputHandler.isKeyPressed('z') || window.menuInputHandler.isKeyPressed('Z')) {
            const stageId = this.selectedIndex + 1;
            if (window.stageManager.getStageUnlocked(
                stageId,
                window.menuHandler.difficultySelect.difficulties[
                    window.menuHandler.difficultySelect.selectedIndex
                ].id
            )) {
                this.selectStage(stageId);
                playSoundEffect(soundEffects.ok);
            } else playSoundEffect(soundEffects.invalid);
            return true;
        }

        if (window.menuInputHandler.isKeyPressed('x') || window.menuInputHandler.isKeyPressed('X')) {
            this.cancel();
            playSoundEffect(soundEffects.cancel);
            return true;
        }

        return false;
    }

    cleanup() {
        if (this.container && this.container.parentNode) {
            this.container.remove();
        }
        this.container = null;
    }
}