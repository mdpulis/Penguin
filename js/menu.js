var space;
var level;
var score;
var up, down, left, right, space, q, s;
var cursors;
var row;
var sound;
var step;
var menuUsedMeter;
var menuText;
var menuBoy1, menuBoy2;
var round, round2;
var liteUp, liteDown, liteLeft, liteRight, liteSpace;
var darkUp, darkDown, darkLeft, darkRight, darkSpace;

var buttonFlashTimer;

const playerMenuOffSetX = 1080;
const menuRow1Y = 640;
const menuRow2Y = 860;

const menuBoySpeed = 500;

let menuLane;

class Menu extends Phaser.Scene {
    constructor(){
        super("MenuScreen");
    }
    preload(){
        this.load.image('menuBackground', 'assets/menuBG.png');
        this.load.image('title', 'assets/Flipper.png');
        //Load images
        this.load.image('background', 'assets/Game_BG.png');
        this.load.image('player', 'assets/PenguinWaiterSushi.png');
        this.load.image('player_bomb','assets/PenguinWaiterBOMB.png');
        this.load.image('sushi', 'assets/sushiFinal.png');
        this.load.image('penguin', 'assets/PenguinCustomerFinal.png');
        this.load.image('returned_plate', 'assets/EmptyPlateFinal.png');
        this.load.image('bomb','assets/BombFinal.png');
        this.load.image('fish','assets/Fish.png'); //TODO fix asset
        this.load.image('bear','assets/PolarBearFinal.png');
        this.load.image('Bear_blasted','assets/Bear_blasted.png');
        this.load.image('busboy','assets/PenguinBusBoy2.png');
        this.load.image('busboy2','assets/PenguinBusBoy3.png');
        this.load.image('chief','assets/tapper.png');
        this.load.image('table_284','assets/Table_284.png');
        this.load.image('table_568','assets/Table_568.png');
        this.load.image('table_852','assets/Table_852.png');
        this.load.image('table_1136','assets/Table_1136.png');
        this.load.image('table_1420','assets/Table_1420.png');

        this.load.image('penguin_head', 'assets/waitress_life.png');

        this.load.image('arrow_key_icon', 'assets/arrow_key.png');
        this.load.image('sushi_icon', 'assets/sushi_icon.png');
        this.load.image('bomb_icon', 'assets/bomb_icon.png');
        this.load.image('bell_icon', 'assets/bell_icon.png');

        this.load.image('meter_outline', 'assets/meter_outline.png');
        this.load.image('meter_backfill', 'assets/meter_backfill.png');
        this.load.image('meter_topfill', 'assets/meter_topfill.png');

        this.load.image('up','assets/up.png');
        this.load.image('down','assets/down.png');
        this.load.image('left','assets/left.png');
        this.load.image('right','assets/right.png');
        this.load.image('space','assets/space.png');
        this.load.image('darkUp','assets/darkUp.png');
        this.load.image('darkDown','assets/darkDown.png');
        this.load.image('darkLeft','assets/darkLeft.png');
        this.load.image('darkRight','assets/darkRight.png');
        this.load.image('darkSpace','assets/darkSpace.png');

        this.load.spritesheet('boom','assets/anim/boom.png', {frameWidth: 128, frameHeight: 128});
        this.load.spritesheet('testing','assets/anim/testing.png',{frameWidth: 32, frameHeight: 48});
        this.load.spritesheet('falling_plate','assets/anim/EmptyPlate_Animation.png',{frameWidth: 196, frameHeight: 218});
        this.load.spritesheet('sushi','assets/SushiFinal.png', {frameWidth: 196, frameHeight: 218});//{frameWidth: 96, frameHeight: 96});
        this.load.spritesheet('penguin_eating','assets/anim/PenguinEating_Animation.png', {frameWidth: 182, frameHeight: 346});
        this.load.spritesheet('sushi_falling','assets/anim/SushiPlate_Animation.png', {frameWidth: 186, frameHeight: 278});
        this.load.spritesheet('bomb_falling','assets/anim/BombPlate_Animation.png', {frameWidth: 186, frameHeight: 278});
        this.load.spritesheet('Table_1420-1136','assets/anim/Table_1420-1136.png', {frameWidth: 1420, frameHeight: 130});
        this.load.spritesheet('Table_1420-852','assets/anim/Table_1420-852.png', {frameWidth: 1420, frameHeight: 130});
        this.load.spritesheet('Table_1420-568','assets/anim/Table_1420-568.png', {frameWidth: 1420, frameHeight: 130});
        this.load.spritesheet('Table_1420-284','assets/anim/Table_1420-284.png', {frameWidth: 1420, frameHeight: 130});
        this.load.spritesheet('Table_1136-852','assets/anim/Table_1136-852.png', {frameWidth: 1420, frameHeight: 130});
        this.load.spritesheet('Table_1136-568','assets/anim/Table_1136-568.png', {frameWidth: 1420, frameHeight: 130});
        this.load.spritesheet('Table_1136-284','assets/anim/Table_1136-284.png', {frameWidth: 1420, frameHeight: 130});
        this.load.spritesheet('Table_852-568','assets/anim/Table_852-568.png', {frameWidth: 1420, frameHeight: 130});
        this.load.spritesheet('Table_852-284','assets/anim/Table_852-284.png', {frameWidth: 1420, frameHeight: 130});
        this.load.spritesheet('Table_568-284','assets/anim/Table_568-284.png', {frameWidth: 1420, frameHeight: 130});
        this.load.spritesheet('tapper_Animation','assets/anim/tapper_Animation.png', {frameWidth: 250, frameHeight: 700});

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
        this.load.audio('penguin_scream', 'assets/audio/penguin_scream.mp3');
        this.load.audio('bear_groan', 'assets/audio/bear_groan.mp3');
        this.load.audio('item_pickup', 'assets/audio/item_pickup.mp3');

        this.load.bitmapFont('snowtop-caps-orange-white', 'assets/fonts/snowtop-caps-orange-white.png', 'assets/fonts/snowtop-caps-orange-white.fnt');
    }
    create(){
        this.add.image(screenWidth/2, screenHeight/2, 'menuBackground');
        menuBoy1 = this.add.image(screenWidth/2, screenHeight/2 - 350, 'busboy');
        menuBoy2 = this.add.image(screenWidth/2, screenHeight/2 - 50, 'busboy2');
        this.add.image(screenWidth/2, screenHeight/2 - 250, 'title');

        darkLeft = this.add.image(screenWidth - 650, screenHeight/2 + 250, 'darkLeft');
        darkDown = this.add.image(screenWidth - 650 + 94 + 2, screenHeight/2 + 250, 'darkDown');
        darkRight = this.add.image(screenWidth - 650 + 94 * 2 + 2, screenHeight/2 + 250, 'darkRight');
        darkUp = this.add.image(screenWidth - 650 + 94 + 2, screenHeight/2 + 250 - 90 - 2, 'darkUp');
        darkSpace = this.add.image(screenWidth - 650 + 94 + 2, screenHeight/2 + 250 + 90 + 2, 'darkSpace');

        liteLeft = this.add.image(screenWidth - 650, screenHeight/2 + 250, 'left');
        liteDown = this.add.image(screenWidth - 650 + 94 + 2, screenHeight/2 + 250, 'down');
        liteRight = this.add.image(screenWidth - 650 + 94 * 2 + 2, screenHeight/2 + 250, 'right');
        liteUp = this.add.image(screenWidth - 650 + 94 + 2, screenHeight/2 + 250 - 90 - 2, 'up');
        liteSpace = this.add.image(screenWidth - 650 + 94 + 2, screenHeight/2 + 250 + 90 + 2, 'space');

        liteLeft.setVisible(false);
        liteDown.setVisible(false);
        liteRight.setVisible(false);
        liteUp.setVisible(false);
        liteSpace.setVisible(false);

        var lane1 = this.add.sprite(laneImgX, menuRow1Y + tableYOffset, 'table_852');
        var lane2 = this.add.sprite(laneImgX, menuRow2Y + tableYOffset, 'table_852');

        player = this.physics.add.image(screenWidth - playerMenuOffSetX, menuRow1Y, 'player').setOrigin(0,0);
        row = 1;
        score = 0;
        level = 1;
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        step = 0;
        menuUsedMeter = false;
        buttonFlashTimer = 500;
        usingBomb = false;
        round = 2;
        round2 = 2;

        textScaleEnlarging = true;
        textScaleCurrentTime = 0;

        sushi_icon = this.add.image(screenWidth - 128, screenHeight - 128, 'sushi_icon');
        bomb_icon = this.add.image(screenWidth - 128, screenHeight - 128, 'bomb_icon');

        sound = this.sound;
        sound.add('break');
        sound.add('throw_mug');
        sound.add('get_mug');
        sound.add('penguin_out');
        sound.add('penguin_in');
        sound.add('slurp');
        sound.add('sizzle');
        sound.add('penguin_scream');
        sound.add('bear_groan');

        up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP); //Assign key actions
        down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        cursors = this.input.keyboard.createCursorKeys();

        menuLane = [{length : barLength3, position: menuRow1Y},
                {length : barLength3, position: menuRow2Y}]

        menuText = this.add.bitmapText(screenWidth / 2 - 130, screenHeight / 2 - 100, 'snowtop-caps-orange-white', '0', 35);

        this.anims.create({
            key: 'sushi_fallingAnim',
            frames: this.anims.generateFrameNumbers('sushi_falling',{ start: 0, end: 4}),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'eating',
            frames: this.anims.generateFrameNumbers('penguin_eating',{ start: 1, end: 6}),
            frameRate: 3,
            repeat: 0
        });
        this.anims.create({
            key: 'falling',
            frames: this.anims.generateFrameNumbers('falling_plate', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'boom1',
            frames: this.anims.generateFrameNumbers('boom',{start: 0, end: 6}),
            frameRate: 10,
            repeat: 1,
        });
        this.anims.create({
            key: 'bomb_fallingAnim',
            frames: this.anims.generateFrameNumbers('bomb_falling',{ start: 0, end: 4}),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'Table_1136-568_Anim',
            frames: this.anims.generateFrameNumbers('Table_1136-568',{ start: 0, end: 5}),
            frameRate: 10,
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
        sushiFallingAnims = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            maxSize: 30,
            runChildUpdate: true,
        });
        bombFallingAnims = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            maxSize: 30,
            runChildUpdate: true,
        });

        //Polar bear class
        var Bear = new Phaser.Class({
            Extends: Phaser.GameObjects.Sprite,
            initialize:
                function Bear (game)
                {
                    Phaser.GameObjects.Sprite.call(this, game, 0, 0, 'bear')
                    this.speed = Phaser.Math.GetSpeed(bearSpeed, 1);
                    this.fastSpeed = Phaser.Math.GetSpeed(fastBearSpeed, 1);
                    this.pushedBack = false;
                    this.pushedBackXLocation = 0;
                    this.eating = false;
                    this.eating_Timer = 0;
                    this.spedUp = false;
                },
            fire: function (x, y){
                this.setTexture('bear');
                this.setPosition(0, menuRow2Y);
                this.setActive(true);
                this.setVisible(true);
            },
            update: function (time, delta)
            {
                if(this.pushedBack == true) //once the bear got a boom, it will be pushed out the screen
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
                else
                {
                    if(this.x <= 300){
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

                for(var i = 0; i < menuLane.length; i++){ //if reaching end of lane
                    if (this.x > menuLane[i].length && this.y == menuLane[i].position)
                    {
                        //Reached player fail state
                        sound.play('bear_groan');
                        this.y = -50;
                        this.setActive(false);
                        this.setVisible(false);
                        this.pushedBack = false;
                        this.pushedBackXLocation = 0;
                        this.eating = false;
                        this.eating_Timer = 0;
                        this.spedUp = false;
                    }
                }
                //The bear may need time for eating sushi
                if (this.x < 0) //if pushed back off the screen
                {
                    sound.play('penguin_out');
                    this.y = -50;
                    //this.speed = Phaser.Math.GetSpeed(bearSpeed * movementSpeedMod, 1);
                    this.setActive(false);
                    this.setVisible(false);
                    this.pushedBack = false;
                    this.pushedBackXLocation = 0;
                    this.eating = false;
                    this.eating_Timer = 0;
                    this.spedUp = false;
                }
            }

        });
        bears = this.add.group({
            classType: Bear,
            maxSize: 1,
            runChildUpdate: true
        });

        //Penguin Class
        var Penguin = new Phaser.Class({
            Extends: Phaser.GameObjects.Sprite,
            initialize:
                function Penguin (game)
                {
                    Phaser.GameObjects.Sprite.call(this, game, 0, 0, 'penguin_eating')
                    this.speed = Phaser.Math.GetSpeed(penguinSpeed, 1); // Set the penguins' speed
                    this.pushedBack = false; //If the penguin is pushed back
                    this.drinking = false; //If the penguin is drinking
                    this.pushedBackXLocation = 0; //the location where the penguin was pushed back
                    this.drinkTimer = 0; //the time for drinking
                    this.pushed = false;
                },
            fire: function (x, y){
                this.setTexture('penguin', 0);
                this.setPosition(0, menuRow1Y);
                this.setActive(true);
                this.setVisible(true);
            },
            update: function (time, delta)
            {
                if(this.pushedBack == true)
                {
                    this.setTexture('penguin_eating', 1);
                    this.x -= Phaser.Math.GetSpeed(penguinSpeed, 1) * delta * pushedBackMod;
                    if(this.x < this.pushedBackXLocation - pushBackXDistance)
                    {
                        this.pushedBack = false;
                        this.drinking = true;
                        this.anims.play('eating');
                    }
                }
                else if (this.drinking == true)
                {

                    this.drinkTimer += delta;
                    if(this.drinkTimer > 3000)
                    {
                        this.drinking = false;
                        this.pushed = true;
                        this.drinkTimer = 0;
                        this.setTexture('penguin_eating', 0);
                        sushiOnHit(this.x, this.y); //send off the sushi after eating
                        //console.log("spawn plate 1")
                    }
                }
                else
                {
                    if(this.x <= 440 && this.pushed == false){
                        this.x += this.speed * delta;
                    }
                    else if(this.x <= 240 && this.pushed == true){
                        this.x += this.speed * delta;
                    }
                }

                if(step == 0 && this.x >= 440){
                    step = 1;
                }

                for(var i = 0; i < menuLane.length; i++){
                    if (this.x > menuLane[i].length && this.y == menuLane[i].position) //if reaching end of lane
                    {
                        //Reached player fail state
                        sound.play('penguin_scream');
                        this.y = -50;
                        this.setActive(false);
                        this.setVisible(false);
                        this.pushedBack = false;
                        this.pushedBackXLocation = 0;
                        this.drinking = false;
                        this.drinkTimer = 0;
                    }
                }
                if (this.x < 0) //if pushed back off the screen
                {
                    sound.play('penguin_out');
                    this.y = -50;
                    this.setActive(false);
                    this.setVisible(false);
                    this.pushedBack = false;
                    this.pushedBackXLocation = 0;
                    this.drinking = false;
                    this.drinkTimer = 0;
                    this.pushed = false;
                }
            }

        });
        penguins = this.add.group({
            classType: Penguin,
            maxSize: 1,
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

                this.x -= this.speed * delta;

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
                            this.taken = true;
                            this.setActive(false);
                            this.setVisible(false);
                        }
                    }
                }

                for (var elem in bears.children.entries) {
                    if(this.taken == false && this.y == bears.children.entries[elem].y)
                    {
                        if (this.x < bears.children.entries[elem].x + returnedPlateRange && this.x > bears.children.entries[elem].x - returnedPlateRange
                            && bears.children.entries[elem].pushedBack == false && bears.children.entries[elem].eating == false)
                        {
                            sound.play('get_mug');
                            bears.children.entries[elem].spedUp = true;
                            this.taken = true;
                            this.setActive(false);
                            this.setVisible(false);
                        }
                    }
                }

                if (this.x < 90)
                {
                    //Thrown sushi doesn't hit anyone fail state
                    this.setActive(false);
                    this.setVisible(false);
                }

            }
        });
        sushis = this.add.group({
            classType: Sushi,
            maxSize: 30,
            runChildUpdate: true
        });

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
                this.x -= this.speed * delta;
                for (var elem in penguins.children.entries) {
                    if(this.y == penguins.children.entries[elem].y)
                    {
                        if (this.x < penguins.children.entries[elem].x + penguinRange && this.x > penguins.children.entries[elem].x - penguinRange
                            && penguins.children.entries[elem].pushedBack == false && penguins.children.entries[elem].drinking == false)
                        {
                            //bomb & lane logic
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
                            addBoomAnim(this.x, this.y);
                            this.setActive(false);
                            this.setVisible(false);
                        }
                    }
                }

                if (this.x < 90)
                {
                    //Thrown bomb doesn't hit anyone fail state
                    addBombFalingAnim(this.x, this.y);
                    this.setActive(false);
                    this.setVisible(false);
                }

            }
        });
        bombs = this.add.group({
            classType: Bomb,
            maxSize: 30,
            runChildUpdate: true
        });

        var ReturnedPlate = new Phaser.Class({
            Extends: Phaser.GameObjects.Sprite,
            initialize:
                function ReturnedPlate (game)
                {
                    Phaser.GameObjects.Sprite.call(this, game, 0, 0, 'falling_plate'); //returnedPlate  returned_plate
                    this.speed = Phaser.Math.GetSpeed(returnedPlateSpeed, 1); // Set the returnedPlates' speed
                    this.inAnimation = false;
                    this.animTimer = 820;
                },
            fire: function (x, y){
                this.setTexture('falling_plate');
                this.collectable = true;
                this.inAnimation = false;
                this.speed = Phaser.Math.GetSpeed(returnedPlateSpeed, 1);
                sound.play('throw_mug');
                this.setPosition(x, y);
                this.setActive(true);
                this.setVisible(true);
            },
            update: function (time, delta)
            {
                if(this.x <= (screenWidth - playerMenuOffSetX) / 2){
                    this.x += this.speed * delta;
                }
                for(var i = 0; i < menuLane.length; i++){
                    if (this.x > menuLane[i].length && this.y == menuLane[i].position)
                    {
                        if(this.y == player.y && this.collectable)
                        {
                            this.setActive(false);
                            this.setVisible(false);
                        }
                        else
                        {
                            addPlateAnim(this.x, this.y)
                            this.setActive(false);
                            this.setVisible(false);
                        }

                    }
                }

                if(this.x >= player.x && this.y == player.y){
                    sound.play('get_mug');
                    menuPlatePicked();
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



    }

    update(time, delta){
        changeThrowableDisplay(false);

        menuBoy1.x -= Phaser.Math.GetSpeed(menuBoySpeed, 1) * delta;
        menuBoy2.x += Phaser.Math.GetSpeed(menuBoySpeed, 1) * delta;

        if(menuBoy1.x <= 0 && round%2 == 0){
            menuBoy1.x = screenWidth;
            menuBoy1.y = screenHeight/2 - 50;
            round++;
        }
        else if(menuBoy1.x <= 0 && round%2 == 1){
            menuBoy1.x = screenWidth;
            menuBoy1.y = screenHeight/2 - 350;
            round++;
        }

        if(menuBoy2.x >= screenWidth && round2%2 == 0){
            menuBoy2.x = 0;
            menuBoy2.y = screenHeight/2 - 350;
            round2++;
        }
        else if(menuBoy2.x >= screenWidth && round2%2 == 1){
            menuBoy2.x = 0;
            menuBoy2.y = screenHeight/2 - 50;
            round2++
        }


        menuText.setText("Press S to Start");

        textScaleCurrentTime += delta;
        if(textScaleCurrentTime >= timeToScaleText)
        {
            textScaleEnlarging = !textScaleEnlarging;
            textScaleCurrentTime -= timeToScaleText;
        }

        if(textScaleEnlarging == true)
        {
            //menuText.setScale((textScaleCurrentTime / timeToScaleText) * .5 + 0.5);
        }
        else
        {
            //menuText.setScale(1 - (textScaleCurrentTime / timeToScaleText) * .5);
        }

        if(step == 0){
            liteSpace.setVisible(false);
            spawnPenguin();
            spawnBear();
        }
        else if(step == 1){
            buttonFlashTimer -= delta;
            if(buttonFlashTimer >= 250){
                liteSpace.setVisible(true);
            }
            else if(buttonFlashTimer <= 0){
                buttonFlashTimer = 500;
            }
            else{
                liteSpace.setVisible(false);
            }
        }
        else if(step == 2){
            liteSpace.setVisible(false);
            buttonFlashTimer -= delta;
            if(buttonFlashTimer >= 250){
                liteDown.setVisible(true);
            }
            else if(buttonFlashTimer <= 0){
                buttonFlashTimer = 500;
            }
            else{
                liteDown.setVisible(false);
            }
        }
        else if(step == 3){
            liteDown.setVisible(false);
            buttonFlashTimer -= delta;
            if(buttonFlashTimer >= 250){
                liteRight.setVisible(true);
            }
            else if(buttonFlashTimer <= 0){
                buttonFlashTimer = 500;
            }
            else{
                liteRight.setVisible(false);
            }
        }
        else if(step == 4){
            liteRight.setVisible(false);
            buttonFlashTimer -= delta;
            if(buttonFlashTimer >= 250){
                liteSpace.setVisible(true);
            }
            else if(buttonFlashTimer <= 0){
                buttonFlashTimer = 500;
            }
            else{
                liteSpace.setVisible(false);
            }
        }
        else if(step == 5){
            liteSpace.setVisible(false);
            buttonFlashTimer -= delta;
            if(buttonFlashTimer >= 250){
                liteUp.setVisible(true);
            }
            else if(buttonFlashTimer <= 0){
                buttonFlashTimer = 500;
            }
            else{
                liteUp.setVisible(false);
            }
        }
        else if(step == 6){
            liteUp.setVisible(false);
            buttonFlashTimer -= delta;
            liteLeft.setVisible(true);
        }
        else if(step == 7){
            liteLeft.setVisible(false);
            buttonFlashTimer -= delta;
            if(buttonFlashTimer >= 250){
                liteRight.setVisible(true);
            }
            else if(buttonFlashTimer <= 0){
                buttonFlashTimer = 500;
            }
            else{
                liteRight.setVisible(false);
            }
        }
        else if(step == 8){
            liteRight.setVisible(false);
            buttonFlashTimer -= delta;
            if(buttonFlashTimer >= 250){
                liteSpace.setVisible(true);
            }
            else if(buttonFlashTimer <= 0){
                buttonFlashTimer = 500;
            }
            else{
                liteSpace.setVisible(false);
            }
        }

        if(Phaser.Input.Keyboard.JustDown(s)){
            this.scene.start("PlayingScreen");
        }

        if (Phaser.Input.Keyboard.JustDown(up) && row >= 1 && step == 5) //Prevent "holding down" actions
        {
            step = 6;
            if(row == 1){
                sound.play('up');
                player.y = menuRow2Y;
                row = 2;
                player.x = menuLane[row - 1].length;
            }
            else{
                sound.play('up');
                player.y -= playerYVariance;
                row --;
                player.x = menuLane[row - 1].length;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(down) && row <= 2 && step == 2)
        {
            step = 3;
            if(row == 2){
                sound.play('down');
                player.y = menuRow1Y;
                row = 1;
                player.x = menuLane[row - 1].length;
            }
            else{
                sound.play('down');
                player.y += playerYVariance;
                row ++;
                player.x = menuLane[row - 1].length;
            }
        }

        if(cursors.left.isDown && step == 6){
            player.setVelocityX(playerMoveSpeed);
        }
        else{
            player.setVelocityX(0);
        }

        if(Phaser.Input.Keyboard.JustDown(space) && (step == 1|| step == 4 || step == 8)){
            player.x = menuLane[row - 1].length;
            if(step == 1){
                step = 2;
            }
            else if(step == 4){
                step = 5;
            }
            else if(step == 8){
                step = 0;
            }

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

        if(Phaser.Input.Keyboard.JustUp(right) && (step == 3 || step == 7)){
            //change the type of usingBomb here if we didn't use meter
            if(step == 3){
                step = 4;
            }
            else if(step == 7){
                step = 8;
            }
            if(menuUsedMeter == false)
            {
                usingBomb = !usingBomb;
                changeThrowableDisplay(true);
            }

            menuUsedMeter = false;
        }
    }
}

function spawnPenguin() {
    var penguin = penguins.get();
    if (penguin) {
        penguin.fire()
    }
}

function spawnBear() {
    var bear = bears.get();
    if (bear) {
        bear.fire()
    }
}

function menuPlatePicked(){
    if(step == 6){
        step = 7;
    }
}

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
            lowerHealth();
            plateAnim.setActive(false);
            plateAnim.setVisible(false);
            //console.log("animation complete");
        });
    }
}
function addSushiFalingAnim(x,y) {
    var anim = sushiFallingAnims.get();
    anim.setActive(true);
    anim.setVisible(true);
    if(anim)
    {
        anim.x = x;
        anim.y = y;
        anim.anims.play('sushi_fallingAnim',false);
        anim.once('animationcomplete',()=>{
            sound.play('plate_crash');
            //lowerHealth();
            anim.setActive(false);
            anim.setVisible(false);
        })
    }
}
function addBombFalingAnim(x,y) {
    var anim = bombFallingAnims.get();
    anim.setActive(true);
    anim.setVisible(true);
    if(anim)
    {
        anim.x = x;
        anim.y = y;
        anim.anims.play('bomb_fallingAnim',false);
        anim.once('animationcomplete',()=>{
            sound.play('plate_crash');
            //lowerHealth();
            anim.setActive(false);
            anim.setVisible(false);
        })
    }
}
