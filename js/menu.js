var space;
class Menu extends Phaser.Scene {
    constructor(){
        super("MenuScreen");
    }
    preload(){
    }
    create(){
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.text(960, 540, "Menu" + "\n\nPress Space to Begin")
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(space)){
            this.scene.start("PlayingScreen");
        }
    }
}

