const StageProgression1Data = {
    enemyPhase1: [
        enemyFairy = [ // enemy type
            colour = 'red', //will be different variants, only cosmetic
            bulletType = 'orb', // what kind of bullet
            bulletBehaviour = 'aimedBullet', //bullet behaviour, this case, every time they shoot, its at the players coordinates
            health = 100, // how much damage it can survive
            scoreValue = 2500, //score granted on kill
            dropOnKill = [
                powerItem = 0.5, //chance from 0-1 to drop a power item
                pointItem = 0.8 //80% chance
            ],
            
            spawnX = 50,
            spawnY = -50, //intentionally offscreen so that they glide in from out of frame
            spawnType ='congaLine', // all of the enemies will follow the first one
            amount = 5, // how many will spawn
            spawnDelay = 300, // delay between each spawning
            goToLocations = [
                1 = [
                    x=100,
                    y=100,
                    speed=4,
                    accelerationTime=0, // instantly at max speed
                    deccelerationTime=300, // will decellerate for 300ms before it reachess it intended location
                    onArrival= [
                        shoot= [
                            amountBullets=5, // enemies will have their own file to themselves that will define what this means in combo with bullet behaviours. Here, spawn 5 in paralel
                            amountTimes=3, // spawn them in 3 waves
                            waveDelay=300, // with a delay of 300ms between the waves
                            bulletSpeed=6
                        ],
                        nextLocation //goTo location 2
                    ]
                ],
                2 = [
                    x=400,
                    y=100,
                    speed=6,
                    accelerationTime=300, //smoothly accelerate over 300ms up to speed 6
                    deccelerationTime=300,
                    onArrival=[
                        wait=3000,
                        nextLocation
                    ]
                ],
                3 = [
                    x=400,
                    y=-50, //glides out of screen
                    speed = 10,
                    accelerationTime=150,
                    deccelerationTime=0,
                    onArrival=[
                        unrender // fairy will stop existing
                    ]
                ]
            ],
        ],
        enemySpinner = [
            //stuff here, these spawn in paralel with the ones before at the same time as they are on the same phase
        ]
    ],
    nextPhase,
    enemyPhase2: [
        //stuff
    ],
    midBoss: [
        bossName= 'Cirno',
        health= 1500,
        behaviour= [/* Describe everything it will do*/],
    ]
};