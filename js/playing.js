var player;
var up, down, space;
var row;
var beers, drinkers, bottles;
var random;
var drinkerTimer, bottleTimer;
var ui;
var score, hp;
var emmiter; //event emmiter

const screenWidth = 1920;
const screenHeight = 1080;
const playerXOffset = 300;

const row1Position = 100;
const row2Position = 320;
const row3Position = 540;
const row4Position = 760;

class Playing extends Phaser.Scene{
    constructor(){
        super('PlayingScreen');
    }


//Load Assets
    preload ()
    {
        this.load.image('background', 'assets/back.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('beer', 'assets/beer.png');
        this.load.image('drinker', 'assets/drinker.png');
        this.load.image('bottle', 'assets/bottle.png');
    }
//Create Objects
    create ()
    {
        this.add.image(960, 540, 'background');
        player = this.add.image(screenWidth - playerXOffset, 0 + 100, 'player');
        up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP); //Assign key actions
        down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        drinkerTimer = this.time.addEvent({ delay: 3000, callback: spawnDrinker, loop: true }); //Spawn drinkers based on a time delay
        row = 1; //Limits the number of rows
        ui = this.add.text(screenWidth - playerXOffset, 10, '');
        score = 0;
        hp = 3;

        emmiter = new Phaser.Events.EventEmitter();
        emmiter.on('getBeer', beerOnHit, this);

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
                        if (this.x < drinkers.children.entries[elem].x)
                        {
                            drinkers.children.entries[elem].x -= 300; //TODO: Fix to also account for effect of pushing back, as well as if the person lives and has to throw back their item
                            emmiter.emit('getBeer', this.x, this.y);
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
                },
            fire: function (){
                random = Math.floor(Math.random() * Math.floor(4)); //Randomly selects drinkers' spawn locations
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

                this.setActive(true);
                this.setVisible(true);
            },
            update: function (time, delta)
            {
                this.x += this.speed * delta;
                if (this.x > screenWidth - playerXOffset) //if reaching the player
                {
                    //Reached player fail state
                    this.setActive(false);
                    this.setVisible(false);
                    hp--;
                }
                if (this.x < 0) //if pushed back off the screen
                {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }

        });
        drinkers = this.add.group({
            classType: Drinker,
            maxSize: 9,
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
        ui.setText('HP: ' + hp + '\nScore: ' + score);
        if(hp <= 0){
            this.scene.start("FailScreen");
        }

        if (Phaser.Input.Keyboard.JustDown(up) && row > 1) //Prevent "holding down" actions
        {
            player.y -= 220;
            row --;
        }
        else if (Phaser.Input.Keyboard.JustDown(down) && row < 4)
        {
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

function spawnDrinker() {
    var drinker = drinkers.get();
    if (drinker) {
        drinker.fire()
    }
}

function spawnBottle(x,y){
    var bottle = bottles.get();
    if(bottle){
        bottle.fire(x,y);
    }
}

function beerOnHit(x, y) {
    console.log("Beer hit a customer");
    spawnBottle(x,y)
}
