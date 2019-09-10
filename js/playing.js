var player;
var up, down, left, right, space;
var row;
var beers, drinkers, bottles, spawnDrinkers, bears, penguins, bombs, sushi;
var random;
var drinkerTimer;
var gameTimer;
var ui;
var hp, gameTime;
var emmiter; //event emmiter
var sound;
var drinkerAmount, spawnCount, bearAmount;
var position, position2;
var cursors;
var visibleDrinker;
var visibleBear;
var usingBomb; //indicate whether the player is using sushi or bomb
let lane;

var arrow_key_icon, sushi_icon, bomb_icon;

const screenWidth = 1920;
const screenHeight = 1080;
const playerXOffset = 500;

const drinkerRange = 50;

const row1Position = 100;
const row2Position = 320;
const row3Position = 540;
const row4Position = 760;

const barLength1 = 284;
const barLength2 = 568;
const barLength3 = 852;
const barLength4 = 1136;
const barLength5 = 1420;

const pushedBackMod = 4;
const pushBackXDistance = 400;
const drinkingTime = 3000;

class Playing extends Phaser.Scene{
    constructor(){
        super('PlayingScreen');
    }


//Load Assets
    preload ()
    {
        //Load images
        this.load.image('background', 'assets/Game_BG.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('beer', 'assets/Beer.png');
        this.load.image('drinker', 'assets/Customer_01.png');
        this.load.image('bottle', 'assets/Beer_empty.png');
        this.load.image('bomb','assets/bomb.jpg')
        this.load.image('bear','assets/bear.png')

        this.load.image('arrow_key_icon', 'assets/arrow_key.png')
        this.load.image('sushi_icon', 'assets/sushi_icon.png')
        this.load.image('bomb_icon', 'assets/bomb_icon.png')
        //Load animation spriteSheets
        this.load.spritesheet('boom','assets/anim/testing.png', {frameWidth: 32, frameHeight: 48});
        //Load audio
        this.load.audio('bgm','assets/audio/level1_bgm.mp3');
        this.load.audio('lose','assets/audio/tune_lose.mp3');
        this.load.audio('break','assets/audio/mug_break.mp3');
        this.load.audio('throw_mug','assets/audio/throw_mug.wav')
        this.load.audio('up','assets/audio/up.wav');
        this.load.audio('down','assets/audio/down.wav');
        this.load.audio('get_mug','assets/audio/get_mug.wav');
        this.load.audio('drinker_out','assets/audio/out_customer.wav');
        this.load.audio('drinker_in','assets/audio/popup.wav');
        this.load.audio('win','assets/audio/win.wav');
    }
//Create Objects
    create ()
    {
        this.add.image(960, 540, 'background');

        arrow_key_icon = this.add.image(screenWidth - 128 * 2, screenHeight - 128, 'arrow_key_icon');
        sushi_icon = this.add.image(screenWidth - 128, screenHeight - 128, 'sushi_icon');
        bomb_icon = this.add.image(screenWidth - 128, screenHeight - 128, 'bomb_icon');


        //var music = this.sound.add('bgm');
        //music.play();
        player = this.physics.add.image(screenWidth - playerXOffset, 0 + 100, 'player');
        up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP); //Assign key actions
        down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        cursors = this.input.keyboard.createCursorKeys();
        sound = this.sound;
        drinkerTimer = this.time.addEvent({ delay: 4500, callback: spawnCustomer, loop: true }); //Spawn drinkers based on a time delay
		gameTimer = this.time.addEvent({ delay: 1000, callback: addGameTime, loop: true });
        row = 1; //Limits the number of rows
        position = row1Position;
        position2 = row1Position;
        ui = this.add.text(screenWidth - playerXOffset, 10, '');
        hp = 30;
        usingBomb = false;
        changeThrowableDisplay(); //set the bomb or sushi icon
		gameTime = 0;
        spawnCount = 1;
        lane = [{length : barLength5, position: row1Position},
                {length : barLength5, position: row2Position},
                {length : barLength5, position: row3Position},
                {length : barLength5, position: row4Position}];

        //variables that change based on levels
		if(level1 == true){
            drinkerAmount = 4;
        }
		else if(level2 == true){
            drinkerAmount = 8;
        }
        visibleDrinker = 0;
        emmiter = new Phaser.Events.EventEmitter(); //an event emitter for animation
        //emmiter.on('boom', addBoomAnim, this);
        //Add audio files to the game
        var bgm_config = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        };
        sound.add('bgm');
        sound.add('win');
        sound.add('lose');
        sound.add('break');
        sound.add('throw_mug');
        sound.add('get_mug');
        sound.add('drinker_out');
        sound.add('drinker_in');
        sound.play('bgm',bgm_config);
        //Animations here
        this.anims.create({
            key: 'boom1',
            frames: this.anims.generateFrameNumbers('boom',{start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        
        //boom.play('boom1');
        function addBoomAnim(x,y) {
            //this.
        }

        //Beer Class
        var Beer = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,
            initialize:
                function Bullet (game)
                {
                    Phaser.GameObjects.Image.call(this, game, 0, 0, 'beer');
                    this.speed = Phaser.Math.GetSpeed(900, 1);
                },
            fire: function (x, y) //Spawn beer based on player's location
            {
                sound.play('throw_mug');
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
            },
            update: function (time, delta)
            {
                this.x -= this.speed * delta;

                for (var elem in drinkers.children.entries) {
                    if(this.y == drinkers.children.entries[elem].y)
                    {
                        if (this.x < drinkers.children.entries[elem].x + drinkerRange && this.x > drinkers.children.entries[elem].x - drinkerRange
							&& drinkers.children.entries[elem].pushedBack == false && drinkers.children.entries[elem].drinking == false)
                        {
                            sound.play('get_mug');
							drinkers.children.entries[elem].pushedBack = true;
							drinkers.children.entries[elem].pushedBackXLocation = this.x;

                            //emmiter.emit('getBeer', this.x, this.y);
                            score++;

                            this.setActive(false);
                            this.setVisible(false);
                        }
                    }
                }

                if (this.x < 0)
                {
                    //Thrown beer doesn't hit anyone fail state
                    this.setActive(false);
                    this.setVisible(false);
                    hp--;
                }

            }
        });
        beers = this.add.group({
            classType: Beer,
            maxSize: 30,
            runChildUpdate: true
        });
        //Bomb class
        var Bomb = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,
            initialize:
                function Bullet (game)
                {
                    Phaser.GameObjects.Image.call(this, game, 0, 0, 'bomb');
                    this.speed = Phaser.Math.GetSpeed(900, 1);
                },
            fire: function (x, y) //Spawn bomb based on player's location
            {
                sound.play('throw_mug');
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
            },
            update: function (time, delta)
            {
                this.x -= this.speed * delta;

                for (var elem in drinkers.children.entries) {
                    if(this.y == drinkers.children.entries[elem].y)
                    {
                        if (this.x < drinkers.children.entries[elem].x + drinkerRange && this.x > drinkers.children.entries[elem].x - drinkerRange
                            && drinkers.children.entries[elem].pushedBack == false && drinkers.children.entries[elem].drinking == false)
                        {
                            sound.play('get_mug');
                            //drinkers.children.entries[elem].pushedBack = true;
                            //drinkers.children.entries[elem].pushedBackXLocation = this.x;
                            drinkers.children.entries[elem].setActive(false);
                            drinkers.children.entries[elem].setVisible(false);
                            //bomb & lane logic
                            if(drinkers.children.entries[elem].x > barLength4 && drinkers.children.entries[elem].x <= barLength5){
                                if(drinkers.children.entries[elem].y == row1Position){
                                    lane[0].length = barLength4;
                                }
                                else if(drinkers.children.entries[elem].y == row2Position){
                                    lane[1].length = barLength4;
                                }
                                else if(drinkers.children.entries[elem].y == row3Position){
                                    lane[2].length = barLength4;
                                }
                                else if(drinkers.children.entries[elem].y == row4Position){
                                    lane[3].length = barLength4;
                                }
                            }
                            else if(drinkers.children.entries[elem].x > barLength3 && drinkers.children.entries[elem].x <= barLength4){
                                if(drinkers.children.entries[elem].y == row1Position){
                                    lane[0].length = barLength3;
                                }
                                else if(drinkers.children.entries[elem].y == row2Position){
                                    lane[1].length = barLength3;
                                }
                                else if(drinkers.children.entries[elem].y == row3Position){
                                    lane[2].length = barLength3;
                                }
                                else if(drinkers.children.entries[elem].y == row4Position){
                                    lane[3].length = barLength3;
                                }
                            }
                            else if(drinkers.children.entries[elem].x > barLength2 && drinkers.children.entries[elem].x <= barLength3){
                                if(drinkers.children.entries[elem].y == row1Position){
                                    lane[0].length = barLength2;
                                }
                                else if(drinkers.children.entries[elem].y == row2Position){
                                    lane[1].length = barLength2;
                                }
                                else if(drinkers.children.entries[elem].y == row3Position){
                                    lane[2].length = barLength2;
                                }
                                else if(drinkers.children.entries[elem].y == row4Position){
                                    lane[3].length = barLength2;
                                }
                            }
                            else if(drinkers.children.entries[elem].x > 0 && drinkers.children.entries[elem].x <= barLength2){
                                if(drinkers.children.entries[elem].y == row1Position){
                                    lane[0].length = barLength1;
                                }
                                else if(drinkers.children.entries[elem].y == row2Position){
                                    lane[1].length = barLength1;
                                }
                                else if(drinkers.children.entries[elem].y == row3Position){
                                    lane[2].length = barLength1;
                                }
                                else if(drinkers.children.entries[elem].y == row4Position){
                                    lane[3].length = barLength1;
                                }
                            }

                            //emmiter.emit('getBeer', this.x, this.y); ==============================================
                            score++;
                            drinkers.children.entries[elem].y = -50;
                            this.setActive(false);
                            this.setVisible(false);
                        }
                    }
                }

                for (var elem in bears.children.entries) {
                    if(this.y == bears.children.entries[elem].y)
                    {
                        if (this.x < bears.children.entries[elem].x + drinkerRange && this.x > bears.children.entries[elem].x - drinkerRange
                            && bears.children.entries[elem].pushedBack == false && bears.children.entries[elem].eating == false)
                        {
                            sound.play('get_mug');
                            bears.children.entries[elem].pushedBack = true;
                            bears.children.entries[elem].pushedBackXLocation = this.x;
                            score++;
                            this.setActive(false);
                            this.setVisible(false);
                        }
                    }
                }
                if (this.x < 0)
                {
                    //Thrown beer doesn't hit anyone fail state
                    this.setActive(false);
                    this.setVisible(false);
                    hp--; //Need discussion whether decrese hp or not
                }

            }
        });
        bombs = this.add.group({
            classType: Bomb,
            maxSize: 30,
            runChildUpdate: true
        });

        //Polar bear class
        var Bear = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,
            initialize:
                function Bear (game)
                {
                    Phaser.GameObjects.Image.call(this, game, 0, 0, 'bear')
                    this.speed = Phaser.Math.GetSpeed(100, 1);
                    this.pushedBack = false;
                    this.sushi = 0; //how much sushi the bear has got
                    this.pushedBackXLocation = 0;
                    this.eating = false;
                    this.eating_Timer = 0;
                },
            fire: function (x, y){
                visibleBear ++;
                random = Math.floor(Math.random() * Math.floor(4)); //Randomly selects bears' spawn locations
                //sound.play('drinker_in');
                if(level1 == true && spawnCount <= 4){ // spawn 4 bears for level 1
                    this.setPosition(x, y);
                }
                else if(level2 == true && spawnCount <= 8){ // spawn 8 bears for level 2
                    this.setPosition(x, y);
                }
                else{
                    if(random == 0){
                        this.setPosition(0, row1Position);
                    }
                    else if(random == 1){
                        this.setPosition(0, row2Position);
                    }
                    else if(random == 2){
                        this.setPosition(0, row3Position);
                    }
                    else if(random == 3){
                        this.setPosition(0, row4Position);
                    }
                }
                this.setActive(true);
                this.setVisible(true);
            },
            update: function (time, delta)
            {
                if(this.pushedBack == true) //once the bear got a boom, it will be pushed out the screen
                {
                    this.x -= this.speed * delta * pushedBackMod;
                }
                else if (this.eating == true)
                {
                    this.eating_Timer += delta;
                    if(this.eating_Timer > 3000)
                    {
                        this.eating = false;
                        this.eating_Timer = 0;
                        beerOnHit(this.x, this.y); //send off the plate after drinking TODO: =================================Need change later
                    }
                }
                else
                {
                    this.x += this.speed * delta;
                }

                for(var i = 0; i < lane.length; i++){ //if reaching end of lane
                    if (this.x > lane[i].length && this.y == lane[i].position)
                    {
                        //Reached player fail state
                        visibleBear --;
                        this.setActive(false);
                        this.setVisible(false);
                        this.pushedBack = false;
                        this.pushedBackXLocation = 0;
                        this.eating = false;
                        this.eating_Timer = 0;
                        hp--;
                    }
                }
                //The bear may need time for eating sushi
                if (this.x < 0) //if pushed back off the screen
                {
                    sound.play('drinker_out');
                    visibleDrinker --;
                    this.setActive(false);
                    this.setVisible(false);
                    this.pushedBack = false;
                    this.pushedBackXLocation = 0;
                    this.eating = false;
                    this.eating_Timer = 0;
                }
            }

        });
        bears = this.add.group({
            classType: Bear,
            maxSize: bearAmount,
            runChildUpdate: true
        });


        //Drinker Class
        var Drinker = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,
            initialize:
                function Drinker (game)
                {
                    Phaser.GameObjects.Image.call(this, game, 0, 0, 'drinker')
                    this.speed = Phaser.Math.GetSpeed(100, 1); // Set the drinkers' speed
					this.pushedBack = false; //If the drinker is pushed back
					this.drinking = false; //If the drinker is drinking
					this.pushedBackXLocation = 0; //the location where the drinker was pushed back
					this.drinkTimer = 0; //the time for drinking
                },
            fire: function (x, y){
                visibleDrinker ++;
                random = Math.floor(Math.random() * Math.floor(4)); //Randomly selects drinkers' spawn locations
                //sound.play('drinker_in');
                if(level1 == true && spawnCount <= 4){ // spawn 4 drinkers for level 1
                    this.setPosition(x, y);
                }
                else if(level2 == true && spawnCount <= 8){ // spawn 8 drinkers for level 2
                    this.setPosition(x, y);
                }
                else{
                    if(random == 0){
                        this.setPosition(0, row1Position);
                    }
                    else if(random == 1){
                        this.setPosition(0, row2Position);
                    }
                    else if(random == 2){
                        this.setPosition(0, row3Position);
                    }
                    else if(random == 3){
                        this.setPosition(0, row4Position);
                    }
                }
                this.setActive(true);
                this.setVisible(true);
            },
            update: function (time, delta)
            {
				if(this.pushedBack == true)
				{
					this.x -= this.speed * delta * pushedBackMod;
					if(this.x < this.pushedBackXLocation - pushBackXDistance)
					{
						this.pushedBack = false;
						this.drinking = true;
					}
				}
				else if (this.drinking == true)
				{
					this.drinkTimer += delta;
					if(this.drinkTimer > 3000)
					{
						this.drinking = false;
						this.drinkTimer = 0;
						beerOnHit(this.x, this.y); //send off the beer after drinking
					}
				}
				else
				{
					this.x += this.speed * delta;
				}

                for(var i = 0; i < lane.length; i++){
                    if (this.x > lane[i].length && this.y == lane[i].position) //if reaching end of lane
                    {
                        //Reached player fail state
                        visibleDrinker --;
                        this.setActive(false);
                        this.setVisible(false);
                        this.pushedBack = false;
                        this.pushedBackXLocation = 0;
                        this.drinking = false;
                        this.drinkTimer = 0;
                        hp--;
                    }
                }
                if (this.x < 0) //if pushed back off the screen
                {
                    sound.play('drinker_out');
                    visibleDrinker --;
                    this.setActive(false);
                    this.setVisible(false);
					this.pushedBack = false;
					this.pushedBackXLocation = 0;
					this.drinking = false;
					this.drinkTimer = 0;
                }
            }

        });
        drinkers = this.add.group({
            classType: Drinker,
            maxSize: drinkerAmount,
            runChildUpdate: true
        });
        //Bottle Class
        var Bottle = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,
            initialize:
                function Bottle (game)
                {
                    Phaser.GameObjects.Image.call(this, game, 0, 0, 'bottle')
                    this.speed = Phaser.Math.GetSpeed(200, 1); // Set the bottles' speed
                },
            fire: function (x, y){
                sound.play('throw_mug');
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
            },
            update: function (time, delta)
            {
                //console.log(player.x);
                this.x += this.speed * delta;
                /*
                if (this.x > screenWidth - playerXOffset)
                {
                    if(this.y == player.y)
                    {
                        score++;
                        this.setActive(false);
                        this.setVisible(false);
                    }
                    else
                    {
                        //didn't catch bottle fail state
                        sound.play('break');
                        this.setActive(false);
                        this.setVisible(false);
                        hp--;
                    }

                }
                */
                for(var i = 0; i < lane.length; i++){
                    if (this.x > lane[i].length && this.y == lane[i].position)
                    {
                        if(this.y == player.y)
                        {
                            score++;
                            this.setActive(false);
                            this.setVisible(false);
                        }
                        else
                        {
                            //didn't catch bottle fail state
                            sound.play('break');
                            this.setActive(false);
                            this.setVisible(false);
                            hp--;
                        }

                    }
                }

                if(this.x >= player.x && this.y == player.y){
                    sound.play('get_mug');
                    score++;
                    this.setActive(false);
                    this.setVisible(false);
                }
            }

        });
        bottles = this.add.group({
            classType: Bottle,
            maxSize: 10,
            runChildUpdate: true
        });
    }

//Update Loop
    update (time)
    {
        if(level1 == true){ //spawn 4 drinkers for level 1
            if(spawnCount <= 4){
                spawnDrinker(0, position);
                spawnCount++;
                position += 220;
            }
        }
        else if(level2 == true){ //spawn 8 drinkers for level 2
            if(spawnCount <= 4){
                spawnDrinker(0, position);
                spawnCount++;
                position += 220;
            }
            else if(spawnCount <= 8){
                spawnDrinker(90, position2); // offset the x value for a row of drinkers
                spawnCount++;
                position2 += 220;
            }
        }

        ui.setText('HP: ' + hp + '\nScore: ' + score + '\nTime: ' + gameTime.toMMSS());

        if(hp <= 0){ // reaches fail state
            sound.play('lose');
            sound.removeByKey('bgm');
            this.scene.start("FailScreen");
        }

        else if(visibleDrinker == 0){
            sound.play('win');
            sound.removeByKey('bgm');
            this.scene.start("WinScreen");
        }
        console.log(lane[row - 1].length);
        if (Phaser.Input.Keyboard.JustDown(up) && row >= 1) //Prevent "holding down" actions
        {
            if(row == 1){
                sound.play('up');
                player.y = row4Position;
                row = 4;
                player.x = lane[row - 1].length;
            }
            else{
                sound.play('up');
                player.y -= 220;
                row --;
                player.x = lane[row - 1].length;
            }
        }
        if (Phaser.Input.Keyboard.JustDown(down) && row <= 4)
        {
            if(row == 4){
                sound.play('down');
                player.y = row1Position;
                row = 1;
                player.x = lane[row - 1].length;
            }
            else{
                sound.play('down');
                player.y += 220;
                row ++;
                player.x = lane[row - 1].length;
            }
        }

        if(cursors.left.isDown){
            player.setVelocityX(-400);
        }
        else{
            player.setVelocityX(0);
        }

        if(Phaser.Input.Keyboard.JustDown(space)){
            player.x = lane[row - 1].length;
            if(!usingBomb)
            {
                var beer = beers.get();
                if (beer)
                {
                    beer.fire(player.x, player.y);
                }
            }
            else
            {
                var bomb = bombs.get();
                if (bomb)
                {
                    bomb.fire(player.x, player.y);
                }
            }

        }

        if(Phaser.Input.Keyboard.JustDown(right)){
            //change the type of usingBomb here
            usingBomb = !usingBomb;
            changeThrowableDisplay();
        }

    }
}

function spawnDrinker(x, y) {
    var drinker = drinkers.get();
    if (drinker) {
        drinker.fire(x, y)
    }
}

function spawnBear(x, y) {
    var bear = bears.get();
    if (bear) {
        bear.fire(x, y)
    }
}

function spawnCustomer(){
    random = Math.floor(Math.random() * Math.floor(3));
    if(random == 0 || random == 1){
        spawnDrinker();
    }
    else{
        spawnBear();
    }
}

function spawnBottle(x,y){
    var bottle = bottles.get();
    if(bottle){
        bottle.fire(x, y);
    }
}

function changeThrowableDisplay()
{
    if(usingBomb)
    {
        //show bomb
        bomb_icon.setVisible(true);
        sushi_icon.setVisible(false);
    }
    else
    {
        //show sushi
        sushi_icon.setVisible(true);
        bomb_icon.setVisible(false);
    }
}

function addGameTime(){
	gameTime += Math.floor(1);
}

function beerOnHit(x, y) {
    //console.log("Beer hit a customer");
    spawnBottle(x,y)
}

Number.prototype.toMMSS = function () {
    var minutes = Math.floor(gameTime / 60);
    var seconds = Math.floor(gameTime % 60);

    if (minutes == 0) {
        minutes = "00";
    }
    else if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if (seconds == 0) {
        seconds = "00";
    }
    else if(seconds < 10) {
        seconds = "0" + seconds;
    }

    return minutes + ':' + seconds;
}