class Title {
    constructor() {
        this.container = null;
        this.isActive = false;
        this.hasTransitioned = false;
    }

    create() {
        if (this.container) return this.container;
        
        // Ensure title container exists
        const titleContainer = document.getElementById('titleContainer') || document.createElement('div');
        titleContainer.id = 'titleContainer';
        if (!document.getElementById('titleContainer')) {
            document.querySelector('.container').appendChild(titleContainer);
        }
        
        this.container = document.createElement('div');
        this.container.className = 'main-menu-title';
        
        // Create title elements (same as before)
        const seriesTitle1 = this.createTitleElement('東', 'series-title', '0', '-500%');
        const seriesTitle2 = this.createTitleElement('方', 'series-title', '3000%', '0');
        
        // Game title (蓬 莱 人 形)
        const gameTitle1 = this.createTitleElement('蓬', 'game-title', '-750%', '-750%');
        const gameTitle2 = this.createTitleElement('莱', 'game-title', '750%', '750%');
        const gameTitle3 = this.createTitleElement('人', 'game-title', '-1000%', '0');
        const gameTitle4 = this.createTitleElement('形', 'game-title', '0', '250%');
        
        this.container.append(seriesTitle1, seriesTitle2, gameTitle1, gameTitle2, gameTitle3, gameTitle4);
        
        this.resetToCenter();
        
        if (titleContainer) {
            titleContainer.appendChild(this.container);
        }
        
        this.isActive = true;
        return this.container;
    }

    createTitleElement(text, className, startX, startY) {
        const element = document.createElement('div');
        element.className = className;
        element.textContent = text;
        element.style.setProperty('--start-x', startX);
        element.style.setProperty('--start-y', startY);
        return element;
    }

    resetToCenter() {
        if (!this.container) return;
        
        this.container.style.left = '50%';
        this.container.style.top = '50%';
        this.container.style.transform = 'translate(-50%, -50%)';
        
        const elements = this.container.querySelectorAll('div');
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = `translate(${el.style.getPropertyValue('--start-x')}, ${el.style.getPropertyValue('--start-y')})`;
        });
    }

    async animateIn() {
        if (!this.container || !this.isActive) return;
        
        // Store the animation promise
        this.animationPromise = new Promise(async (resolve) => {
            const elements = Array.from(this.container.querySelectorAll('div'));
            for (let i = 0; i < elements.length; i++) {
                await new Promise(resolve => {
                    setTimeout(() => {
                        elements[i].style.transition = 'all 0.5s ease-out';
                        elements[i].style.opacity = '1';
                        elements[i].style.transform = 'translate(0, 0)';
                        setTimeout(resolve, 75);
                    }, i * 50);
                });
            }
            resolve();
        });
        
        return this.animationPromise;
    }

    async moveToSide() {
        if (!this.container || !this.isActive || this.hasTransitioned) return;
        
        this.hasTransitioned = true;
        
        // Apply the new position with transition
        this.container.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        this.container.style.left = '5%';
        this.container.style.transform = 'translateY(-50%)';
        
        return new Promise(resolve => {
            // Wait for transition to complete
            const onTransitionEnd = () => {
                this.container.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            };
            this.container.addEventListener('transitionend', onTransitionEnd);
            
            // Fallback timeout
            setTimeout(resolve, 500);
        });
    }

    async animateOut() {
        if (!this.container || !this.isActive) return;
        
        const elements = Array.from(this.container.querySelectorAll('div'));
        const animations = [];
        
        // Animate all elements simultaneously back to starting positions
        elements.forEach(el => {
            el.style.transition = 'all 1s ease-out';
            el.style.transform = `translate(${el.style.getPropertyValue('--start-x')}, ${el.style.getPropertyValue('--start-y')})`;
            
            animations.push(new Promise(resolve => {
                el.addEventListener('transitionend', resolve, { once: true });
            }));
        });
        
        await Promise.all(animations);
        this.cleanup(); // Remove the title after animation
    }

    async animateToLeft() {
        if (!this.container) return;
                
        this.container.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        this.container.style.left = '-15%';
        
        // Nödvändigt för inställningarnas animation, venne varför
        // Rör iaf inte
        return new Promise(resolve => {
            setTimeout(resolve, 0);
        });
    }

    async animateFromLeft() {
        if (!this.container) return;
        
        this.container.style.transition = 'all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
        this.container.style.left = '5%';
        
        return new Promise(resolve => {
            setTimeout(resolve, 500);
        });
    }

    cleanup() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.isActive = false;
        this.hasTransitioned = false;
    }
}