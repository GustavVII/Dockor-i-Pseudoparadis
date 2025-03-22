const shotTypesData = {
    "shotTypes": [
        {
            "name": "Persuation Card",
            "behavior": "shootCards",
            "spawnPositions": {
                "powerLevel0": [
                    { "xOffset": 0, "yOffset": -20 }
                ],
                "powerLevel1": [
                    { "xOffset": -16, "yOffset": -20 },
                    { "xOffset": 16, "yOffset": -20 }
                ],
                "powerLevel2": [
                    { "xOffset": -30, "yOffset": -10 },
                    { "xOffset": 0, "yOffset": -20 },
                    { "xOffset": 30, "yOffset": -10 }
                ],
                "powerLevel3": [
                    { "xOffset": -40, "yOffset": 0 },
                    { "xOffset": -16, "yOffset": -20 },
                    { "xOffset": 16, "yOffset": -20 },
                    { "xOffset": 40, "yOffset": 0 }
                ],
                "focus": {
                    "powerLevel0": [
                        { "xOffset": 0, "yOffset": -10 }
                    ],
                    "powerLevel1": [
                        { "xOffset": -8, "yOffset": -10 },
                        { "xOffset": 8, "yOffset": -10 }
                    ],
                    "powerLevel2": [
                        { "xOffset": -12, "yOffset": -5 },
                        { "xOffset": 0, "yOffset": -10 },
                        { "xOffset": 12, "yOffset": -5 }
                    ],
                    "powerLevel3": [
                        { "xOffset": -20, "yOffset": 0 },
                        { "xOffset": -8, "yOffset": -10 },
                        { "xOffset": 8, "yOffset": -10 },
                        { "xOffset": 20, "yOffset": 0 }
                    ]
                }
            }
        },
        {
            "name": "Star Shower",
            "behavior": "shootStars",
            "spawnPositions": {
                "powerLevel0": [
                    { "xOffset": 0, "yOffset": -20, "angle": 0, "colors": [1] }
                ],
                "powerLevel1": [
                    { "xOffset": -16, "yOffset": -20, "angle": -2, "colors": [2, 3, 4] },
                    { "xOffset": 16, "yOffset": -20, "angle": 2, "colors": [2, 3, 4] }
                ],
                "powerLevel2": [
                    { "xOffset": -30, "yOffset": -10, "angle": -5, "colors": [4, 6, 8] },
                    { "xOffset": 0, "yOffset": -20, "angle": 0, "colors": [1, 3, 5, 7] },
                    { "xOffset": 30, "yOffset": -10, "angle": 5, "colors": [4, 6, 8] }
                ],
                "powerLevel3": [
                    { "xOffset": -40, "yOffset": 0, "angle": -6, "colors": [5, 6, 7, 8, 1, 2, 3, 4] },
                    { "xOffset": -16, "yOffset": -20, "angle": -2, "colors": [1, 2, 3, 4, 5, 6, 7, 8] },
                    { "xOffset": 16, "yOffset": -20, "angle": 2, "colors": [1, 2, 3, 4, 5, 6, 7, 8] },
                    { "xOffset": 40, "yOffset": 0, "angle": 6, "colors": [5, 6, 7, 8, 1, 2, 3, 4] }
                ],
                "focus": {
                    "powerLevel0": [
                        { "xOffset": 0, "yOffset": -10, "angle": 0, "colors": [3] }
                    ],
                    "powerLevel1": [
                        { "xOffset": -8, "yOffset": -10, "angle": -1, "colors": [2, 3, 4] },
                        { "xOffset": 8, "yOffset": -10, "angle": 1, "colors": [2, 3, 4] }
                    ],
                    "powerLevel2": [
                        { "xOffset": -12, "yOffset": -5, "angle": -2, "colors": [4, 6, 8] },
                        { "xOffset": 0, "yOffset": -10, "angle": 0, "colors": [1, 3, 5, 7] },
                        { "xOffset": 12, "yOffset": -5, "angle": 2, "colors": [4, 6, 8] }
                    ],
                    "powerLevel3": [
                        { "xOffset": -20, "yOffset": 0, "angle": -3, "colors": [5, 6, 7, 8, 1, 2, 3, 4] },
                        { "xOffset": -8, "yOffset": -10, "angle": -1, "colors": [1, 2, 3, 4, 5, 6, 7, 8] },
                        { "xOffset": 8, "yOffset": -10, "angle": 1, "colors": [1, 2, 3, 4, 5, 6, 7, 8] },
                        { "xOffset": 20, "yOffset": 0, "angle": 3, "colors": [5, 6, 7, 8, 1, 2, 3, 4] }
                    ]
                }
            }
        }
    ]
};