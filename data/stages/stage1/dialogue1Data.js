const dialogue1Data = {
    characterSpecific: {
        Reimu: [
            {
                speaker: "character.Reimu",
                portraitMood: "default",
                textKey: "Reimu.1" // Handler should know what langage it is in already and load from there
            },
            {
                speaker: "character.Reimu",
                portraitMood: "delighted",
                textKey: "Reimu.2" // Handler should also know what stage it is and know which const array to pull from
            },
            {
                speaker: "boss.Satsuki",
                bossCanvasIcon: {
                    animation: "flyIn",
                    from: { x: -100, y: 0 },
                    to: { x: "50%", y: 60 },
                    duration: 1000
                },
                portraitMood: "mad",
                textKey: "Reumu.3", // It is called reimu still as its from her part of the file we are loading from
                showBossTitle: true
            }
        ],
        Marisa: [
            // Marisa-specific dialogue
        ]
    },
    Marisa: [],
    Murasa: [],
    Nue: [],
}