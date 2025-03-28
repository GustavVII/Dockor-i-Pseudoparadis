const stage1Data = {
    levelName: "The Forgottens path ~ When People Truly Vanish",
    music: "02", //Track key (ID)
    bossMusic: "03",
    background: "", //Future keyname to background, or maybe not necessary, make the future stage handler just load an image with key ${id}bg that has the image
    bgScrollSpeedX: 3, // slight right scroll
    bgScrollSpeedY: 20, // pixels per second that it scrolls
    // background image and/or its speed may also be set or changed by stageProgression,
    // so that if the begining is a loop looking like its flying over a forest,
    // it can later at the end be changed to reach for examlpe a house in the middle
    // (that is, backgorund will be changed out for the new one)
};

window.stage1Data = stage1Data;