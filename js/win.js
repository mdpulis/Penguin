var space;
var winText;
var win_title;
class Win extends Phaser.Scene {
    constructor(){
        super("WinScreen");
    }
    preload(){
        this.load.image('level_0', 'assets/Level0.png');
        this.load.image('level_1', 'assets/Level1.png');
        this.load.image('level_2', 'assets/Level2.png');
        this.load.image('level_3', 'assets/Level3.png');
        this.load.image('level_4', 'assets/Level4.png');
        this.load.image('level_5', 'assets/Level5.png');
        this.load.image('level_6', 'assets/Level6.png');
        this.load.image('level_7', 'assets/Level7.png');
        this.load.image('level_8', 'assets/Level8.png');
        this.load.image('level_9', 'assets/Level9.png');
        this.load.image('GameOver_title', 'assets/GameOver.png');
    }
    create(){
        winText = this.add.bitmapText(screenWidth / 2, screenHeight / 2, 'snowtop-caps-orange-white', '0', 32);
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        win_title = this.add.image(screenWidth/2, screenHeight/2 - 300, 'level_'+ level);
        win_title.setScale(2);
        level++;

    }

    update(){
        //win_title.setTexture('background');
        winText.setText("You Completed Level " + (level - 1) + "\n\nYour Total Score is: " + score + "\n\nPress Space to Continue");
        if(Phaser.Input.Keyboard.JustDown(space)){
            this.scene.start("PlayingScreen");
        }
    }
}