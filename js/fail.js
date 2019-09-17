var space;
var timer, timerText;
var failText;
var quit;
var second;
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
        failText = this.add.bitmapText(screenWidth / 2, screenHeight / 2, 'snowtop-caps-orange-white', '0', 32);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(space)){
            level = 1;
            score = 0;
            this.scene.start("PlayingScreen");
        }
        else if(quit == true){
            this.scene.start("MenuScreen");
        }
        failText.setText("Game Over" + "\n\nPress Space to Retry" + "\n\nYour Total Score is: " + score + "\n\nQuit in " + second);
    }
}
function Quit(){
    quit = true;
}
function Count(){
    second--;
}