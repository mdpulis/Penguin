var space;
var timer, timerText;
var failText;
var quit;
var second;
var gameOverAnim, gameOverTitle;
class Fail extends Phaser.Scene {
    constructor(){
        super("FailScreen");
    }
    preload(){
        this.load.spritesheet('GameOver','assets/anim/GameOver_Animation.png', {frameWidth: 270, frameHeight: 346});
        this.load.image('GameOver_title', 'assets/GameOver.png');
    }
    create(){
        //backgroundImage = this.add.image(960, 540, 'background');
        second = 10;
        quit = false;
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        timer = this.time.addEvent({ delay: 10000, callback: Quit});
        timerText = this.time.addEvent({ delay: 1000, callback: Count, callbackScope: this, repeat: 10});
        failText = this.add.bitmapText(screenWidth / 2, screenHeight / 2, 'snowtop-caps-orange-white', '0', 32);
        gameOverAnim = this.add.image('testing');
        this.anims.create({
            key: 'GameOver_anim',
            frames: this.anims.generateFrameNumbers('GameOver',{ start: 0, end: 3}),
            frameRate: 3,
            repeat: -1
        });
        gameOverTitle = this.add.image(screenWidth/2, screenHeight/2 - 300, 'GameOver_title');
        gameOverTitle.setScale(0.7)
        gameOverAnim = this.add.sprite(screenWidth/2 - 400, screenHeight/2 + 100, 'GameOver');
        gameOverAnim.anims.play('GameOver_anim', true);

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
        //gameOverAnim.anims.play('GameOver_anim', true);
    }
}
function Quit(){
    quit = true;
}
function Count(){
    second--;
}