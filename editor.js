class PatternEditor {
    constructor() {
        this.canvas = document.getElementById('editorCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.enemyBulletManager = new EnemyBulletManager();

        this.lastFrameTime = Date.now();
        
        this.ctx.translate(200, 200); // Permanent offset
    
        // Update canvas dimensions for boundary checks
        window.canvas = {
            width: 574,
            height: 670
        };
        
        // Update initial positions (no need for margin calculations now)
        this.characterPos = {
            x: this.canvas.width / 2 - 200, // Adjust for the translation
            y: this.canvas.height - 50 - 400,     // No margin needed
            size: 8
        };
        this.grazeRingRotation = 0;
        
        this.patternOrigin = {
            x: this.canvas.width / 2 - 200, // Adjust for translation
            y: 100,                         // No margin needed
            size: 16,
            dragging: false
        };
        
        this.dragging = false;
        
        // Define bullet types
        this.bulletColors = ['Red', 'Orange', 'Yellow', 'Green', 'Cyan', 'Blue', 'Purple', 'Magenta'];
        this.bulletTypes = ['Bullet', 'Butterfly', 'Dagger', 'Elipse', 'Falcon', 'Kunai', 'LargeSphere', 'Sphere', 'Star'];
        
        // Define pattern behaviors
        this.patternBehaviors = ['sequential']; // Add more behaviors here later
        
        this.savedPatterns = []; // Patterns loaded from JSON
        this.workingPatterns = []; // Temporary working memory
        this.selectedPattern = null;
        
        // Initialize UI
        this.initUI();
        this.initEventListeners();
        
        // Load saved patterns
        this.loadSavedPatterns();
        
        // Load assets
        this.loadAssets().then(() => {
            this.initMovementControls();
            this.render();
            this.gameLoop();
        });
    }

    initMovementControls() {
        const moveSpeed = 1;
        const keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp': keys.up = true; break;
                case 'ArrowDown': keys.down = true; break;
                case 'ArrowLeft': keys.left = true; break;
                case 'ArrowRight': keys.right = true; break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'ArrowUp': keys.up = false; break;
                case 'ArrowDown': keys.down = false; break;
                case 'ArrowLeft': keys.left = false; break;
                case 'ArrowRight': keys.right = false; break;
            }
        });

        // Add to gameLoop
        const originalGameLoop = this.gameLoop.bind(this);
        this.gameLoop = () => {
            // Handle movement
            if (keys.up) this.characterPos.y -= moveSpeed;
            if (keys.down) this.characterPos.y += moveSpeed;
            if (keys.left) this.characterPos.x -= moveSpeed;
            if (keys.right) this.characterPos.x += moveSpeed;
            
            originalGameLoop();
        };
    }

    async loadBehaviorOptions() {
        // Bullet behaviors
        const bulletBehaviorSelect = document.getElementById('bulletBehavior');
        bulletBehaviorSelect.innerHTML = '';
        Object.keys(BulletBehaviors).forEach(behavior => {
            const option = document.createElement('option');
            option.value = behavior;
            option.textContent = behavior;
            bulletBehaviorSelect.appendChild(option);
        });

        // Set defaults
        bulletBehaviorSelect.value = 'linear';
    }

    async loadSavedPatterns() {
        try {
            const response = await fetch('data/patterns.json');
            if (!response.ok) throw new Error("Failed to load patterns");
            const data = await response.json();
            this.savedPatterns = data.patterns || [];
            this.workingPatterns = [...this.savedPatterns]; // Copy to working memory
            this.updatePatternList();
        } catch (error) {
            console.error("Error loading patterns:", error);
            this.savedPatterns = [];
            this.workingPatterns = [];
        }
    }
    
    async loadAssets() {
        window.assetLoader = new AssetLoader();
        await assetLoader.loadImage('hitbox', 'assets/graphics/cursors/hitbox.png');
        await assetLoader.loadImage('grazeRing', 'assets/graphics/cursors/grazeRing.png');
        
        for (let color of this.bulletColors) {
            for (let type of this.bulletTypes) {
                await assetLoader.loadImage(`${color}${type}`, `assets/graphics/bullets/danmaku/${color}/${type}.png`);
            }
        }
        await assetLoader.loadImage('ErrorBullet', 'assets/graphics/bullets/ErrorBullet.png');
        await this.loadBehaviorOptions();
    }
    
    initUI() {
        // Clear dropdowns before populating
        document.getElementById('bulletColor').innerHTML = '';
        document.getElementById('bulletType').innerHTML = '';
        
        // Initialize bullet type selector
        const colorSelect = document.getElementById('bulletColor');
        const typeSelect = document.getElementById('bulletType');
        
        this.bulletColors.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            document.getElementById('bulletColor').appendChild(option);
        });
        
        this.bulletTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            document.getElementById('bulletType').appendChild(option);
        });
        
        // Initialize UI for first behavior
        this.updatePatternParamsUI();
    }
    
    initEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            // Adjust mouse coordinates for the translation
            const x = e.clientX - rect.left - 200;
            const y = e.clientY - rect.top - 200;
            
            if (x >= this.characterPos.x - this.characterPos.size*2 && 
                x <= this.characterPos.x + this.characterPos.size*2 &&
                y >= this.characterPos.y - this.characterPos.size*2 && 
                y <= this.characterPos.y + this.characterPos.size*2) {
                this.dragging = true;
            }
            else if (x >= this.patternOrigin.x - this.patternOrigin.size/2 && 
                     x <= this.patternOrigin.x + this.patternOrigin.size/2 &&
                     y >= this.patternOrigin.y - this.patternOrigin.size/2 && 
                     y <= this.patternOrigin.y + this.patternOrigin.size/2) {
                this.patternOrigin.dragging = true;
            }
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            // Adjust mouse coordinates for the translation
            const x = e.clientX - rect.left - 200;
            const y = e.clientY - rect.top - 200;
            
            if (this.dragging) {
                this.characterPos.x = x;
                this.characterPos.y = y;
            }
            else if (this.patternOrigin.dragging) {
                this.patternOrigin.x = x;
                this.patternOrigin.y = y;
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.dragging = false;
            this.patternOrigin.dragging = false;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.dragging = false;
            this.patternOrigin.dragging = false;
        });
        
        document.getElementById('newPattern').addEventListener('click', () => this.createNewPattern());
        document.getElementById('renamePattern').addEventListener('click', () => this.renamePattern());
        document.getElementById('testPattern').addEventListener('click', () => this.testPattern());
        document.getElementById('savePattern').addEventListener('click', () => this.saveToWorkingMemory());
        document.getElementById('loadPattern').addEventListener('click', () => this.loadSelectedPattern());
        document.getElementById('deletePattern').addEventListener('click', () => this.deleteSelectedPattern());
        document.getElementById('saveList').addEventListener('click', () => this.savePatternList());
    }
    
    updatePatternParamsUI() {
        const paramsContainer = document.getElementById('patternParams');
        
        const html = `
            <div class="form-group">
                <label for="bulletsPerShot">Bullets Per Shot:</label>
                <input type="number" id="bulletsPerShot" value="1" min="1">
            </div>
            <div class="form-group">
                <label for="shotsCount">Number of Shots:</label>
                <input type="number" id="shotsCount" value="1" min="1">
            </div>
            <div class="form-group">
                <label for="bulletSpread">Spread (degrees):</label>
                <input type="number" id="bulletSpread" value="0" min="0" max="360" step="1">
            </div>
            <div class="form-group">
                <label for="bulletAngle">Angle (degrees or 'aimed'):</label>
                <input type="text" id="bulletAngle" value="270">
            </div>
            <div class="form-group">
                <label for="bulletSpeed">Bullet Speed:</label>
                <input type="number" id="bulletSpeed" value="2" step="0.1">
            </div>
            <div class="form-group">
                <label for="speedIncrement">Speed Increment (per shot):</label>
                <input type="number" id="speedIncrement" value="0" step="0.01">
            </div>
            <div class="form-group">
                <label for="shotDelay">Delay Between Shots (frames):</label>
                <input type="number" id="shotDelay" value="0" min="0">
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="repeatPattern"> Repeat Entire Pattern
                </label>
            </div>
            <div class="form-group" id="repeatDelayGroup" style="display:none">
                <label for="repeatDelay">Repeat Delay (frames):</label>
                <input type="number" id="repeatDelay" value="60" min="0">
            </div>
            <div class="form-group" id="maxRepeatsGroup" style="display:none">
                <label for="maxRepeats">Max Repeats (0=infinite):</label>
                <input type="number" id="maxRepeats" value="0" min="0">
            </div>
        `;

        paramsContainer.innerHTML = html;

        const repeatCheckbox = document.getElementById('repeatPattern');
        if (repeatCheckbox) {
            repeatCheckbox.addEventListener('change', (e) => {
                document.getElementById('repeatDelayGroup').style.display = 
                    e.target.checked ? 'block' : 'none';
                document.getElementById('maxRepeatsGroup').style.display = 
                    e.target.checked ? 'block' : 'none';
            });
        }
    }
    
    testPattern() {
        const config = this.getCurrentConfig();
        
        // Pass a function that returns current player position
        const targetGetter = () => ({
            x: this.characterPos.x,
            y: this.characterPos.y
        });
        
        // Clear existing bullets
        this.enemyBulletManager.bullets = [];
        this.enemyBulletManager.pendingBullets = [];
        
        // Generate all bullets with proper delays
        const bullets = PatternProcessor.generatePattern(
            this.patternOrigin.x,
            this.patternOrigin.y,
            config,
            targetGetter // Pass the position getter function
        );
        
        // Add all bullets to manager
        bullets.forEach(b => this.enemyBulletManager.addBullet(b));
    }

    setValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.value = value;
        } else {
            console.warn(`Element with ID ${elementId} not found`);
        }
    }

    createNewPattern() {
        const patternName = prompt("Enter name for new pattern:");
        if (!patternName) return;
        
        // Start with default config
        const defaultConfig = this.getCurrentConfig();
        
        this.workingPatterns.push({
            name: patternName,
            ...defaultConfig
        });
        
        this.selectedPattern = this.workingPatterns.length - 1;
        this.updatePatternList();
    }

    renamePattern() {
        if (this.selectedPattern === null) {
            alert("Please select a pattern first");
            return;
        }
        
        const newName = prompt("Enter new name:", this.workingPatterns[this.selectedPattern].name);
        if (!newName) return;
        
        this.workingPatterns[this.selectedPattern].name = newName;
        this.updatePatternList();
    }

    saveToWorkingMemory() {
        if (this.selectedPattern === null) {
            alert("Please select a pattern first");
            return;
        }
        
        // Create clean copy of config without any extra properties
        const config = this.getCurrentConfig();
        this.workingPatterns[this.selectedPattern] = {
            name: this.workingPatterns[this.selectedPattern].name, // Preserve name
            ...config // Add all current parameters
        };
        
        alert("Pattern saved to working memory");
    }
    
    savePatternList() {
        // Create clean array of patterns with only the necessary data
        const patternsToSave = this.workingPatterns.map(pattern => {
            return {
                name: pattern.name,
                ...this.getCurrentConfig() // Ensures consistent structure
            };
        });
        
        this.downloadPatterns({
            patterns: patternsToSave
        });
        this.savedPatterns = patternsToSave;
    }

    loadSelectedPattern() {
        if (this.selectedPattern === null) {
            alert("Please select a pattern first");
            return;
        }
        this.loadPattern(this.workingPatterns[this.selectedPattern]);
    }

    loadPattern(pattern) {
        if (!pattern) {
            console.error("No pattern provided to load");
            return;
        }
    
        // First update the UI to ensure all elements exist
        this.updatePatternParamsUI();
    
        // Set all parameters dynamically
        for (const [key, value] of Object.entries(pattern)) {
            const element = document.getElementById(key);
            if (element) {
                try {
                    if (element.type === 'checkbox') {
                        element.checked = !!value;
                    } else if (element.type === 'number') {
                        element.value = parseFloat(value) || 0;
                    } else {
                        element.value = value;
                    }
                } catch (error) {
                    console.warn(`Could not set value for ${key}:`, error);
                }
            } else {
                console.debug(`No element found for parameter: ${key}`);
            }
        }
    
        // Special handling for repeat to show/hide groups
        const repeatCheckbox = document.getElementById('repeatPattern');
        if (repeatCheckbox) {
            // Force update in case repeat was set before the UI updated
            const shouldRepeat = !!pattern.repeat;
            repeatCheckbox.checked = shouldRepeat;
            document.getElementById('repeatDelayGroup').style.display = 
                shouldRepeat ? 'block' : 'none';
            document.getElementById('maxRepeatsGroup').style.display = 
                shouldRepeat ? 'block' : 'none';
            
            // Ensure repeat delay and max repeats are set if they exist
            if (shouldRepeat) {
                if (pattern.repeatDelay !== undefined) {
                    this.setValue('repeatDelay', pattern.repeatDelay);
                }
                if (pattern.maxRepeats !== undefined) {
                    this.setValue('maxRepeats', pattern.maxRepeats);
                }
            }
        }
    
        // Debug output to verify loading
        console.log('Loaded pattern:', pattern);
    }

    deleteSelectedPattern() {
        if (this.selectedPattern === null) {
            alert("Please select a pattern first");
            return;
        }
        
        if (confirm(`Delete "${this.workingPatterns[this.selectedPattern].name}"?`)) {
            this.workingPatterns.splice(this.selectedPattern, 1);
            this.selectedPattern = null;
            this.updatePatternList();
        }
    }

    savePatternList() {
        // Create a deep copy of working patterns
        const patternsToSave = JSON.parse(JSON.stringify(this.workingPatterns));
        this.downloadPatterns({
            patterns: patternsToSave
        });
        // Update saved patterns reference
        this.savedPatterns = patternsToSave;
    }

    downloadPatterns(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'patterns.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    updatePatternList() {
        const list = document.getElementById('savedPatterns');
        list.innerHTML = '';
        
        this.workingPatterns.forEach((pattern, index) => {
            const li = document.createElement('li');
            li.textContent = pattern.name;
            li.classList.add('pattern-item');
            if (this.selectedPattern === index) {
                li.classList.add('selected');
            }
            
            li.addEventListener('click', () => {
                // Just select, don't load
                this.selectedPattern = index;
                this.updatePatternList();
            });
            
            list.appendChild(li);
        });
    }

    getCurrentConfig() {
        // Core parameters that should always be saved
        const config = {
            bulletColor: document.getElementById('bulletColor').value,
            bulletType: document.getElementById('bulletType').value,
            bulletBehavior: document.getElementById('bulletBehavior').value,
            bulletsPerShot: parseInt(document.getElementById('bulletsPerShot').value),
            shotsCount: parseInt(document.getElementById('shotsCount').value),
            spread: parseFloat(document.getElementById('bulletSpread').value),
            angle: document.getElementById('bulletAngle').value,
            speed: parseFloat(document.getElementById('bulletSpeed').value),
            speedIncrement: parseFloat(document.getElementById('speedIncrement').value),
            shotDelay: parseInt(document.getElementById('shotDelay').value),
            bulletBehaviorParams: {}
        };
    
        // Optional parameters (only save if they exist and differ from defaults)
        const repeatCheckbox = document.getElementById('repeatPattern');
        if (repeatCheckbox?.checked) {
            config.repeat = true;
            config.repeatDelay = parseInt(document.getElementById('repeatDelay').value) || 60;
            config.maxRepeats = parseInt(document.getElementById('maxRepeats').value) || 0;
        }
    
        // Dynamically gather all numeric/boolean inputs from patternParams
        const paramInputs = document.getElementById('patternParams').querySelectorAll('input, select');
        paramInputs.forEach(input => {
            if (!(input.id in config)) { // Only add if not already in config
                if (input.type === 'checkbox') {
                    config[input.id] = input.checked;
                } else if (input.type === 'number') {
                    const numValue = parseFloat(input.value);
                    if (!isNaN(numValue)) {
                        config[input.id] = numValue;
                    }
                } else {
                    config[input.id] = input.value;
                }
            }
        });
    
        return config;
    }
    
    render() {
        // Clear the entire canvas area
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        
        // Draw off-screen area (darker)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(-200, -200, this.canvas.width + 400, this.canvas.height + 400);
        
        // Draw playable area (lighter)
        this.ctx.fillStyle = 'rgba(50, 50, 50, 0.7)';
        this.ctx.fillRect(0, 0, 574, 670);
        
        // Draw character (8x8 hitbox)
        const charImage = assetLoader.getImage('hitbox');
        if (charImage) {
            this.ctx.drawImage(
                charImage,
                this.characterPos.x - this.characterPos.size/2,
                this.characterPos.y - this.characterPos.size/2,
                this.characterPos.size,
                this.characterPos.size
            );
        }
        const grazeRing = assetLoader.getImage('grazeRing');
        if (grazeRing) {
            this.ctx.save();
            this.ctx.globalAlpha = this.ctx.globalAlpha * 0.5; // Adjust alpha for graze ring
            this.ctx.translate(this.characterPos.x, this.characterPos.y);
            this.ctx.rotate(this.grazeRingRotation);
            this.ctx.drawImage(
                grazeRing,
                -32,
                -32,
                64,
                64
            );
            this.ctx.restore();
        }
        
        // Draw pattern origin (draggable point)
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
        this.ctx.beginPath();
        this.ctx.arc(
            this.patternOrigin.x,
            this.patternOrigin.y,
            this.patternOrigin.size/2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // Draw bullets (handled by enemyBulletManager)
        this.enemyBulletManager.render(this.ctx);
    }
    
    gameLoop() {
        const now = Date.now();
        const deltaTime = now - this.lastFrameTime;
        const frameInterval = 1000 / 60; // 60fps
    
        if (deltaTime >= frameInterval) {
            // Update bullets
            this.enemyBulletManager.update();
            
            // Render
            this.render();
            
            this.lastFrameTime = now - (deltaTime % frameInterval);
            this.grazeRingRotation += Math.PI / 120; // Rotate graze ring
        }
    
        requestAnimationFrame(() => this.gameLoop());
    }
}

window.addEventListener('load', () => {
    window.patternEditor = new PatternEditor();
});