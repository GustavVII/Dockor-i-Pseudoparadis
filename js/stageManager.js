// js/gameLogic/stageManager.js
class StageManager {
    constructor() {
        this.currentStageId = 0;
        this.totalStages = 5; // Set this to your total number of stages
        this.gameMode = 'normal'; // 'normal', 'practice', or 'extra'
        this.selectedPracticeStage = 1; // Default to stage 1
        this.difficulty = 'normal'; // Current difficulty
    }

    async loadStage(stageId, gameMode = 'normal', difficulty = 'normal') {
        this.gameMode = gameMode;
        this.difficulty = difficulty;
        this.currentStageId = stageId;

        try {
            const response = await fetch(`data/stages/stage${stageId}/stage.json`);
            this.currentStageData = await response.json();
            
            // Apply difficulty scaling
            this.applyDifficultySettings();
            
            return true;
        } catch (error) {
            console.error(`Failed to load stage ${stageId}:`, error);
            return false;
        }
    }

    applyDifficultySettings() {
        const difficultyMultipliers = {
            easy: 0.8,
            normal: 1.0,
            hard: 1.3,
            lunatic: 1.8
        };
        
        const multiplier = difficultyMultipliers[this.difficulty];
        
        // Scale enemy health and patterns
        if (this.currentStageData.enemyWaves) {
            this.currentStageData.enemyWaves.forEach(wave => {
                wave.enemies.forEach(enemy => {
                    enemy.health = Math.round(enemy.health * multiplier);
                    if (enemy.shootingPatterns) {
                        enemy.shootingPatterns.forEach(pattern => {
                            if (pattern.frequency) {
                                pattern.frequency *= (1 + (multiplier - 1) * 0.5);
                            }
                        });
                    }
                });
            });
        }
        
        // Scale boss health
        if (this.currentStageData.boss) {
            this.currentStageData.boss.health = Math.round(
                this.currentStageData.boss.health * multiplier
            );
        }
    }

    getStageUnlocked(stageId, difficulty) {
        const key = `stage${stageId}_${difficulty}_cleared`;
        return localStorage.getItem(key) === 'true';
    }

    getStageHighScore(stageId, difficulty) {
        const key = `stage${stageId}_${difficulty}_highscore`;
        return localStorage.getItem(key) || '000000000';
    }

    async onStageComplete(score) {
        // Save clear data
        const clearKey = `stage${this.currentStageId}_${this.difficulty}_cleared`;
        localStorage.setItem(clearKey, 'true');
        
        // Save high score if applicable
        const highScoreKey = `stage${this.currentStageId}_${this.difficulty}_highscore`;
        const currentHighScore = parseInt(localStorage.getItem(highScoreKey) || 0);
        if (score > currentHighScore) {
            localStorage.setItem(highScoreKey, score.toString().padStart(9, '0'));
        }
        
        if (this.gameMode === 'practice' || this.gameMode === 'extra') {
            window.quitToMenu();
            return;
        }
        
        // Normal mode progression
        if (this.currentStageId < this.totalStages) {
            // Load next stage
            await this.loadStage(this.currentStageId + 1, 'normal', this.difficulty);
            // Show intermission screen if needed
        } else {
            // Game complete!
            localStorage.setItem('clearedGame', 'true');
            window.clearedGame = true;
            window.quitToMenu();
        }
    }
}