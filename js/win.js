var space;
var levelNumber;
class Win extends Phaser.Scene {
    constructor(){
        super("WinScreen");
    }
    preload(){
    }
    create(){
        if(level1 == true){ //completed 1st level
            level1 = false;
            level2 = true;
            levelNumber = 1;
        }
        else if(level2 == true){ //completed 2nd level
            level1 = false;
            level2 = true;
            levelNumber = 2;
        }
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.text(960, 540, "You Completed Level " + levelNumber + "\n\nYour Total Score is: " + score + "\n\nPress Space to Continue")
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(space)){
            this.scene.start("PlayingScreen");
        }
    }
}