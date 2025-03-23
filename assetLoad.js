class AssetLoader {
    constructor() {
        this.assets = {
            images: {},
            sounds: {},
        };
    }

    // Load an image and store it in the assets object
    async loadImage(key, src) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = src;
            image.onload = () => {
                this.assets.images[key] = image;
                resolve(image);
            };
            image.onerror = (error) => {
                console.error(`Failed to load image: ${src}`, error);
                reject(error);
            };
        });
    }

    // Load a sound and store it in the assets object
    async loadSound(key, src) {
        return new Promise((resolve, reject) => {
            const sound = new Audio(src);
            sound.oncanplaythrough = () => {
                this.assets.sounds[key] = sound;
                resolve(sound);
            };
            sound.onerror = (error) => {
                console.error(`Failed to load sound: ${src}`, error);
                reject(error);
            };
        });
    }

    // Get a preloaded image by key
    getImage(key) {
        if (!this.assets.images[key]) {
            console.error(`Image with key "${key}" not found.`);
            return null;
        }
        return this.assets.images[key];
    }

    // Get a preloaded sound by key
    getSound(key) {
        if (!this.assets.sounds[key]) {
            console.error(`Sound with key "${key}" not found.`);
            return null;
        }
        return this.assets.sounds[key];
    }
}

// Function to load all assets
async function loadAllAssets() {
    try {
        // Load laser images
        await assetLoader.loadImage('laser1', 'assets/graphics/bullets/lasers/laser1.png');
        await assetLoader.loadImage('laser2', 'assets/graphics/bullets/lasers/laser2.png');
        await assetLoader.loadImage('laser3', 'assets/graphics/bullets/lasers/laser3.png');

        // Load star images
        for (let i = 1; i <= 8; i++) {
            await assetLoader.loadImage(`star${i}`, `assets/graphics/bullets/stars/${i}.png`);
        }

        try {
            // Load card images
            await assetLoader.loadImage('cardBack', 'assets/graphics/cards/Back.png');
            const suits = ['H', 'S', 'D', 'C'];
            for (const suit of suits) {
                for (let i = 1; i <= 13; i++) {
                    await assetLoader.loadImage(`card${suit}${i}`, `assets/graphics/cards/${suit}${i}.png`);
                }
            }
    
            console.log("All card images loaded successfully!");
        } catch (error) {
            console.error("Failed to load card images:", error);
        }

        // Load character images
        try {
            // Load character cursor images
            const characters = ['Murasa', 'Reimu', 'Marisa', 'Nue'];
            for (const character of characters) {
                await assetLoader.loadImage(
                    `character${character}Cursor`, // Key for the cursor image
                    `assets/graphics/characters/${character}/cursor.png` // Path to the cursor image
                );
            }
    
            console.log("All character cursor images loaded successfully!");
        } catch (error) {
            console.error("Failed to load character cursor images:", error);
        }
        try {
            // Load character portrait images
            const characters = ['Murasa', 'Reimu', 'Marisa', 'Nue'];
            for (const character of characters) {
                await assetLoader.loadImage(
                    `portrait${character}`, // Key for the portrait image
                    `assets/graphics/characters/${character}/portrait.png` // Path to the portrait image
                );
            }
    
            console.log("All character portrait images loaded successfully!");
        } catch (error) {
            console.error("Failed to load character portrait images:", error);
        }

        // Load menu images
        await assetLoader.loadImage('bomb', 'assets/graphics/menu/bomb.png');
        await assetLoader.loadImage('gear', 'assets/graphics/menu/Gear.png');
        await assetLoader.loadImage('health', 'assets/graphics/menu/health.png');

        // Load spawner images
        for (let i = 1; i <= 4; i++) {
            await assetLoader.loadImage(`spawner${i}`, `assets/graphics/spawners/spawn${i}.png`);
        }

        // Load background image
        await assetLoader.loadImage('background', 'assets/graphics/background.png');

        console.log("All assets loaded successfully!");

        // Initialize spawner images in SpawnerManager after all assets are loaded
        spawnerManager.loadSpawnerImages();
    } catch (error) {
        console.error("Failed to load assets:", error);
    }
}

// Expose the loadAllAssets function to the global scope
window.loadAllAssets = loadAllAssets;