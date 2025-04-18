class AssetLoader {
    constructor() {
        this.assets = {
            images: {},
            sounds: {},
        };
    }

    // Ladda in en bild och ge den ett objektnamn
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

    // Ladda in ljud (oanvänd för närvarande)
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

    // Finn objektnamnet
    getImage(key) {
        if (!this.assets.images[key]) {
            console.error(`Image with key "${key}" not found.`);
            return null;
        }
        return this.assets.images[key];
    }

    // Samma här
    getSound(key) {
        if (!this.assets.sounds[key]) {
            console.error(`Sound with key "${key}" not found.`);
            return null;
        }
        return this.assets.sounds[key];
    }
}

// Total grafikinladdning
async function loadAllAssets() {
    try {
        // Laser
        for (let i = 1; i <= 3; i++) {
            await assetLoader.loadImage(`laser${i}`, `assets/graphics/bullets/lasers/laser${i}.png`);
            console.info(`laser${i} loaded`)
        }

        // Stjärnor
        for (let i = 1; i <= 8; i++) {
            await assetLoader.loadImage(`star${i}`, `assets/graphics/bullets/stars/${i}.png`);
            console.info(`star${i} loaded`)
        }

        try {
            // Kort
            await assetLoader.loadImage('cardBack', 'assets/graphics/cards/Back.png');
            const suits = ['H', 'S', 'D', 'C'];
            for (const suit of suits) {
                for (let i = 1; i <= 13; i++) {
                    await assetLoader.loadImage(`card${suit}${i}`, `assets/graphics/cards/${suit}${i}.png`);
                    console.info(`card${suit}${i} loaded`)
                }
            }
    
            console.log("All card images loaded successfully!");
        } catch (error) {
            console.error("Failed to load card images:", error);
        }

        // Karaktärsbilder
        try {
            const characters = ['Murasa', 'Reimu', 'Marisa', 'Nue'];
            // Ikon
            for (const character of characters) {
                await assetLoader.loadImage(
                    `character${character}Cursor`,
                    `assets/graphics/cursors/${character}/cursor.png`
                );
                console.info(`cursor for ${character} loaded`)
            }
            console.log("All character cursor images loaded");
            // Porträtt
            for (const character of characters) {
                await assetLoader.loadImage(
                    `portrait${character}`,
                    `assets/graphics/portraits/${character}/portrait.png`
                );
                console.info(`portrait for ${character} loaded`)
            }
            console.log("All character portrait images loaded");
        } catch (error) {
            console.error("Failed to load character images:", error);
        }

        // Load menu images
        await assetLoader.loadImage('bomb', 'assets/graphics/menu/bomb.png');
        await assetLoader.loadImage('health', 'assets/graphics/menu/health.png');
        await assetLoader.loadImage('rating', 'assets/graphics/menu/rating.png');

        // Load spawner images
        for (let i = 1; i <= 4; i++) {
            await assetLoader.loadImage(`spawner${i}`, `assets/graphics/spawners/spawn${i}.png`);
        }

        await assetLoader.loadImage(`redFairy`, 'assets/graphics/cursors/Fairy/red.png')
        await assetLoader.loadImage(`greenFairy`, 'assets/graphics/cursors/Fairy/green.png')
        await assetLoader.loadImage(`blueFairy`, 'assets/graphics/cursors/Fairy/blue.png')
        await assetLoader.loadImage(`testFairy`, 'assets/graphics/cursors/Fairy/test.png')

        console.log("All assets loaded");

       
    try {
        // Stage 1 backgrounds
        await assetLoader.loadImage('bg1_bg', 'assets/graphics/backgrounds/stage1/bg1.png');
        
        console.log("All background images loaded successfully!");
    } catch (error) {
        console.error("Failed to load background images:", error);
    }

    } catch (error) {
        console.error("Failed to load assets:", error);
    }
}