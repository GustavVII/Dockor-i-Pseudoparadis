// js/gameLogic/bosses/cirno.js
class CirnoBoss {
    constructor(data) {
      this.data = data;
      this.health = data.health;
      this.maxHealth = data.health;
      this.x = canvas.width / 2;
      this.y = -100;
      this.width = 64;
      this.height = 64;
      this.currentSpellcard = 0;
      this.spellcards = data.spellcards;
      this.state = 'entering';
      this.enteringSpeed = 2;
      this.image = window.assetLoader.getImage('boss_cirno');
    }
  
    update(deltaTime) {
      switch(this.state) {
        case 'entering':
          this.y += this.enteringSpeed;
          if (this.y >= 100) {
            this.state = 'spellcard';
            this.startSpellcard(0);
          }
          break;
          
        case 'spellcard':
          this.updateSpellcard(deltaTime);
          break;
          
        case 'defeated':
          this.y -= this.enteringSpeed;
          if (this.y < -this.height) {
            this.state = 'finished';
          }
          break;
      }
    }
  
    startSpellcard(index) {
      if (index >= this.spellcards.length) {
        this.state = 'defeated';
        return;
      }
      
      this.currentSpellcard = index;
      const spellcard = this.spellcards[index];
      this.spellcardStartTime = performance.now();
      this.spellcardEndTime = this.spellcardStartTime + spellcard.duration * 1000;
      
      // Initialize spellcard-specific behavior
      this.setupSpellcardPattern(spellcard);
    }
  
    setupSpellcardPattern(spellcard) {
      // Example for spiral pattern
      if (spellcard.bulletPattern === 'spiral') {
        this.spiralAngle = 0;
        this.spiralBulletTimer = 0;
      }
      // Add other pattern setups
    }
  
    updateSpellcard(deltaTime) {
      const currentTime = performance.now();
      const spellcard = this.spellcards[this.currentSpellcard];
      
      if (currentTime >= this.spellcardEndTime) {
        this.startSpellcard(this.currentSpellcard + 1);
        return;
      }
      
      // Update spellcard-specific behavior
      switch(spellcard.bulletPattern) {
        case 'spiral':
          this.updateSpiralPattern(deltaTime, spellcard);
          break;
        // Add other pattern updates
      }
    }
  
    updateSpiralPattern(deltaTime, spellcard) {
      this.spiralBulletTimer += deltaTime;
      const bulletInterval = 100; // ms between bullets
      
      if (this.spiralBulletTimer >= bulletInterval) {
        this.spiralBulletTimer = 0;
        this.spiralAngle += 0.1;
        
        for (let i = 0; i < 3; i++) {
          const angle = this.spiralAngle + (i * Math.PI * 2 / 3);
          const bullet = new Bullet(
            this.x, this.y,
            Math.cos(angle) * 2,
            Math.sin(angle) * 2,
            'ice_crystal'
          );
          window.bulletManager.addBullet(bullet);
        }
      }
    }
  
    render(ctx) {
      if (this.image) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      }
      
      // Render health bar
      const healthPercent = this.health / this.maxHealth;
      ctx.fillStyle = 'red';
      ctx.fillRect(50, 20, canvas.width - 100, 10);
      ctx.fillStyle = 'cyan';
      ctx.fillRect(50, 20, (canvas.width - 100) * healthPercent, 10);
      
      // Render spellcard name if active
      if (this.state === 'spellcard') {
        const spellcard = this.spellcards[this.currentSpellcard];
        ctx.fillStyle = 'white';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(spellcard.name, canvas.width / 2, 50);
      }
    }
}