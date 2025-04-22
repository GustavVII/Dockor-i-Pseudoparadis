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
            await assetLoader.loadImage('cardBack', 'assets/graphics/bullets/cards/Back.png');
            const suits = ['H', 'S', 'D', 'C'];
            for (const suit of suits) {
                for (let i = 1; i <= 13; i++) {
                    await assetLoader.loadImage(`card${suit}${i}`, `assets/graphics/bullets/cards/${suit}${i}.png`);
                    console.info(`card${suit}${i} loaded`)
                }
            }
    
            console.log("All card images loaded successfully!");
        } catch (error) {
            console.error("Failed to load card images:", error);
        }

        // Karaktärsbilder
        try {
            const characters = ['Reimu', 'Marisa', 'Murasa', 'Nue'];
            // Ikon
            for (const character of characters) {
                if(character === ('Murasa')) break
                for (let i = 1; i <= 10; i++) {
                    await assetLoader.loadImage(
                        `character${character}Cursor${padNumber(i,2)}`,
                        `assets/graphics/cursors/${character}/cursor${padNumber(i,2)}.png`
                    );
                    console.info(`cursor ${i} for ${character} loaded`)
                }
                console.info(`cursors for ${character} loaded`)
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

        await assetLoader.loadImage('hitbox', 'assets/graphics/cursors/hitbox.png');
        await assetLoader.loadImage('grazeRing', 'assets/graphics/cursors/grazeRing.png');
        await assetLoader.loadImage('spawner01', 'assets/graphics/spawners/spawn01.png');
        await assetLoader.loadImage('spawner02', 'assets/graphics/spawners/spawn02.png');


        // Load menu images
        await assetLoader.loadImage('bomb', 'assets/graphics/menu/bomb.png');
        await assetLoader.loadImage('health', 'assets/graphics/menu/health.png');
        await assetLoader.loadImage('rating', 'assets/graphics/menu/rating.png');

        // Enemy sprites
        await assetLoader.loadImage(`redFairy`, 'assets/graphics/cursors/Fairy/red.png')
        await assetLoader.loadImage(`greenFairy`, 'assets/graphics/cursors/Fairy/green.png')
        await assetLoader.loadImage(`blueFairy`, 'assets/graphics/cursors/Fairy/blue.png')
        await assetLoader.loadImage(`testFairy`, 'assets/graphics/cursors/Fairy/test.png')

        try {
            let colours = ['red', 'green', 'blue'];
            for (let colour of colours) {
                await assetLoader.loadImage(`${colour}Yinyang`, `assets/graphics/cursors/Yinyang/${colour}.png`)
                await assetLoader.loadImage(`${colour}AuraYinyang`, `assets/graphics/cursors/Yinyang/${colour}Aura.png`)
            }
        } catch (error) {
            console.error("Failed to load Yinyang images:", error);
        }

        await assetLoader.loadImage(`spinner`, 'assets/graphics/cursors/spinner.png')

        // Item sprites
        await assetLoader.loadImage(`1up`, 'assets/graphics/items/1up.png')
        await assetLoader.loadImage(`bomb`, 'assets/graphics/items/bomb.png')
        await assetLoader.loadImage(`fragment`, 'assets/graphics/items/fragment.png')
        await assetLoader.loadImage(`full`, 'assets/graphics/items/full.png')
        await assetLoader.loadImage(`power`, 'assets/graphics/items/power.png')
        await assetLoader.loadImage(`point`, 'assets/graphics/items/point.png')
        
        await assetLoader.loadImage(`rUFO`, 'assets/graphics/items/rUFO.png')
        await assetLoader.loadImage(`gUFO`, 'assets/graphics/items/gUFO.png')
        await assetLoader.loadImage(`bUFO`, 'assets/graphics/items/bUFO.png')

        try {
            let colours = ['Red', 'Orange', 'Yellow', 'Green', 'Cyan', 'Blue', 'Purple', 'Magenta'];
            // Ikon
            for (let colour of colours) {
                const types = ['Bullet', 'Butterfly', 'Dagger', 'Elipse', 'Falcon', 'Kunai', 'LargeSphere', 'Sphere', 'Star']
                for (const type of types) {
                    await assetLoader.loadImage(`${colour}${type}`, `assets/graphics/bullets/danmaku/${colour}/${type}.png`)
                    console.info(`${colour}${type} danmaku loaded`)
                }
                await assetLoader.loadImage('ErrorBullet', 'assets/graphics/bullets/ErrorBullet.png')
                console.info(`All ${colour} danmaku loaded`)
            }
        } catch (error) {
            console.error("Failed to load danmaku:", error);
        }
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