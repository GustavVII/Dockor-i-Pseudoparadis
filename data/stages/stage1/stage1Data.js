const stage1Data = {
    id: "stage1",
    levelName: "The Forgotten Path ~ When People Truly Vanish",
    music: "02",
    bossMusic: "03",
    backgrounds: [
        {
            id: "bg1",
            image: "assets/graphics/backgrounds/stage1/bg1.png",
            scrollSpeedX: 3,
            scrollSpeedY: 20,
            parallax: 0.8
        },
        {
            id: "bg2",
            image: "assets/graphics/backgrounds/stage1/bg2.png",
            scrollSpeedX: 5,
            scrollSpeedY: 25,
            parallax: 0.6
        }
    ],
    phases: [
        {
            id: "phase1",
            background: "bg1",
            enemies: "stage1_phase1"
        },
        {
            id: "phase2",
            background: "bg2",
            enemies: "stage1_phase2"
        },
        {
            id: "midboss",
            background: "bg2",
            enemies: "stage1_midboss"
        }
    ],
    defaultEnemyBehavior: {
        bulletSpeed: 6,
        bulletDamage: 1,
        health: 100,
        scoreValue: 2500,
        dropRates: {
            power: 0.5,
            point: 0.8
        }
    }
};

window.stage1Data = stage1Data;