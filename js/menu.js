var space;
var level1;
var level2;
var score;
class Menu extends Phaser.Scene {
    constructor(){
        super("MenuScreen");
    }
    preload(){
    }
    create(){
        score = 0;
        level1 = true;
        level2 = false;
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.text(960, 540, "Menu" + "\n\nPress Space to Begin")
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(space)){
            this.scene.start("PlayingScreen");
        }
    }
}
