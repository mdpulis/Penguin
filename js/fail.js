var space;
var timer, timerText;
var text;
var quit;
var second;
var levelNumber;
class Fail extends Phaser.Scene {
    constructor(){
        super("FailScreen");
    }
    preload(){

    }
    create(){
        second = 10;
        quit = false;
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        timer = this.time.addEvent({ delay: 10000, callback: Quit});
        timerText = this.time.addEvent({ delay: 1000, callback: Count, callbackScope: this, repeat: 10});
        text = this.add.text(960, 540, "");
        if(level1 == true){
            levelNumber = 1;
        }
        else if(level2 == true){
            levelNumber = 2;
        }
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(space)){
            this.scene.start("PlayingScreen");
        }
        else if(quit == true){
            this.scene.start("MenuScreen");
        }
        text.setText("Game Over" + "\n\nPress Space to Retry Level "+ levelNumber + "\n\nYour Score: " + score + "\n\nQuit in " + second);
    }
}
function Quit(){
    quit = true;
}
function Count(){
    second--;
}