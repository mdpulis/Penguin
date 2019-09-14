var space;
class Win extends Phaser.Scene {
    constructor(){
        super("WinScreen");
    }
    preload(){
    }
    create(){
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.text(960, 540, "You Completed Level " + level + "\n\nYour Total Score is: " + score + "\n\nPress Space to Continue");
        level++;
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(space)){
            this.scene.start("PlayingScreen");
        }
    }
}