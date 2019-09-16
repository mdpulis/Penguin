
var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        Menu,
        Playing,
        Win,
        Fail
    ]
};

var game = new Phaser.Game(config);

