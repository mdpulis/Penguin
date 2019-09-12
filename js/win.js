var space;
class Win extends Phaser.Scene {
    constructor(){
        super("WinScreen");
    }
    preload(){
    }
    create(){
        if(level == 1){ //completed 1st level
            level = 2;
        }
        else if(level == 2){ //completed 2nd level
            level = 3;
        }
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.text(960, 540, "You Completed Level " + level + "\n\nYour Total Score is: " + score + "\n\nPress Space to Continue")
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(space)){
            this.scene.start("PlayingScreen");
        }
    }
}