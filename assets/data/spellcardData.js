const spellcardData =
{
    "spellcards": [
        {
            "name": "Card Invokation: Threeshot",
            "behavior": "shootCards",
            "soundEffect": "assets/sfx/spellcard.wav",
            "shakeIntensity": 10,
            "shakeDuration": 1600,
            "shakeFadeOutDuration": 400,
            "slowdownFactor": 0.6,
            "waveCount": 3,
            "waveDelay": 300,
            "spawnPositions": [
                { "xOffset": -20, "yOffset": -10 },
                { "xOffset": 0, "yOffset": -10 },
                { "xOffset": 20, "yOffset": -10 }
            ]
        },
        {
            "name": "Love Sign: Master Spark",
            "behavior": "shootLaser",
            "soundEffect": "assets/sfx/laser.wav",
            "shakeIntensity": 60,
            "shakeDuration": 2000,
            "shakeFadeOutDuration": 600,
            "slowdownFactor": 0.2,
            "laser": {
                "image":      "assets/graphics/lasers/laser2.png",
                "startImage": "assets/graphics/lasers/laser1.png",
                "endImage":   "assets/graphics/lasers/laser3.png",
                "width": 12,
                "height": 32,
                "speed": 32,
                "duration": 2000,
                "count": 3,
                "laserLength": 225,
                "spawnPositions": [
                    { "xOffset": -30, "yOffset": 0 },
                    { "xOffset": -15, "yOffset": -24 },
                    { "xOffset": 0, "yOffset": -40 },
                    { "xOffset": 15, "yOffset": -24 },
                    { "xOffset": 30, "yOffset": 0 }
                ]
            }
        },
        {
            "name": "Love Storm: Starlight Typhoon",
            "behavior": "shootLaser",
            "soundEffect": "assets/sfx/laser.wav",
            "shakeIntensity": 60,
            "shakeDuration": 1500,
            "shakeFadeOutDuration": 200,
            "slowdownFactor": 0.4,
            "laser": {
                "image":      "assets/graphics/lasers/laser2.png",
                "startImage": "assets/graphics/lasers/laser1.png",
                "endImage":   "assets/graphics/lasers/laser3.png",
                "width": 12,
                "height": 32,
                "speed": 32,
                "duration": 2000,
                "count": 5,
                "laserLength": 225,
                "spawnPositions": [
                    { "xOffset": -25, "yOffset": -10 },
                    { "xOffset": 0, "yOffset": -40 },
                    { "xOffset": 25, "yOffset": -10 }
                ]
            }
        }
    ]
}