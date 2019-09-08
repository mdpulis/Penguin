var player;
var up, down, space;
var row;
var beers, drinkers, bottles, spawnDrinkers;
var random;
var drinkerTimer;
var gameTimer;
var ui;
var score, hp, gameTime;
var emmiter; //event emmiter
var sound;
var drinkerAmount, spawnCount;
var position, position2;

const screenWidth = 1920;
const screenHeight = 1080;
const playerXOffset = 300;

const drinkerRange = 50;

const row1Position = 100;
const row2Position = 320;
const row3Position = 540;
const row4Position = 760;

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
        //Load audio
        this.load.audio('bgm','assets/audio/level1_bgm.mp3');
        this.load.audio('lose','assets/audio/tune_lose.mp3');
        this.load.audio('break','assets/audio/mug_break.mp3');
        this.load.audio('throw_mug','assets/audio/throw_mug.wav')
        this.load.audio('up','assets/audio/up.wav');
        this.load.audio('down','assets/audio/down.wav');
        this.load.audio('get_mug','assets/audio/get_mug.wav');
        this.load.audio('drinker_out','assets/audio/out_customer.wav');
    }
//Create Objects
    create ()
    {
        this.add.image(960, 540, 'background');
        //var music = this.sound.add('bgm');
        //music.play();
        player = this.add.image(screenWidth - playerXOffset, 0 + 100, 'player');
        up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP); //Assign key actions
        down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        sound = this.sound;
        drinkerTimer = this.time.addEvent({ delay: 3000, callback: spawnDrinker, loop: true }); //Spawn drinkers based on a time delay
		gameTimer = this.time.addEvent({ delay: 1000, callback: addGameTime, loop: true });
        row = 1; //Limits the number of rows
        position = row1Position;
        position2 = row1Position;
        ui = this.add.text(screenWidth - playerXOffset, 10, '');
        score = 0;
        hp = 3;
		gameTime = 0;
        spawnCount = 1;

        //variables that change based on levels
		if(level1 == true){
            drinkerAmount = 6;
        }
		else if(level2 == true){
            drinkerAmount = 9;
        }

        //emmiter = new Phaser.Events.EventEmitter();
        //emmiter.on('getBeer', beerOnHit, this);
        //Add audio files to the game
        sound.add('bgm');
        sound.add('lose');
        sound.add('break');
        sound.add('throw_mug');
        sound.add('get_mug');
        sound.add('drinker_out');
        sound.play('bgm');

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
                random = Math.floor(Math.random() * Math.floor(4)); //Randomly selects drinkers' spawn locations
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
				
                
                if (this.x > screenWidth - playerXOffset) //if reaching the player
                {
                    //Reached player fail state
                    this.setActive(false);
                    this.setVisible(false);
					this.pushedBack = false;
					this.pushedBackXLocation = 0;
					this.drinking = false;
					this.drinkTimer = 0;
                    hp--;
                }
                if (this.x < 0) //if pushed back off the screen
                {
                    sound.play('drinker_out');
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
                    this.speed = Phaser.Math.GetSpeed(500, 1); // Set the bottles' speed
                },
            fire: function (x, y){
                sound.play('throw_mug');
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
            },
            update: function (time, delta)
            {
                this.x += this.speed * delta;
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
            }

        });
        bottles = this.add.group({
            classType: Bottle,
            maxSize: 3,
            runChildUpdate: true
        });
    }

//Update Loop
    update (time)
    {
        bgm.play();
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
        ui.setText('HP: ' + hp + '\nScore: ' + score + '\nTime: ' + time);
        if(hp <= 0){ // reaches fail state
            sound.play('lose');
            sound.removeByKey('bgm');
            this.scene.start("FailScreen");
        }
        else if(score >= 10 && level1 == true){ // reaches level 1 win state
            sound.removeByKey('bgm');
            this.scene.start("WinScreen");
        }
        else if(score >= 20 && level2 == true){ // reaches level 2 win state
            sound.removeByKey('bgm');
            this.scene.start("WinScreen");
        }

        if (Phaser.Input.Keyboard.JustDown(up) && row > 1) //Prevent "holding down" actions
        {
            sound.play('up');
            player.y -= 220;
            row --;
        }
        else if (Phaser.Input.Keyboard.JustDown(down) && row < 4)
        {
            sound.play('down');
            player.y += 220;
            row ++;
        }

        if(Phaser.Input.Keyboard.JustDown(space)){
            var beer = beers.get();

            if (beer)
            {
                beer.fire(player.x, player.y);
            }

        }

    }
}

function spawnDrinker(x, y) {
    var drinker = drinkers.get();
    if (drinker) {
        drinker.fire(x, y)
    }
}

function spawnBottle(x,y){
    var bottle = bottles.get();
    if(bottle){
        bottle.fire(x, y);
    }
}

function addGameTime(){
	gameTime += 1;
}

function beerOnHit(x, y) {
    console.log("Beer hit a customer");
    spawnBottle(x,y)
}

