class EnemyManager {
    constructor() {
        this.activeEnemies = [];
        this.enemyClasses = {};
        this.readyCallbacks = [];
    }

    registerEnemyType(type, enemyClass) {
        this.enemyClasses[type] = enemyClass;
        console.log(`Registered enemy type: ${type}`);
    }

    onReady(callback) {
        if (this.isReady) {
            callback();
        } else {
            this.readyCallbacks.push(callback);
        }
    }

    setReady() {
        this.isReady = true;
        this.readyCallbacks.forEach(cb => cb());
        this.readyCallbacks = [];
    }

    createEnemy(type, config) {
        const EnemyClass = this.enemyClasses[type];
        if (!EnemyClass) {
            console.error(`Enemy type ${type} not registered`);
            return null;
        }
        return new EnemyClass(config);
    }

    addEnemy(type, config) {
        if (!this.isReady) {
            console.error('EnemyManager not ready yet!');
            return null;
        }
        const enemy = this.createEnemy(type, config);
        if (enemy) {
            this.activeEnemies.push(enemy);
        }
        return enemy;
    }

    spawnEnemies(type, count, area) {
        const enemies = [];
        for (let i = 0; i < count; i++) {
            const x = area.x + Math.random() * area.width;
            const y = area.y + Math.random() * area.height;
            enemies.push(this.addEnemy(type, { x, y }));
        }
        return enemies;
    }

    update(deltaTime) {
        for (let i = this.activeEnemies.length - 1; i >= 0; i--) {
            const enemy = this.activeEnemies[i];
            enemy.update(deltaTime);
            
            if (enemy.shouldDespawn()) {
                this.activeEnemies.splice(i, 1);
            }
        }
    }

    render(ctx) {
        this.activeEnemies.forEach(enemy => enemy.render(ctx));
    }

    destroyEnemy(enemy, index) {
        if (index === undefined) {
            index = this.activeEnemies.indexOf(enemy);
            if (index === -1) return;
        }
        
        // Call enemy's destroy method if it exists
        if (enemy.destroy) {
            enemy.destroy();
        }
        
        this.activeEnemies.splice(index, 1);
    }
}