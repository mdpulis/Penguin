var space;
var winText;
class Win extends Phaser.Scene {
    constructor(){
        super("WinScreen");
    }
    preload(){
    }
    create(){
        winText = this.add.bitmapText(screenWidth / 2, screenHeight / 2, 'frosty', '0', 32);
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        level++;
    }

    update(){
        winText.setText("You Completed Level " + (level - 1) + "\n\nYour Total Score is: " + score + "\n\nPress Space to Continue");
        if(Phaser.Input.Keyboard.JustDown(space)){
            this.scene.start("PlayingScreen");
        }
    }
}