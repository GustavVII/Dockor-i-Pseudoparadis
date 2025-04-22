// js/gameLogic/spriteAnimationManager.js
class SpriteAnimationManager {
    constructor() {
        this.animations = {};
        this.currentAnimation = null;
        this.currentFrameIndex = 0;
        this.frameCounter = 0;
        this.frameDelay = 5; // Default frames between animation updates
        this.isPlaying = false;
        this.loop = true;
    }

    addAnimation(name, frames, frameDelay = 5, loop = true) {
        this.animations[name] = {
            frames: frames,
            frameDelay: frameDelay,
            loop: loop
        };
    }

    playAnimation(name) {
        if (!this.animations[name] || this.currentAnimation === name) return;

        this.currentAnimation = name;
        this.currentFrameIndex = 0;
        this.frameCounter = 0;
        this.frameDelay = this.animations[name].frameDelay;
        this.loop = this.animations[name].loop;
        this.isPlaying = true;
    }

    stopAnimation() {
        this.isPlaying = false;
    }

    resetAnimation() {
        this.currentFrameIndex = 0;
        this.frameCounter = 0;
    }

    update() {
        if (!this.isPlaying || !this.currentAnimation) return;

        this.frameCounter++;
        
        if (this.frameCounter >= this.frameDelay) {
            this.frameCounter = 0;
            this.currentFrameIndex++;

            const animation = this.animations[this.currentAnimation];
            if (this.currentFrameIndex >= animation.frames.length) {
                if (this.loop) {
                    this.currentFrameIndex = 0;
                } else {
                    this.currentFrameIndex = animation.frames.length - 1;
                    this.isPlaying = false;
                }
            }
        }
    }

    getCurrentFrame() {
        if (!this.currentAnimation) return null;
        return this.animations[this.currentAnimation].frames[this.currentFrameIndex];
    }
}