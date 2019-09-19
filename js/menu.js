var space;
var level;
var score;
var up, down, left, right, space, q, s;
var cursors;
var row;
var sound;

const playerMenuOffSetX = 1080;
const menuRow1Y = 640;
const menuRow2Y = 860;

const menuPenguinSpeed = 0;
const menuBearSpeed = 0;

let menuLane;

class Menu extends Phaser.Scene {
    constructor(){
        super("MenuScreen");
    }
    preload(){
        this.load.image('Menu_background', 'assets/menuBG.png');
        this.load.image('title', 'assets/Flipper.png');
        this.load.image('table_1136','assets/Table_852.png');
        this.load.image('player', 'assets/PenguinWaiterSushi.png');
        this.load.image('player_bomb','assets/PenguinWaiterBOMB.png');
        this.load.image('penguin', 'assets/PenguinCustomerFinal.png');
        this.load.image('bear','assets/PolarBearFinal.png');
        this.load.image('bomb','assets/BombFinal.png');
        this.load.image('sushi_icon', 'assets/sushi_icon.png');
        this.load.image('bomb_icon', 'assets/bomb_icon.png');
        this.load.image('Bear_blasted','assets/Bear_blasted.png');

        this.load.spritesheet('sushi_falling','assets/anim/SushiPlate_Animation.png', {frameWidth: 186, frameHeight: 218});
        this.load.spritesheet('bomb_falling','assets/anim/BombPlate_Animation.png', {frameWidth: 186, frameHeight: 218});
        this.load.spritesheet('penguin_eating','assets/anim/PenguinEating_Animation.png', {frameWidth: 182, frameHeight: 346});
        this.load.spritesheet('falling_plate','assets/anim/EmptyPlate_Animation.png',{frameWidth: 196, frameHeight: 218});
        this.load.spritesheet('boom','assets/anim/boom.png', {frameWidth: 128, frameHeight: 128});
        this.load.spritesheet('Table_1136-568','assets/anim/Table_1136-568.png', {frameWidth: 1420, frameHeight: 130});


        this.load.audio('break','assets/audio/mug_break.mp3');
        this.load.audio('plate_crash','assets/audio/plate-crash.mp3');
        this.load.audio('explosion','assets/audio/explosion.mp3');
        this.load.audio('throw_mug','assets/audio/throw_mug.wav')
        this.load.audio('up','assets/audio/up.wav');
        this.load.audio('down','assets/audio/down.wav');
        this.load.audio('get_mug','assets/audio/get_mug.wav');
        this.load.audio('penguin_out','assets/audio/out_customer.wav');
        this.load.audio('penguin_in','assets/audio/popup.wav');
        this.load.audio('bear_groan', 'assets/audio/bear_groan.mp3');
        this.load.audio('sizzle', 'assets/audio/sizzle.mp3');
        this.load.audio('slurp', 'assets/audio/slurp.mp3');
        this.load.audio('penguin_scream', 'assets/audio/penguin_scream.mp3');
    }
    create(){
        backgroundImage = this.add.image(screenWidth/2, screenHeight/2, 'Menu_background');
        this.add.image(screenWidth/2, screenHeight/2 - 250, 'title');



        var lane1 = this.add.sprite(laneImgX, menuRow1Y + tableYOffset, 'table_1136');
        var lane2 = this.add.sprite(laneImgX, menuRow2Y + tableYOffset, 'table_1136');

        player = this.physics.add.image(screenWidth - playerMenuOffSetX, menuRow1Y, 'player').setOrigin(0,0);
        row = 1;
        score = 0;
        level = 1;
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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

        this.add.text(960, 540, "Menu" + "\n\nPress S to Begin")


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
                this.setPosition(300, menuRow2Y);
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
                        this.speed = bearSpeed;
                        this.x -= this.speed * delta * pushedBackMod;
                    }
                    else
                    {
                        this.x -= this.fastSpeed * delta * pushedBackMod;
                    }

                }
                else
                {
                    if(this.spedUp == false)
                    {
                        this.x += this.speed * delta;
                    }
                    else
                    {
                        this.x += this.fastSpeed * delta;
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
                    console.log('pushed out of screen');
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
                    this.speed = Phaser.Math.GetSpeed(0, 1); // Set the penguins' speed
                    this.pushedBack = false; //If the penguin is pushed back
                    this.drinking = false; //If the penguin is drinking
                    this.pushedBackXLocation = 0; //the location where the penguin was pushed back
                    this.drinkTimer = 0; //the time for drinking
                },
            fire: function (x, y){
                this.setTexture('penguin', 0);
                this.setPosition(440, menuRow1Y);
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
                        this.drinkTimer = 0;
                        this.setTexture('penguin_eating', 0);
                        sushiOnHit(this.x, this.y); //send off the sushi after eating
                        //console.log("spawn plate 1")
                    }
                }
                else
                {
                    this.x += this.speed * delta;
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
                    Phaser.GameObjects.Sprite.call(this, game, 0, 0, 'sushi_falling');
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

    update(){
        changeThrowableDisplay(false);

        if(Phaser.Input.Keyboard.JustDown(s)){
            this.scene.start("PlayingScreen");
        }

        if (Phaser.Input.Keyboard.JustDown(up) && row >= 1) //Prevent "holding down" actions
        {
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
        if (Phaser.Input.Keyboard.JustDown(down) && row <= 2)
        {
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

        if(cursors.left.isDown){
            player.setVelocityX(playerMoveSpeed);
        }
        else{
            player.setVelocityX(0);
        }

        if(Phaser.Input.Keyboard.JustDown(space)){
            player.x = menuLane[row - 1].length;
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

        if(Phaser.Input.Keyboard.JustUp(right)){
            //change the type of usingBomb here if we didn't use meter
            console.log('right hit');
            if(justUsedMeter == false)
            {
                usingBomb = !usingBomb;
                changeThrowableDisplay(true);
            }

            justUsedMeter = false;
        }

        spawnPenguin();
        spawnBear();
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
