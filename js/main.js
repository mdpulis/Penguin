
var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,

    scene: [
        Menu,
        Playing,
        Win,
        Fail
    ]
};

var game = new Phaser.Game(config);

