class TextBarManager {
    constructor() {
        this.isActive = false;
        this.text = '';
        this.x = -300;
        this.y = 520;
        this.targetY = 0;
        this.width = 240;
        this.height = 30;
        this.opacity = 1;
        this.slideInTime = 500;
        this.moveDownTime = 500;
        this.slideOutTime = 500;

        this.animationPhase = 'slideIn';
        this.startTime = 0;
    }

    start(spellcardName) {
        this.isActive = true;
        this.text = spellcardName;
        this.x = -300;
        this.y = 520;
        this.targetY = 0;
        this.opacity = 1;

        this.animationPhase = 'slideIn';
        this.startTime = performance.now();
    }

    update() {
        if (!this.isActive) return;

        const currentTime = performance.now();
        const elapsedTime = currentTime - this.startTime;

        switch (this.animationPhase) {
            case 'slideIn':
                if (elapsedTime < this.slideInTime) {
                    this.x = -300 + (elapsedTime / this.slideInTime) * 320;
                } else {
                    this.x = 20; //Slutposition
                    this.animationPhase = 'stay';
                    this.startTime = currentTime;
                    
                }
                break;

            case 'stay':
                if (elapsedTime >= 1000) {
                    this.animationPhase = 'moveDown';
                    this.startTime = currentTime;
                }
                break;

            case 'moveDown':
                if (elapsedTime < this.moveDownTime) {
                    this.targetY = canvas.height - this.height - 20;
                    this.y += (this.targetY - this.y) * 0.1;
                } else {
                    this.y = this.targetY;
                    this.animationPhase = 'secondStay';
                    this.startTime = currentTime;
                }
                break;

            case 'secondStay':
                if (elapsedTime >= 4500) {
                    this.animationPhase = 'slideOut';
                    this.startTime = currentTime;
                }
                break;

            case 'slideOut':
                if (elapsedTime < this.slideOutTime) {
                    this.y += 2;
                } else {
                    this.isActive = false;
                }
                break;
        }
    }

    render(ctx) {
        if (!this.isActive) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;

        // En liten röd rektangel
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Med vit text och svart ytterkant
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);

        ctx.restore();
    }
}