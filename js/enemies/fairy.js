class FairyEnemy {
    constructor(data) {
        this.type = data.type;
        this.color = data.color || this.getRandomColor(); // Use provided color or random
        this.health = data.health || 100;
        this.maxHealth = this.health;
        this.x = data.x || 0;
        this.y = data.y || 0;
        this.width = 32;
        this.height = 32;
        this.speed = data.speed || 1;
        this.bullets = [];
        this.shootingPatterns = data.shootingPatterns || [];
        this.movementPattern = data.movementPattern || 'default';
        this.spawnTime = 0;
        this.image = window.assetLoader.getImage(`${this.color}Fairy`);
        this.isDefeated = false;
    }

    getRandomColor() {
        const colors = ['red', 'green', 'blue', 'test'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
  
    spawn(x, y) {
      this.x = x;
      this.y = y;
      this.spawnTime = performance.now();
    }
  
    update(deltaTime) {
      // Update movement
      if (this.movementPattern) {
        const newPos = this.movementPattern.update(deltaTime);
        this.x = newPos.x;
        this.y = newPos.y;
      }
      
      // Handle shooting patterns
      const currentTime = performance.now() - this.spawnTime;
      this.shootingPatterns.forEach(pattern => {
        if (currentTime >= pattern.startTime && 
            currentTime <= pattern.startTime + pattern.duration) {
          this.executeShootingPattern(pattern, deltaTime);
        }
      });
    }
  
    executeShootingPattern(pattern, deltaTime) {
      // Implement pattern-specific shooting logic
      switch(pattern.type) {
        case 'aimed':
          this.shootAimedBullets(pattern);
          break;
        case 'ring':
          this.shootRingBullets(pattern);
          break;
        // Add more pattern types
      }
    }
  
    shootAimedBullets(pattern) {
      // Calculate direction to player
      const dx = characterManager.cursor.x - this.x;
      const dy = characterManager.cursor.y - this.y;
      const angle = Math.atan2(dy, dx);
      
      // Create bullet
      const bullet = new Bullet(
        this.x, this.y,
        Math.cos(angle) * pattern.speed,
        Math.sin(angle) * pattern.speed,
        pattern.bullet
      );
      
      window.bulletManager.addBullet(bullet);
    }
  
    render(ctx) {
      if (this.image) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      }
      
      // Render health bar if damaged
      if (this.health < this.maxHealth) {
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 5, this.width, 3);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y - 5, this.width * healthPercent, 3);
      }
    }
  
    isOffScreen() {
      return this.y > canvas.height || 
             this.y + this.height < 0 ||
             this.x > canvas.width ||
             this.x + this.width < 0;
    }
}