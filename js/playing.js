var player;
var up, down, left, right, space, q;
var row;
var sushis, returnedPlates, spawnPenguins, bears, penguins, busboys, winboys, bombs, fishes, bombAnims, plateAnims;

var random;
var penguinTimer;
var gameTimer;
var ui;
var meterUi;
var hp, gameTime;
var sound;
var meterFill;
var levelBgm;
var penguinAmount, penguinCount, bearAmount, bearCount;
var penguinCol1, penguinCol2, penguinCol3, penguinCol4;
var bearCol1, bearCol2, bearCol3, bearCol4;
var position, position2;
var meterCurrentTime, holdRightCurrentTime;
var justUsedMeter;
var textScaleCurrentTime;
var textScaleEnlarging;
var movementSpeedMod;
var cursors;
var served;
var bearsHitWithBombs;
var visiblePenguins;
var visibleBears;
var usingBomb; //indicate whether the player is using sushi or bomb
var busboyCounter;
var winning;
var winboyCount;
let lane;
//var bear;

var arrow_key_icon, sushi_icon, bomb_icon;

const screenWidth = 1920;
const screenHeight = 1080;
const playerXOffset = 500;
const tableYOffset = 70;
const meterWidth = 1028;

const penguinRange = 50;
const returnedPlateRange = 25;

const penguinSpeed = 125;
const bearSpeed = 100;
const fastBearSpeed = 400;
const timeToFillMeter = 16000; //16 seconds, modded down at higher levels
const timeToUseMeter = 300; //.3 seconds

const timeToScaleText = 400; //.3 seconds

const bombSpeed = 900;
const sushiSpeed = 900;
const returnedPlateSpeed = 250;
const busboySpeed = 1200;
const winboySpeed = 900;

const servesRequiredPerLevel = 3;
const additionalServesPerLevel = 4;
const maxServesPerLevel = 50;

const playerYVariance = 220;
const playerMoveSpeed = -400;

const minSpawnDelay = 2500;
const maxSpawnDelay = 5000;

const row1Position = 100;
const row2Position = 320;
const row3Position = 540;
const row4Position = 760;

const barLength1 = 284;
const barLength2 = 568;
const barLength3 = 852;
const barLength4 = 1136;
const barLength5 = 1420;

const laneImgX = screenWidth/2 - 250;

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
        this.load.image('player', 'assets/PenguinWaiterSushi.png');
        this.load.image('player_bomb','assets/PenguinWaiterBOMB.png');
        //this.load.image('sushi', 'assets/sushi.png');
        this.load.image('penguin', 'assets/PenguinCustomerFinal.png');
        this.load.image('returned_plate', 'assets/EmptyPlateFinal.png');
        this.load.image('bomb','assets/BombFinal.png');
		this.load.image('fish','assets/Fish.png'); //TODO fix asset
        this.load.image('bear','assets/PolarBearFinal.png');
        this.load.image('Bear_blasted','assets/Bear_blasted.png');
        this.load.image('busboy','assets/PenguinBusBoy2.png');
        this.load.image('chief','assets/tapper.png');
        this.load.image('table_284','assets/Table_284.png');
        this.load.image('table_568','assets/Table_568.png');
        this.load.image('table_852','assets/Table_852.png');
        this.load.image('table_1136','assets/Table_1136.png');
        this.load.image('table_1420','assets/Table_1420.png');

        this.load.image('arrow_key_icon', 'assets/arrow_key.png');
        this.load.image('sushi_icon', 'assets/SushiOnly.png');
        this.load.image('bomb_icon', 'assets/BombOnly.png');
		this.load.image('bell_icon', 'assets/bell_icon.png');

		this.load.image('meter_outline', 'assets/meter_outline.png');
		this.load.image('meter_backfill', 'assets/meter_backfill.png');
		this.load.image('meter_topfill', 'assets/meter_topfill.png');
        //Load animation spriteSheets
        this.load.spritesheet('boom','assets/anim/boom.png', {frameWidth: 128, frameHeight: 128});
        this.load.spritesheet('testing','assets/anim/testing.png',{frameWidth: 32, frameHeight: 48});
        this.load.spritesheet('falling_plate','assets/anim/EmptyPlate_Animation.png',{frameWidth: 196, frameHeight: 218});
        this.load.spritesheet('sushi','assets/SushiFinal.png', {frameWidth: 196, frameHeight: 218});//{frameWidth: 96, frameHeight: 96});
        this.load.spritesheet('penguin_eating','assets/anim/PenguinEating_Animation.png', {frameWidth: 182, frameHeight: 346});
        //Load audio
        this.load.audio('bgm','assets/audio/level1_bgm.mp3');
        this.load.audio('bgm-level2','assets/audio/vivaldis-winter.mp3');
        this.load.audio('bgm-level3','assets/audio/snow-skirell.mp3');
        this.load.audio('lose','assets/audio/tune_lose.mp3');
        this.load.audio('break','assets/audio/mug_break.mp3');
        this.load.audio('plate_crash','assets/audio/plate-crash.mp3');
        this.load.audio('explosion','assets/audio/explosion.mp3');
        this.load.audio('throw_mug','assets/audio/throw_mug.wav')
        this.load.audio('up','assets/audio/up.wav');
        this.load.audio('down','assets/audio/down.wav');
        this.load.audio('get_mug','assets/audio/get_mug.wav');
        this.load.audio('penguin_out','assets/audio/out_customer.wav');
        this.load.audio('penguin_in','assets/audio/popup.wav');
        this.load.audio('win','assets/audio/win.wav');
		this.load.audio('bell_ring', 'assets/audio/bell_ring.mp3');
		this.load.audio('slurp', 'assets/audio/slurp.mp3');
		this.load.audio('sizzle', 'assets/audio/sizzle.mp3');

        //this.load.bitmapFont('frostbitten-wanker', 'assets/fonts/frostbitten-wanker.png', 'assets/fonts/frostbitten-wanker.fnt');
        this.load.bitmapFont('frosty', 'assets/fonts/frosty.png', 'assets/fonts/frosty.fnt');
    }
//Create Objects
    create ()
    {
        this.add.image(960, 540, 'background');
        this.add.image(screenWidth - 80, screenHeight / 2, 'chief');

        //Lane pictures
        var lane1 = this.add.image(laneImgX, row1Position + tableYOffset, 'table_1420');
        var lane2 = this.add.image(laneImgX, row2Position + tableYOffset, 'table_1420');
        var lane3 = this.add.image(laneImgX, row3Position + tableYOffset, 'table_1420');
        var lane4 = this.add.image(laneImgX, row4Position + tableYOffset, 'table_1420');

        player = this.physics.add.image(screenWidth - playerXOffset, 0 + 100, 'player').setOrigin(0,0);

        arrow_key_icon = this.add.image(screenWidth - 128 * 2, screenHeight - 128, 'arrow_key_icon');
        sushi_icon = this.add.image(screenWidth - 128, screenHeight - 128, 'sushi_icon');
        bomb_icon = this.add.image(screenWidth - 128, screenHeight - 128, 'bomb_icon');

		this.add.image(768, screenHeight - 128, 'meter_backfill');
		meterFill = this.add.sprite(768, screenHeight - 128, 'meter_topfill');
		meterFill.setCrop(0, 0, 512, 96);
		this.add.image(768, screenHeight - 128, 'meter_outline');
		//meterUi = this.add.bitmapText(768, screenHeight - 128, 10, 'frosty', '0', 32);
		meterUi = this.add.bitmapText(512 + 128, screenHeight - 128 - 8, 'frosty', '0', 32);
		meterUi.setText('HOLD RIGHT TO CLEAR ALL EMPTY PLATES!');
		meterUi.setVisible(false);
		justUsedMeter = false;
		textScaleCurrentTime = 0;
		textScaleEnlarging = true;

        //var music = this.sound.add('bgm');
        //music.play();
        up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP); //Assign key actions
        down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        cursors = this.input.keyboard.createCursorKeys();
        served = 0;
		bearsHitWithBombs = 0;
		visiblePenguins = 0;
		visibleBears = 0;
		meterCurrentTime = 0;
        sound = this.sound;

        //var spawnDelay = Phaser.Math.Between(minSpawnDelay - 50 * level, maxSpawnDelay - 50 * level);
		var spawnDelay = 3500 - (100 * level);
        penguinTimer = this.time.addEvent({ delay: spawnDelay, callback: spawnCustomer, loop: true }); //Spawn penguins based on a time delay
		gameTimer = this.time.addEvent({ delay: 1000, callback: addGameTime, loop: true });
        row = 1; //Limits the number of rows
        movementSpeedMod = 1 + (.06 * level);
        ui = this.add.bitmapText(screenWidth - playerXOffset / 2, 10, 'frosty', '0', 32);

        hp = 5;
        usingBomb = false;
        changeThrowableDisplay(false); //set the bomb or sushi icon
		gameTime = 0;
        penguinCount = 1;
        bearCount = 1;
        busboyCounter = 0;

        winboyCount = 0;
        winning = false;

        lane = [{length : barLength5, position: row1Position},
                {length : barLength5, position: row2Position},
                {length : barLength5, position: row3Position},
                {length : barLength5, position: row4Position}];

        //variables that change based on levels
		if(level == 1){
            penguinAmount = 5;
            penguinCol1 = row1Position;
            bearCol1 = row4Position;
        }
		else if(level == 2){
            penguinAmount = 9;
            penguinCol1 = row2Position;
            bearCol1 = row1Position;
            penguinCol2 = row1Position;
        }
		else if(level == 3){
            penguinAmount = 10;
            penguinCol1 = row2Position;
            bearCol1 = row1Position;
            penguinCol2 = row1Position;
            bearCol2 = row4Position;
            penguinCol3 = row1Position;
        }
		else if(level == 4){
            penguinAmount = 11;
            penguinCol1 = row1Position;
            penguinCol2 = row1Position;
            bearCol2 = row3Position;
            penguinCol3 = row1Position;
        }
		else if(level == 5){
            penguinAmount = 12;
            penguinCol1 = row2Position;
            bearCol1 = row1Position;
            penguinCol2 = row1Position;
            bearCol2 = row4Position;
            penguinCol3 = row2Position;
            bearCol3 = row1Position;
            penguinCol4 = row1Position;
        }
		else if(level == 6){
            penguinAmount = 13;
            penguinCol1 = row1Position;
            bearCol1 = row4Position;
            penguinCol2 = row1Position;
            penguinCol3 = row3Position;
            bearCol3 = row1Position;
            penguinCol4 = row1Position;
        }
        else if(level == 7){
            penguinAmount = 14;
            penguinCol1 = row1Position;
            bearCol1 = row4Position;
            penguinCol2 = row1Position;
            bearCol2 = row4Position;
            penguinCol3 = row2Position;
            bearCol3 = row1Position;
            penguinCol4 = row2Position;
            bearCol4 = row1Position;
        }
        else if(level >= 8){
            penguinAmount = 16;
            penguinCol1 = row2Position;
            bearCol1 = row1Position;
            penguinCol2 = row1Position;
            bearCol2 = row4Position;
            penguinCol3 = row2Position;
            bearCol3 = row1Position;
            penguinCol4 = row1Position;
            bearCol4 = row4Position;
        }

        visiblePenguins = 0;
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
        sound.add('win');
        sound.add('lose');
        sound.add('break');
        sound.add('throw_mug');
        sound.add('get_mug');
        sound.add('penguin_out');
        sound.add('penguin_in');
		sound.add('bell_ring');
		sound.add('slurp');
		sound.add('sizzle');
        if(level == 1)
        {
            levelBgm = 'bgm';
        }
        else if(level == 2 || level == 3)
        {
            levelBgm = 'bgm-level2';
        }
        else if(level >= 4)
        {
            levelBgm = 'bgm-level3';
        }
        sound.add(levelBgm);
        sound.play(levelBgm, bgm_config);

        //Animations here
        this.anims.create({
            key: 'boom1',
            frames: this.anims.generateFrameNumbers('boom',{start: 0, end: 6}),
            frameRate: 10,
            repeat: 1,
        });
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('testing', { start: 0, end: 3 }),
            frameRate: 1,
            repeat: 1
        });
        this.anims.create({
            key: 'falling',
            frames: this.anims.generateFrameNumbers('falling_plate', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'eating',
            frames: this.anims.generateFrameNumbers('penguin_eating',{ start: 1, end: 6}),
            frameRate: 3,
            repeat: 0
        });
        bombAnims = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            maxSize: 30,
            runChildUpdate: true,
        });
        plateAnims = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            maxSize: 10,
            runChildUpdate: true,
        });

        function addBoomAnim(x,y) {
            var boomAnim = bombAnims.get();
            boomAnim.setActive(true);
            boomAnim.setVisible(true);
            if (boomAnim) {
                boomAnim.setScale(4);
                boomAnim.x = x;
                boomAnim.y = y - 150;
                boomAnim.anims.play('boom1',false);
                boomAnim.once('animationcomplete',()=>{
                    boomAnim.setActive(false);
                    boomAnim.setVisible(false);
                    //console.log("animation complete");
                });
            }
        }

        function addPlateAnim(x,y) {
            var plateAnim = plateAnims.get();
            plateAnim.setActive(true);
            plateAnim.setVisible(true);
            if (plateAnim) {
                //boomAnim.setScale(4);
                plateAnim.x = x;
                plateAnim.y = y;
                plateAnim.anims.play('falling',false);
                plateAnim.once('animationcomplete',()=>{
                    sound.play('break');
                    hp--;
                    plateAnim.setActive(false);
                    plateAnim.setVisible(false);
                    //console.log("animation complete");
                });
            }
        }

        //Polar bear class
        var Bear = new Phaser.Class({
            Extends: Phaser.GameObjects.Sprite,
            initialize:
                function Bear (game)
                {
                    Phaser.GameObjects.Sprite.call(this, game, 0, 0, 'bear')
                    this.speed = Phaser.Math.GetSpeed(bearSpeed * movementSpeedMod, 1);
					this.fastSpeed = Phaser.Math.GetSpeed(fastBearSpeed * movementSpeedMod, 1);
                    this.pushedBack = false;
                    this.pushedBackXLocation = 0;
                    this.eating = false;
                    this.eating_Timer = 0;
					this.spedUp = false;
                },
            fire: function (x, y){
                visibleBears ++;
                this.setTexture('bear');
                random = Math.floor(Math.random() * Math.floor(4)); //Randomly selects bears' spawn locations
                //sound.play('penguin_in');
                if(level == 1 && bearCount <= 1){ // spawn 4 bears for level 1
                    this.setPosition(x, y);
                }
                else if(level == 2 && bearCount <= 1){ // spawn 8 bears for level 2
                    this.setPosition(x, y);
                }
                else if(level == 3 && bearCount <= 2){
                    this.setPosition(x, y);
                }
                else if(level == 4 && bearCount <= 2){
                    this.setPosition(x, y);
                }
                else if(level == 5 && bearCount <= 3){
                    this.setPosition(x, y);
                }
                else if(level == 6 && bearCount <= 3){
                    this.setPosition(x, y);
                }
                else if(level == 7 && bearCount <= 4){
                    this.setPosition(x, y);
                }
                else if(level >= 8 && bearCount <= 4){
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
                if(this.pushedBack == true && winning == false) //once the bear got a boom, it will be pushed out the screen
                {
                    this.setTexture('Bear_blasted');
					if(this.spedUp == false)
					{
						this.x -= this.speed * delta * pushedBackMod;
					}
					else
					{
						this.x -= this.fastSpeed * delta * pushedBackMod;
					}

                }
                //else if (this.eating == true)
                //{
                    //this.eating_Timer += delta;
                    //if(this.eating_Timer > 3000)
                    //{
                        //this.eating = false;
                        //this.eating_Timer = 0;
                        //sushiOnHit(this.x, this.y); //send off the plate after drinking TODO: =================================Need change later
                    //}
                //}
                else
                {
                    if(winning == false){
                        if(this.spedUp == false)
                        {
                            this.x += this.speed * delta;
                        }
                        else
                        {
                            this.x += this.fastSpeed * delta;
                        }
                    }
                }

                for(var i = 0; i < lane.length; i++){ //if reaching end of lane
                    if (this.x > lane[i].length && this.y == lane[i].position)
                    {
                        //Reached player fail state
                        visibleBears --;
                        this.y = -50;
                        //this.speed = Phaser.Math.GetSpeed(bearSpeed * movementSpeedMod, 1);
                        this.setActive(false);
                        this.setVisible(false);
                        this.pushedBack = false;
                        this.pushedBackXLocation = 0;
                        this.eating = false;
                        this.eating_Timer = 0;
						this.spedUp = false;
                        hp--;
						checkForMinCustomers();
                    }
                }
                //The bear may need time for eating sushi
                if (this.x < 0) //if pushed back off the screen
                {
                    sound.play('penguin_out');
                    visibleBears --;
                    this.y = -50;
                    //this.speed = Phaser.Math.GetSpeed(bearSpeed * movementSpeedMod, 1);
                    this.setActive(false);
                    this.setVisible(false);
                    this.pushedBack = false;
                    this.pushedBackXLocation = 0;
                    this.eating = false;
                    this.eating_Timer = 0;
					this.spedUp = false;
                    served++;
					checkForMinCustomers();
                }
            }

        });
        bears = this.add.group({
            classType: Bear,
            maxSize: bearAmount,
            runChildUpdate: true
        });


        //Penguin Class
        var Penguin = new Phaser.Class({
            Extends: Phaser.GameObjects.Sprite,
            initialize:
                function Penguin (game)
                {
                    Phaser.GameObjects.Sprite.call(this, game, 0, 0, 'penguin_eating')
                    this.speed = Phaser.Math.GetSpeed(penguinSpeed * movementSpeedMod, 1); // Set the penguins' speed
					this.pushedBack = false; //If the penguin is pushed back
					this.drinking = false; //If the penguin is drinking
					this.pushedBackXLocation = 0; //the location where the penguin was pushed back
					this.drinkTimer = 0; //the time for drinking
                },
            fire: function (x, y){
                visiblePenguins ++;
                this.setTexture('penguin_eating', 0);
                random = Math.floor(Math.random() * Math.floor(4)); //Randomly selects penguins' spawn locations
                //sound.play('penguin_in');
                if(level == 1 && penguinCount <= 3){ // spawn 4 penguins for level 1
                    this.setPosition(x, y);
                }
                else if(level == 2 && penguinCount <= 7){ // spawn 8 penguins for level 2
                    this.setPosition(x, y);
                }
                else if(level == 3 && penguinCount <= 8){
                    this.setPosition(x, y);
                }
                else if(level == 4 && penguinCount <= 10){
                    this.setPosition(x, y);
                }
                else if(level == 5 && penguinCount <= 9){
                    this.setPosition(x, y);
                }
                else if(level == 6 && penguinCount <= 10){
                    this.setPosition(x, y);
                }
                else if(level == 7 && penguinCount <= 10){
                    this.setPosition(x, y);
                }
                else if(level >= 8 && penguinCount <= 12){
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
				if(this.pushedBack == true && winning == false)
				{
				    this.setTexture('penguin_eating', 1);
					this.x -= this.speed * delta * pushedBackMod;
					if(this.x < this.pushedBackXLocation - pushBackXDistance * ((movementSpeedMod - 1) / 2 + 1))
					{
						this.pushedBack = false;
						this.drinking = true;
                        this.anims.play('eating');
					}
				}
				else if (this.drinking == true && winning == false)
				{

					this.drinkTimer += delta;
					if(this.drinkTimer > 3000)
					{
						this.drinking = false;
						this.drinkTimer = 0;
						this.setTexture('penguin_eating', 0);
						sushiOnHit(this.x, this.y); //send off the sushi after eating
                        //console.log("spawn plate 1")
					}
				}
				else
				{
                    if(winning == false){
                        this.x += this.speed * delta;
                    }
				}

                for(var i = 0; i < lane.length; i++){
                    if (this.x > lane[i].length && this.y == lane[i].position) //if reaching end of lane
                    {
                        //Reached player fail state
                        visiblePenguins --;
                        this.y = -50;
                        this.setActive(false);
                        this.setVisible(false);
                        this.pushedBack = false;
                        this.pushedBackXLocation = 0;
                        this.drinking = false;
                        this.drinkTimer = 0;
                        hp--;
						checkForMinCustomers();
                    }
                }
                if (this.x < 0) //if pushed back off the screen
                {
                    sound.play('penguin_out');
                    visiblePenguins --;
                    this.y = -50;
                    this.setActive(false);
                    this.setVisible(false);
					this.pushedBack = false;
					this.pushedBackXLocation = 0;
					this.drinking = false;
					this.drinkTimer = 0;
					served++;
					checkForMinCustomers();
                }
            }

        });
        penguins = this.add.group({
            classType: Penguin,
            maxSize: penguinAmount,
            runChildUpdate: true
        });

        //Bomb class
        var Bomb = new Phaser.Class({
            Extends: Phaser.GameObjects.Sprite,
            initialize:
                function Bullet (game)
                {
                    Phaser.GameObjects.Sprite.call(this, game, 0, 0, 'bomb');
                    this.speed = Phaser.Math.GetSpeed(bombSpeed, 1);
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
                if(winning == false){
                    this.x -= this.speed * delta;
                }

                for (var elem in penguins.children.entries) {
                    if(this.y == penguins.children.entries[elem].y)
                    {
                        if (this.x < penguins.children.entries[elem].x + penguinRange && this.x > penguins.children.entries[elem].x - penguinRange
                            && penguins.children.entries[elem].pushedBack == false && penguins.children.entries[elem].drinking == false)
                        {
                            //bomb & lane logic
                            if(penguins.children.entries[elem].x > barLength4 && penguins.children.entries[elem].x <= barLength5){
                                if(penguins.children.entries[elem].y == row1Position){
                                    lane[0].length = barLength4;
                                    lane1.setTexture('table_1136');
                                }
                                else if(penguins.children.entries[elem].y == row2Position){
                                    lane[1].length = barLength4;
                                    lane2.setTexture('table_1136');
                                }
                                else if(penguins.children.entries[elem].y == row3Position){
                                    lane[2].length = barLength4;
                                    lane3.setTexture('table_1136');
                                }
                                else if(penguins.children.entries[elem].y == row4Position){
                                    lane[3].length = barLength4;
                                    lane4.setTexture('table_1136');
                                }
                            }
                            else if(penguins.children.entries[elem].x > barLength3 && penguins.children.entries[elem].x <= barLength4){
                                if(penguins.children.entries[elem].y == row1Position){
                                    lane[0].length = barLength3;
                                    lane1.setTexture('table_852');
                                }
                                else if(penguins.children.entries[elem].y == row2Position){
                                    lane[1].length = barLength3;
                                    lane2.setTexture('table_852');
                                }
                                else if(penguins.children.entries[elem].y == row3Position){
                                    lane[2].length = barLength3;
                                    lane3.setTexture('table_852');
                                }
                                else if(penguins.children.entries[elem].y == row4Position){
                                    lane[3].length = barLength3;
                                    lane4.setTexture('table_852');
                                }
                            }
                            else if(penguins.children.entries[elem].x > barLength2 && penguins.children.entries[elem].x <= barLength3){
                                if(penguins.children.entries[elem].y == row1Position){
                                    lane[0].length = barLength2;
                                    lane1.setTexture('table_568');
                                }
                                else if(penguins.children.entries[elem].y == row2Position){
                                    lane[1].length = barLength2;
                                    lane2.setTexture('table_568');
                                }
                                else if(penguins.children.entries[elem].y == row3Position){
                                    lane[2].length = barLength2;
                                    lane3.setTexture('table_568');
                                }
                                else if(penguins.children.entries[elem].y == row4Position){
                                    lane[3].length = barLength2;
                                    lane4.setTexture('table_568');
                                }
                            }
                            else if(penguins.children.entries[elem].x > 0 && penguins.children.entries[elem].x <= barLength2){
                                if(penguins.children.entries[elem].y == row1Position){
                                    lane[0].length = barLength1;
                                    lane1.setTexture('table_284');
                                }
                                else if(penguins.children.entries[elem].y == row2Position){
                                    lane[1].length = barLength1;
                                    lane2.setTexture('table_284');
                                }
                                else if(penguins.children.entries[elem].y == row3Position){
                                    lane[2].length = barLength1;
                                    lane3.setTexture('table_284');
                                }
                                else if(penguins.children.entries[elem].y == row4Position){
                                    lane[3].length = barLength1;
                                    lane4.setTexture('table_284');
                                }
                            }

                            //score++;
                            sound.play('explosion');
                            penguins.children.entries[elem].y = -50;
                            addBoomAnim(this.x, this.y);
                            console.log("hit with penguin"+ this.x + " " + this.y);
                            this.setActive(false);
                            this.setVisible(false);
                            penguins.children.entries[elem].setActive(false);
                            penguins.children.entries[elem].setVisible(false);
                        }
                    }
                }

                for (var elem in bears.children.entries) {
                    if(this.y == bears.children.entries[elem].y)
                    {
                        if (this.x < bears.children.entries[elem].x + penguinRange && this.x > bears.children.entries[elem].x - penguinRange
                            && bears.children.entries[elem].pushedBack == false && bears.children.entries[elem].eating == false)
                        {
                            //sound.play('get_mug');
                            sound.play('explosion');
                            bears.children.entries[elem].pushedBack = true;
                            bears.children.entries[elem].pushedBackXLocation = this.x;
                            score += 2;
                            addBoomAnim(this.x, this.y);
                            console.log("hit with bear" + this.x + " " + this.y);

							bearsHitWithBombs++;
							if(bearsHitWithBombs % 3 == 0)
							{
								spawnFish(this.x, this.y);
							}

							this.setActive(false);
                            this.setVisible(false);
                        }
                    }
                }

                if (this.x < 0)
                {
                    //Thrown bomb doesn't hit anyone fail state
                    console.log("hit with bound");
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

        //Sushi Class
        var Sushi = new Phaser.Class({
            Extends: Phaser.GameObjects.Sprite,//Image
            initialize:
                function Bullet (game)
                {
                    Phaser.GameObjects.Sprite.call(this, game, 0, 0, 'sushi');
                    this.speed = Phaser.Math.GetSpeed(sushiSpeed, 1);
					this.taken = false;
                },
            fire: function (x, y) //Spawn sushi based on player's location
            {
                sound.play('throw_mug');
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
				this.taken = false;
            },
            update: function (time, delta)
            {
                if(winning == false){
                    this.x -= this.speed * delta;
                }
                //penguin receives sushi
                for (var elem in penguins.children.entries) {
                    if(this.taken == false && this.y == penguins.children.entries[elem].y)
                    {
                        if (this.x < penguins.children.entries[elem].x + returnedPlateRange && this.x > penguins.children.entries[elem].x - returnedPlateRange
                            && penguins.children.entries[elem].pushedBack == false && penguins.children.entries[elem].drinking == false)
                        {
                            sound.play('get_mug');
                            penguins.children.entries[elem].pushedBack = true;
                            penguins.children.entries[elem].pushedBackXLocation = this.x;

                            score += 2;
							
							this.taken = true;
                            this.setActive(false);
                            this.setVisible(false);
                        }
                    }
                }

                //TODO: bear receives sushi
                for (var elem in bears.children.entries) {
                    if(this.taken == false && this.y == bears.children.entries[elem].y)
                    {
                        if (this.x < bears.children.entries[elem].x + returnedPlateRange && this.x > bears.children.entries[elem].x - returnedPlateRange
                            && bears.children.entries[elem].pushedBack == false && bears.children.entries[elem].eating == false)
                        {
                            sound.play('get_mug');
                            //bears.children.entries[elem].pushedBack = true;
                            //bears.children.entries[elem].pushedBackXLocation = this.x;
							bears.children.entries[elem].spedUp = true;
                            //bears.children.entries[elem].speed = Phaser.Math.GetSpeed(fastBearSpeed * movementSpeedMod, 1);
                            //score++;

							this.taken = true;
                            this.setActive(false);
                            this.setVisible(false);
                        }
                    }
                }

                if (this.x < 0)
                {
                    //Thrown sushi doesn't hit anyone fail state
                    sound.play('plate_crash');
                    this.setActive(false);
                    this.setVisible(false);
                    hp--;
                }

            }
        });
        sushis = this.add.group({
            classType: Sushi,
            maxSize: 30,
            runChildUpdate: true
        });

        //Returned Plate Class
        var ReturnedPlate = new Phaser.Class({
            Extends: Phaser.GameObjects.Sprite,
            initialize:
                function ReturnedPlate (game)
                {
                    Phaser.GameObjects.Sprite.call(this, game, 0, 0, 'falling_plate'); //returnedPlate  returned_plate
                    this.speed = Phaser.Math.GetSpeed(returnedPlateSpeed * movementSpeedMod, 1); // Set the returnedPlates' speed
                    this.inAnimation = false;
                    this.animTimer = 820;
                    //this.collectable = true;
                    //console.log("initialize plate. Collectable: "+ this.collectable);
                },
            fire: function (x, y){
                this.setTexture('falling_plate');
                this.collectable = true;
                this.inAnimation = false;
                this.speed = Phaser.Math.GetSpeed(returnedPlateSpeed * movementSpeedMod, 1);
                sound.play('throw_mug');
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
            },
            update: function (time, delta)
            {
                if(winning == false){
                    this.x += this.speed * delta;
                }
                for(var i = 0; i < lane.length; i++){
                    if (this.x > lane[i].length && this.y == lane[i].position)
                    {
                        if(this.y == player.y && this.collectable)
                        {
                            //console.log("get plate. timer = "+this.animTimer + ", collectable: "+this.collectable);
                            score += 1;
                            this.setActive(false);
                            this.setVisible(false);
                        }
                        else
                        {
                            //didn't catch returnedPlate fail state
                            //this.speed = 0;
                            //this.collectable = false;
                            //console.log("State change - collectable: "+this.collectable);
                            /*
                            if(!this.inAnimation)
                            {
                                //this.collectable = false;
                                //this.anims.play('falling', false, 0);
                                this.inAnimation = true;
                            }
                            else
                            {
                                this.animTimer -= delta;
                                this.anims.play('falling', true, 0);
                                if(this.animTimer <= 0)
                                {
                                    this.animTimer = 820;
                                    this.anims.nextFrame();
                                    sound.play('break');
                                    this.setVisible(false);
                                    this.setActive(false);
                                    hp--;
                                }
                            }
                            */
                            //sound.play('break');
                            addPlateAnim(this.x, this.y)
                            this.setActive(false);
                            this.setVisible(false);
                            //hp--;
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
        returnedPlates = this.add.group({
            classType: ReturnedPlate,
            maxSize: 10,
            runChildUpdate: true
        });

        //Busboy Class
        var Busboy = new Phaser.Class({
            Extends: Phaser.GameObjects.Sprite,
            initialize:
                function Busboy (game)
                {
                    Phaser.GameObjects.Sprite.call(this, game, 0, 0, 'busboy')
                    this.speed = Phaser.Math.GetSpeed(busboySpeed * movementSpeedMod, 1); // Set the busboy's speed
                    this.row = busboyCounter;
                    console.log('new busboy: ' + busboyCounter);
                    busboyCounter++;
                },
            fire: function (x, y){
                if(this.row == 0){
                    this.setPosition(screenWidth - playerXOffset, row1Position);
                }
                else if(this.row == 1){
                    this.setPosition(screenWidth - playerXOffset, row2Position);
                }
                else if(this.row == 2){
                    this.setPosition(screenWidth - playerXOffset, row3Position);
                }
                else if(this.row == 3){
                    this.setPosition(screenWidth - playerXOffset, row4Position);
                }

                this.setActive(true);
                this.setVisible(true);
            },
            update: function (time, delta)
            {
                this.x -= this.speed * delta;

                for (var elem in returnedPlates.children.entries) {
                    if (this.y == returnedPlates.children.entries[elem].y &&
                        this.x < returnedPlates.children.entries[elem].x + penguinRange && this.x > returnedPlates.children.entries[elem].x - penguinRange) {
                        score += 1;
                        returnedPlates.children.entries[elem].setActive(false);
                        returnedPlates.children.entries[elem].setVisible(false);
                    }
                }

                if (this.x < 0 - 300) //if they reach the end of the screen
                {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }

        });
        busboys = this.add.group({
            classType: Busboy,
            maxSize: 4,
            runChildUpdate: true
        });

        //winboy class
        var Winboy = new Phaser.Class({
            Extends: Phaser.GameObjects.Sprite,
            initialize:
                function Busboy (game)
                {
                    Phaser.GameObjects.Sprite.call(this, game, 0, 0, 'busboy')
                    this.speed = Phaser.Math.GetSpeed(winboySpeed * movementSpeedMod, 1); // Set the busboy's speed
                    this.row = busboyCounter;
                    busboyCounter++;
                },
            fire: function (x, y){
                if(this.row == 0){
                    this.setPosition(screenWidth - playerXOffset, row1Position);
                }
                else if(this.row == 1){
                    this.setPosition(screenWidth - playerXOffset, row2Position);
                }
                else if(this.row == 2){
                    this.setPosition(screenWidth - playerXOffset, row3Position);
                }
                else if(this.row == 3){
                    this.setPosition(screenWidth - playerXOffset, row4Position);
                }

                this.setActive(true);
                this.setVisible(true);
            },
            update: function (time, delta)
            {
                this.x -= this.speed * delta;

                for (var elem in returnedPlates.children.entries) {
                    if (this.y == returnedPlates.children.entries[elem].y &&
                        this.x < returnedPlates.children.entries[elem].x + penguinRange && this.x > returnedPlates.children.entries[elem].x - penguinRange) {
                        returnedPlates.children.entries[elem].setActive(false);
                        returnedPlates.children.entries[elem].setVisible(false);
                    }
                }

                for (var elem in sushis.children.entries) {
                    if (this.y == sushis.children.entries[elem].y &&
                        this.x < sushis.children.entries[elem].x + penguinRange && this.x > sushis.children.entries[elem].x - penguinRange) {
                        sushis.children.entries[elem].setActive(false);
                        sushis.children.entries[elem].setVisible(false);
                    }
                }

                for (var elem in bombs.children.entries) {
                    if (this.y == bombs.children.entries[elem].y &&
                        this.x < bombs.children.entries[elem].x + penguinRange && this.x > bombs.children.entries[elem].x - penguinRange) {
                        bombs.children.entries[elem].setActive(false);
                        bombs.children.entries[elem].setVisible(false);
                    }
                }

                for (var elem in penguins.children.entries) {
                    if (this.y == penguins.children.entries[elem].y &&
                        this.x < penguins.children.entries[elem].x + penguinRange && this.x > penguins.children.entries[elem].x - penguinRange) {
                        penguins.children.entries[elem].setActive(false);
                        penguins.children.entries[elem].setVisible(false);
                    }
                }

                for (var elem in bears.children.entries) {
                    if (this.y == bears.children.entries[elem].y &&
                        this.x < bears.children.entries[elem].x + penguinRange && this.x > bears.children.entries[elem].x - penguinRange) {
                        bears.children.entries[elem].setActive(false);
                        bears.children.entries[elem].setVisible(false);
                    }
                }

                for (var elem in fishes.children.entries) {
                    if (this.y == fishes.children.entries[elem].y &&
                        this.x < fishes.children.entries[elem].x + penguinRange && this.x > fishes.children.entries[elem].x - penguinRange) {
                        fishes.children.entries[elem].setActive(false);
                        fishes.children.entries[elem].setVisible(false);
                    }
                }

                if (this.x < 0 - 300) //if they reach the end of the screen
                {
                    this.setActive(false);
                    this.setVisible(false);
                    winboyCount++;
                }
            }

        });
        winboys = this.add.group({
            classType: Winboy,
            maxSize: 4,
            runChildUpdate: true
        });

		//Fish class
        var Fish = new Phaser.Class({
            Extends: Phaser.GameObjects.Sprite,
            initialize:
                function Fish (game)
                {
                    Phaser.GameObjects.Sprite.call(this, game, 0, 0, 'fish');
					this.timeAlive = 0;
                },
            fire: function (x, y) //Spawn fish based on bear's location
            {
                //sound.play('throw_mug');
				this.timeAlive = 0;
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
            },
            update: function (time, delta)
            {
				this.timeAlive += delta;
				console.log('alive time:' + this.timeAlive);

				if(this.timeAlive >= 5000) //lasts for 5 seconds
				{
					this.setActive(false);
					this.setVisible(false);
				}


				for(var i = 0; i < lane.length; i++){
                    if (this.x > lane[i].length && this.y == lane[i].position)
                    {
                        if(this.y == player.y)
                        {
                            //score++;
                            this.setActive(false);
                            this.setVisible(false);
                        }
                        else
                        {
                            this.setActive(false);
                            this.setVisible(false);
                        }

                    }
                }

                if(this.x >= player.x && this.y == player.y){
                    sound.play('get_mug');
                    score += 5;
					meterCurrentTime += 6500 * (1 / movementSpeedMod); //add about 1/3rd of a meter
                    this.setActive(false);
                    this.setVisible(false);
                }
            }
        });
        fishes = this.add.group({
            classType: Fish,
            maxSize: 5,
            runChildUpdate: true
        });
    }



//Update Loop
    update (time, delta)
    {
        //spawn stuff at the beginning==================================================================================
        if(level == 1){
            if(penguinCount <= 3){
                spawnPenguin(0, penguinCol1);
                penguinCount++;
                penguinCol1 += playerYVariance;
            }

            if(bearCount <= 1){
                spawnBear(0, bearCol1);
                bearCount++;
                bearCol1 += playerYVariance;
            }
        }
        else if(level == 2){
            if(penguinCount <= 3){
                spawnPenguin(0, penguinCol1);
                penguinCount++;
                penguinCol1 += playerYVariance;
            }
            else if(penguinCount <= 7){
                spawnPenguin(90, penguinCol2);
                penguinCount++;
                penguinCol2 += playerYVariance;
            }

            if(bearCount <= 1){
                spawnBear(0, bearCol1);
                bearCount++;
                bearCol1 += playerYVariance;
            }
        }
        else if(level == 3){
            if(penguinCount <= 3){
                spawnPenguin(0, penguinCol1);
                penguinCount++;
                penguinCol1 += playerYVariance;
            }
            else if(penguinCount <= 6){
                spawnPenguin(90, penguinCol2);
                penguinCount++;
                penguinCol2 += playerYVariance;
            }
            else if(penguinCount <= 8){
                spawnPenguin(180, penguinCol3);
                penguinCount++;
                penguinCol3 += playerYVariance;
            }

            if(bearCount <= 1){
                spawnBear(0, bearCol1);
                bearCount++;
                bearCol1 += playerYVariance;
            }
            else if(bearCount <= 2){
                spawnBear(90, bearCol2);
                bearCount++;
                bearCol2 += playerYVariance;
            }
        }
        else if(level == 4){
            if(penguinCount <= 4){
                spawnPenguin(0, penguinCol1);
                penguinCount++;
                penguinCol1 += playerYVariance;
            }
            else if(penguinCount <= 6){
                spawnPenguin(90, penguinCol2);
                penguinCount++;
                penguinCol2 += playerYVariance;
            }
            else if(penguinCount <= 10){
                spawnPenguin(180, penguinCol3);
                penguinCount++;
                penguinCol3 += playerYVariance;
            }

            if(bearCount <= 2){
                spawnBear(90, bearCol2);
                bearCount++;
                bearCol2 += playerYVariance;
            }
        }
        else if(level == 5){
            if(penguinCount <= 3){
                spawnPenguin(0, penguinCol1);
                penguinCount++;
                penguinCol1 += playerYVariance;
            }
            else if(penguinCount <= 6){
                spawnPenguin(90, penguinCol2);
                penguinCount++;
                penguinCol2 += playerYVariance;
            }
            else if(penguinCount <= 8){
                spawnPenguin(180, penguinCol3);
                penguinCount++;
                penguinCol3 += playerYVariance;
            }
            else if(penguinCount <= 9){
                spawnPenguin(270, penguinCol4);
                penguinCount++;
                penguinCol4 += playerYVariance;
            }

            if(bearCount <= 1){
                spawnBear(0, bearCol1);
                bearCount++;
                bearCol1 += playerYVariance;
            }
            else if(bearCount <= 2){
                spawnBear(90, bearCol2);
                bearCount++;
                bearCol2 += playerYVariance;
            }
            else if(bearCount <= 3){
                spawnBear(180, bearCol3);
                bearCount++;
                bearCol3 += playerYVariance;
            }
        }
        else if(level == 6){
            if(penguinCount <= 3){
                spawnPenguin(0, penguinCol1);
                penguinCount++;
                penguinCol1 += playerYVariance;
            }
            else if(penguinCount <= 7){
                spawnPenguin(90, penguinCol2);
                penguinCount++;
                penguinCol2 += playerYVariance;
            }
            else if(penguinCount <= 9){
                spawnPenguin(180, penguinCol3);
                penguinCount++;
                penguinCol3 += playerYVariance;
            }
            else if(penguinCount <= 10){
                spawnPenguin(270, penguinCol4);
                penguinCount++;
                penguinCol4 += playerYVariance;
            }

            if(bearCount <= 1){
                spawnBear(0, bearCol1);
                bearCount++;
                bearCol1 += playerYVariance;
            }
            else if(bearCount <= 3){
                spawnBear(180, bearCol3);
                bearCount++;
                bearCol3 += playerYVariance;
            }
        }
        else if(level == 7){
            if(penguinCount <= 3){
                spawnPenguin(0, penguinCol1);
                penguinCount++;
                penguinCol1 += playerYVariance;
            }
            else if(penguinCount <= 6){
                spawnPenguin(90, penguinCol2);
                penguinCount++;
                penguinCol2 += playerYVariance;
            }
            else if(penguinCount <= 9){
                spawnPenguin(180, penguinCol3);
                penguinCount++;
                penguinCol3 += playerYVariance;
            }
            else if(penguinCount <= 10){
                spawnPenguin(270, penguinCol4);
                penguinCount++;
                penguinCol4 += playerYVariance;
            }

            if(bearCount <= 1){
                spawnBear(0, bearCol1);
                bearCount++;
                bearCol1 += playerYVariance;
            }
            else if(bearCount <= 2){
                spawnBear(90, bearCol2);
                bearCount++;
                bearCol2 += playerYVariance;
            }
            else if(bearCount <= 3){
                spawnBear(180, bearCol3);
                bearCount++;
                bearCol3 += playerYVariance;
            }
            else if(bearCount <= 4){
                spawnBear(270, bearCol4);
                bearCount++;
                bearCol4 += playerYVariance;
            }
        }
        else if(level >= 8){
            if(penguinCount <= 3){
                spawnPenguin(0, penguinCol1);
                penguinCount++;
                penguinCol1 += playerYVariance;
            }
            else if(penguinCount <= 6){
                spawnPenguin(90, penguinCol2);
                penguinCount++;
                penguinCol2 += playerYVariance;
            }
            else if(penguinCount <= 9){
                spawnPenguin(180, penguinCol3);
                penguinCount++;
                penguinCol3 += playerYVariance;
            }
            else if(penguinCount <= 12){
                spawnPenguin(270, penguinCol4);
                penguinCount++;
                penguinCol4 += playerYVariance;
            }

            if(bearCount <= 1){
                spawnBear(0, bearCol1);
                bearCount++;
                bearCol1 += playerYVariance;
            }
            else if(bearCount <= 2){
                spawnBear(90, bearCol2);
                bearCount++;
                bearCol2 += playerYVariance;
            }
            else if(bearCount <= 3){
                spawnBear(180, bearCol3);
                bearCount++;
                bearCol3 += playerYVariance;
            }
            else if(bearCount <= 4){
                spawnBear(270, bearCol4);
                bearCount++;
                bearCol4 += playerYVariance;
            }
        }
        //==============================================================================================================

        ui.setText('HP: ' + hp + '\nScore: ' + score + '\nTime: ' + gameTime.toMMSS() + '\nServed: ' + served + ' / ' + (servesRequiredPerLevel + additionalServesPerLevel * level));

        if(hp <= 0){ // reaches fail state
            sound.play('lose');
            sound.removeByKey(levelBgm);
            this.scene.start("FailScreen");
        }
        //TODO: add back win state
        else if((served >= maxServesPerLevel || served >= (servesRequiredPerLevel + additionalServesPerLevel * level)) && winning == false){
        //else if(served == 1){
            sound.play('win');
            sound.removeByKey(levelBgm);
            //this.scene.start("WinScreen");
            winning = true;
            spawnWinboys();
        }

        if(winboyCount == 4){
            this.scene.start("WinScreen");
        }

		//Meter
		meterCurrentTime += delta;
		if(meterCurrentTime >= timeToFillMeter)
		{
			meterCurrentTime = timeToFillMeter;
			meterUi.setVisible(true);

			textScaleCurrentTime += delta;
			if(textScaleCurrentTime >= timeToScaleText)
			{
				textScaleEnlarging = !textScaleEnlarging;
				textScaleCurrentTime -= timeToScaleText;
			}

			meterUi.setOrigin(0.25);
			if(textScaleEnlarging == true)
			{
				meterUi.setScale((textScaleCurrentTime / timeToScaleText) * .5 + 1);
			}
			else
			{
				meterUi.setScale(1.5 - (textScaleCurrentTime / timeToScaleText) * .5);
			}

			//meterUi.x = Math.floor(meterFill.x + meterFill.width / 2);
			//meterUi.y = Math.floor(meterFill.y + meterFill.height / 2);
		}
		meterFill.setCrop(0, 0, (meterCurrentTime / timeToFillMeter) * meterWidth, 96);

		//Inputs
        if(winning == false){
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
                    player.y -= playerYVariance;
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
                    player.y += playerYVariance;
                    row ++;
                    player.x = lane[row - 1].length;
                }
            }

            if(cursors.left.isDown){
                player.setVelocityX(playerMoveSpeed * movementSpeedMod);
            }
            else{
                player.setVelocityX(0);
            }

            if(Phaser.Input.Keyboard.JustDown(space)){
                player.x = lane[row - 1].length;
                if(!usingBomb)
                {
                    var sushi = sushis.get();
                    if (sushi)
                    {
                        sushi.fire(player.x, player.y);
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

            if(Phaser.Input.Keyboard.JustDown(q)){
                if(meterCurrentTime >= timeToFillMeter)
                {
                    useMeter();
                }
            }

            if(right.isDown)
            {
                if(meterCurrentTime >= timeToFillMeter)
                {
                    holdRightCurrentTime += delta * movementSpeedMod;
                    if(holdRightCurrentTime >= timeToUseMeter)
                    {
                        useMeter();
                    }
                }
            }
            else
            {
                holdRightCurrentTime = 0;
            }

            if(Phaser.Input.Keyboard.JustUp(right)){
                //change the type of usingBomb here if we didn't use meter
                if(justUsedMeter == false)
                {
                    usingBomb = !usingBomb;
                    changeThrowableDisplay(true);
                }

                justUsedMeter = false;
            }
        }
        else{
            player.setVelocityX(0);
        }

    }
}

function checkForMinCustomers() {
	//spawn more penguins or bears if we have too few on screen
	if(visiblePenguins + visibleBears < 1 + (level / 2))
	{
		spawnCustomer();
	}
}

function spawnPenguin(x, y) {
    var penguin = penguins.get();
    if (penguin) {
        penguin.fire(x, y)
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
        spawnPenguin();
    }
    else{
        spawnBear();
    }

    //let spawnDelay = Phaser.Math.Between(minSpawnDelay - 50 * level, maxSpawnDelay - 50 * level);
    //var timer = this.time.delayedCall(spawnDelay, spawnCustomer);
    //penguinTimer = this.time.addEvent({ delay: spawnDelay, callback: spawnCustomer, loop: false }); //Spawn penguins based on a time delay
}

function spawnReturnedPlate(x,y){
    //console.log("spawn plate 3");
    var returnedPlate = returnedPlates.get();
    if(returnedPlate){
        returnedPlate.fire(x, y);
    }
}

function spawnFish(x, y) {
	var fish = fishes.get();
	if(fish){
		fish.fire(x, y);
	}
}

function useMeter() {
	spawnBusboys();
	sound.play('bell_ring');
	meterCurrentTime = 0;
	meterUi.setVisible(false);
	justUsedMeter = true;
	holdRightCurrentTime = 0;
}


function spawnBusboys() {
    if(busboys.children.entries <= 0)
    {
        //initialize 4 busboys
        busboys.get();
        busboys.get();
        busboys.get();
        busboys.get();
    }

    for (var elem in busboys.children.entries) {
        busboys.children.entries[elem].fire();
    }
}

function spawnWinboys() {
    if(winboys.children.entries <= 0)
    {
        //initialize 4 busboys
        winboys.get();
        winboys.get();
        winboys.get();
        winboys.get();
    }

    for (var elem in winboys.children.entries) {
        winboys.children.entries[elem].fire();
    }
}

function changeThrowableDisplay(playSfx)
{
    if(usingBomb)
    {
        //show bomb
        player.setTexture('player_bomb');
        bomb_icon.setVisible(true);
        sushi_icon.setVisible(false);
		if(playSfx == true)
		{
			sound.play('sizzle');
		}
    }
    else
    {
        //show sushi
        player.setTexture('player');
        sushi_icon.setVisible(true);
        bomb_icon.setVisible(false);
		if(playSfx == true)
		{
			sound.play('slurp');
		}
    }
}

function addGameTime(){
	gameTime += Math.floor(1);
}

function sushiOnHit(x, y) {
    //console.log("spawn plate 2")
    spawnReturnedPlate(x,y)
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
