class AutoScaler {
    constructor() {
        this.idealWidth = 960;
        this.idealHeight = 720;
        this.currentScale = 1;
        this.minScale = 0.5;
        this.isScaling = false;
        this.resizeObserver = null;
        this.animationFrame = null;
        this.lastWindowSize = { width: 0, height: 0 };
        this.init();
    }

    init() {
        this.checkScale();

        this.resizeObserver = new ResizeObserver(entries => {
            const currentWidth = window.innerWidth;
            const currentHeight = window.innerHeight;
            
            // Only proceed if window size actually changed
            if (currentWidth !== this.lastWindowSize.width || 
                currentHeight !== this.lastWindowSize.height) {
                
                this.lastWindowSize = { width: currentWidth, height: currentHeight };
                
                if (this.animationFrame) {
                    cancelAnimationFrame(this.animationFrame);
                }
                
                this.animationFrame = requestAnimationFrame(() => {
                    if (!this.isScaling) {
                        this.checkScale();
                    }
                });
            }
        });

        this.resizeObserver.observe(document.documentElement);
        document.addEventListener('wheel', this.preventZoom, { passive: false });
        document.addEventListener('keydown', this.preventZoom);
    }

    checkScale() {
        this.isScaling = true;
        
        const windowWidth = this.lastWindowSize.width;
        const windowHeight = this.lastWindowSize.height;
        
        // Always calculate scale, even when window is larger than container
        const widthScale = windowWidth / this.idealWidth;
        const heightScale = windowHeight / this.idealHeight;
        let newScale = Math.min(widthScale, heightScale, 1); // Never scale above 100%
        newScale = Math.max(newScale, this.minScale);
        
        // Always apply centering, even if scale didn't change
        this.applyScaleAndCenter(newScale);
        
        this.isScaling = false;
    }

    applyScaleAndCenter(scale) {
        // Only update transform if scale changed
        if (Math.abs(scale - this.currentScale) > 0.01) {
            this.currentScale = scale;
            document.body.style.transform = `scale(${scale})`;
        }
        
        // Always update centering
        const left = Math.max(0, (window.innerWidth - (this.idealWidth * this.currentScale)) / 2);
        const top = Math.max(0, (window.innerHeight - (this.idealHeight * this.currentScale)) / 2);
        
        document.body.style.transformOrigin = 'top left';
        document.body.style.width = `${this.idealWidth}px`;
        document.body.style.height = `${this.idealHeight}px`;
        document.body.style.position = 'fixed';
        document.body.style.left = `${left}px`;
        document.body.style.top = `${top}px`;
    }

    preventZoom = (e) => {
        if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.deltaY)) {
            e.preventDefault();
        }
    };

    cleanup() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        document.removeEventListener('wheel', this.preventZoom);
        document.removeEventListener('keydown', this.preventZoom);
        document.body.style.cssText = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.autoScaler = new AutoScaler();
    }, 100);
});