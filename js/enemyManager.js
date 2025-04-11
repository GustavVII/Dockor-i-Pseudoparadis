class EnemyManager {
  constructor() {
    this.activeEnemies = [];
    this.enemyTypes = {};
    this.spawnQueue = [];
    this.currentStageTime = 0;
    this.enemyWaves = []; // Initialize as empty array
    this.stageData = null; // Initialize stageData
    this.isInitialized = false;
  }

  registerEnemyType(type, enemyClass) {
    this.enemyTypes[type] = enemyClass;
  }
  async loadStage(stageData) {
    this.stageData = stageData;
    this.currentStageTime = 0;
    this.activeEnemies = [];
    this.spawnQueue = [];
    
    // Initialize enemyWaves with proper structure
    this.enemyWaves = (stageData.enemyWaves || []).map(wave => ({
      ...wave,
      spawned: false
    }));
    
    this.isInitialized = true;
    console.log('Stage loaded with', this.enemyWaves.length, 'enemy waves');
  }

  update(deltaTime) {
    if (!this.isInitialized) return; // Don't update if not initialized
    
    this.currentStageTime += deltaTime;
    
    // Safely iterate through enemy waves
    if (this.enemyWaves && this.enemyWaves.length) {
      this.enemyWaves.forEach(wave => {
        if (!wave.spawned && this.currentStageTime >= wave.time) {
          this.spawnWave(wave);
          wave.spawned = true;
        }
      });
    }
    
    // Update active enemies
    for (let i = this.activeEnemies.length - 1; i >= 0; i--) {
      const enemy = this.activeEnemies[i];
      if (enemy.update) enemy.update(deltaTime);
      
      if (enemy.isDefeated || (enemy.isOffScreen && enemy.isOffScreen())) {
        this.activeEnemies.splice(i, 1);
      }
    }
  }

  spawnWave(waveData) {
    waveData.enemies.forEach(enemyData => {
      for (let i = 0; i < enemyData.count; i++) {
        const EnemyClass = this.enemyTypes[enemyData.type];
        if (!EnemyClass) {
          console.error(`Enemy type ${enemyData.type} not registered`);
          return;
        }
        
        const enemy = new EnemyClass(enemyData);
        this.activeEnemies.push(enemy);
      }
    });
  }

  spawnFairy(x, y, color) {
    /*if (!this.isInitialized) {
        console.warn("EnemyManager not initialized yet");
        return;
    }*/

    const fairyData = {
        type: 'fairy',
        color: color,
        x: x !== undefined ? x : Math.random() * canvas.width,
        y: y !== undefined ? y : Math.random() * 400, // Random y between 0-400
        health: 100,
        speed: 1,
        movementPattern: 'default'
    };

    const fairy = new FairyEnemy(fairyData);
    this.activeEnemies.push(fairy);
    console.log(`Spawned ${color || 'random'} fairy at (${fairy.x.toFixed(0)}, ${fairy.y.toFixed(0)}`);
    return fairy;
  }

  render(ctx) {
    this.activeEnemies.forEach(enemy => enemy.render(ctx));
  }
}