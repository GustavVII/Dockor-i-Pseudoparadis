const stage1Dialogue = {
    stage: {
        stageName: "The Forgottens path ~ When People Truly Vanish"
        // Other stuff potentially
    },
    character: {
        Reimu: [ // Loads different dialogue depending on character; different people with different personalities generally do not say the same thing
            1 = [
                speaker = character.Reimu, // Character name will match name of how the portrait key is loaded
                portraitMood = 'default',
                dialogue = "English test speak speak lorem ipsum something"
            ],
            2 = [
                speaker = character.Reimu,
                portraitMood = 'delighted', //Will have different portraits for different moods
                dialogue = "Happier Test test speak speak lorem ipsum something"
            ],
            3 = [
                speaker = boss.Satsuki, // 'boss' and 'character' will differenciate the sides from each other. Left side is where player portrait is show, right is where boss portrait is shown
                bossCanvasIcon = flyIn [ // the boss in game usually isnt on screen when dialogue starts (unless specifically defined in the stageProgression that the boss never flies out)
                    from = [x= -100, y= 0],
                    to = [x= canvas.width/2, y= 60]
                ],
                portraitMood = 'mad',
                dialogue = "Mad Test test speak speak lorem ipsum something"
            ],
            4 = [
                speaker = boss.Satsuki,
                portraitMood = 'angry',
                showBossTitle, // will show their name, title and stuff
                dialogue = "Angry Test test speak speak lorem ipsum something"
            ],
            5 = [
                speaker = character.Reimu,
                portraitMood = 'annoyed',
                dialogue = "Annoyed Test test speak speak lorem ipsum something"
            ]
        ],
        Marisa: [
            // Marisa-specific dialogue
        ]
    },
};