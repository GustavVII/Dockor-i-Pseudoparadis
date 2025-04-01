const stage1Phase1 = {
    enemyPhase1: [
        {
            enemyType: 'fairy',
            colour: 'red',
            bulletType: 'orb',
            bulletBehaviour: 'aimedBullet',
            health: 100,
            scoreValue: 2500,
            dropOnKill: {
                powerItem: 0.5,
                pointItem: 0.8
            },
            spawnX: 50,
            spawnY: -50,
            spawnType: 'congaLine',
            amount: 5,
            spawnDelay: 300,
            goToLocations: [
                {
                    x: 100,
                    y: 100,
                    speed: 4,
                    accelerationTime: 0,
                    deccelerationTime: 300,
                    onArrival: {
                        shoot: {
                            amountBullets: 5,
                            amountTimes: 3,
                            waveDelay: 300,
                            bulletSpeed: 6
                        },
                        nextLocation: true
                    }
                },
                {
                    x: 400,
                    y: 100,
                    speed: 6,
                    accelerationTime: 300,
                    deccelerationTime: 300,
                    onArrival: {
                        wait: 3000,
                        nextLocation: true
                    }
                },
                {
                    x: 400,
                    y: -50,
                    speed: 10,
                    accelerationTime: 150,
                    deccelerationTime: 0,
                    onArrival: {
                        unrender: true
                    }
                }
            ]
        }
    ]
};

window.stage1Phase1 = stage1Phase1;