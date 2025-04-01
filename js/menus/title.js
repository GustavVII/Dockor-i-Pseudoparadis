// titleManager.js
class TitleManager {
    constructor() {
        this.titleContainer = null;
        this.animationTimeout = null;
        this.isVisible = false;
    }

    async animateTitle() {
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
            this.animationTimeout = null;
        }
        
        inputLocked = true; // Lock inputs during animation
        
        const characters = this.titleContainer?.querySelectorAll('.series-title, .game-title');
        if (!characters) return;
        
        // Initial delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Animate each character sequentially
        for (let i = 0; i < characters.length; i++) {
            characters[i].classList.add('animate-in');
            
            // Remove animation class after completion
            setTimeout(() => {
                characters[i].classList.remove('animate-in');
                characters[i].style.opacity = '1';
                characters[i].style.transform = 'translate(0, 0)';
            }, 300);
            
            if (i < characters.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
        
        inputLocked = false; // Unlock inputs after animation
    }

    async animateTitleExit() {
        if (!this.isVisible) return;
        
        const characters = this.titleContainer.querySelectorAll('.series-title, .game-title');
        await Promise.all(
            Array.from(characters).map(char => {
                return new Promise(resolve => {
                    char.style.transition = 'all 0.5s ease-out';
                    char.style.opacity = '0';
                    char.style.transform = `translate(${char.style.getPropertyValue('--start-x')}, ${char.style.getPropertyValue('--start-y')})`;
                    setTimeout(resolve, 500);
                });
            })
        );
        this.isVisible = false;
    }

    async animateTitleEnter() {
        if (this.isVisible) return;
        
        const container = this.createTitle();
        const characters = container.querySelectorAll('.series-title, .game-title');
        
        // Set initial state
        characters.forEach(char => {
            char.style.opacity = '0';
            char.style.transform = `translate(${char.style.getPropertyValue('--start-x')}, ${char.style.getPropertyValue('--start-y')})`;
        });
        
        // Animate in with delay
        for (let i = 0; i < characters.length; i++) {
            setTimeout(() => {
                characters[i].style.transition = 'all 0.5s ease-out';
                characters[i].style.opacity = '1';
                characters[i].style.transform = 'translate(0, 0)';
            }, i * 200);
        }
        
        this.isVisible = true;
        return new Promise(resolve => setTimeout(resolve, characters.length * 200));
    }

    animateMenuTransition() {
        // Don't lock inputs for this animation
        const characters = this.titleContainer?.querySelectorAll('.series-title, .game-title');
        if (!characters) return;
        
        // Reset all characters to initial state
        characters.forEach(char => {
            char.style.opacity = '0';
            char.style.transform = `translate(${char.style.getPropertyValue('--start-x')}, ${char.style.getPropertyValue('--start-y')})`;
        });
        
        // Animate each character sequentially
        for (let i = 0; i < characters.length; i++) {
            setTimeout(() => {
                characters[i].classList.add('animate-in');
                setTimeout(() => {
                    characters[i].classList.remove('animate-in');
                    characters[i].style.opacity = '1';
                    characters[i].style.transform = 'translate(0, 0)';
                }, 300);
            }, i * 200);
        }
    }

    createTitle() {
        if (this.titleContainer && this.isVisible) return this.titleContainer;
        
        // Create new title if needed
        const container = document.createElement('div');
        container.className = 'main-menu-title';
        
        // Series title (東 方)
        const seriesTitle1 = document.createElement('div');
        seriesTitle1.className = 'series-title';
        seriesTitle1.textContent = '東';
        seriesTitle1.style.setProperty('--start-x', '0');
        seriesTitle1.style.setProperty('--start-y', '-300%');
        
        const seriesTitle2 = document.createElement('div');
        seriesTitle2.className = 'series-title';
        seriesTitle2.textContent = '方';
        seriesTitle2.style.setProperty('--start-x', '1500%');
        seriesTitle2.style.setProperty('--start-y', '0');
        
        // Game title (蓬 莱 人 形)
        const gameTitle1 = document.createElement('div');
        gameTitle1.className = 'game-title';
        gameTitle1.textContent = '蓬';
        gameTitle1.style.setProperty('--start-x', '-400%');
        gameTitle1.style.setProperty('--start-y', '-400%');
        
        const gameTitle2 = document.createElement('div');
        gameTitle2.className = 'game-title';
        gameTitle2.textContent = '莱';
        gameTitle2.style.setProperty('--start-x', '400%');
        gameTitle2.style.setProperty('--start-y', '400%');
        
        const gameTitle3 = document.createElement('div');
        gameTitle3.className = 'game-title';
        gameTitle3.textContent = '人';
        gameTitle3.style.setProperty('--start-x', '-400%');
        gameTitle3.style.setProperty('--start-y', '0');
        
        const gameTitle4 = document.createElement('div');
        gameTitle4.className = 'game-title';
        gameTitle4.textContent = '形';
        gameTitle4.style.setProperty('--start-x', '0');
        gameTitle4.style.setProperty('--start-y', '300%');
        
        container.append(seriesTitle1, seriesTitle2, gameTitle1, gameTitle2, gameTitle3, gameTitle4);
        this.titleContainer = container;
        this.isVisible = true;
        return container;
    }

    async animateMenuButtonsExit() {
        const menuButtons = document.querySelectorAll('.menu-button');
        const animations = [];
        
        menuButtons.forEach(button => {
            button.style.transition = 'all 0.5s ease-out';
            button.style.opacity = '0';
            button.style.transform = 'translateX(100%)';
            animations.push(button.animate([
                { opacity: 1, transform: 'translateX(0)' },
                { opacity: 0, transform: 'translateX(100%)' }
            ], {
                duration: 500,
                easing: 'ease-out'
            }).finished);
        });
        
        await Promise.all(animations);
    }
}

const titleManager = new TitleManager();
window.titleManager = titleManager;