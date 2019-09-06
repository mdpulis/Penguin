var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var up, down, space;
var row;
var beers, drinkers, bottles;
var random;
var drinkerTimer, bottleTimer;
//Load Assets
function preload ()
{
    this.load.image('background', 'assets/back.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('beer', 'assets/beer.png');
    this.load.image('drinker', 'assets/drinker.png');
    this.load.image('bottle', 'assets/bottle.png');
}
//Create Objects
function create ()
{
    this.add.image(960, 540, 'background');
    player = this.add.image(1920 - 200, 0 + 100, 'player');
    up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP); //Assign key actions
    down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    drinkerTimer = this.time.addEvent({ delay: 3000, callback: spawnDrinker, loop: true }); //Spawn drinkers based on a time delay
    bottleTimer = this.time.addEvent({ delay: 7000, callback: spawnBottle, loop: true }); //Spawn bottles based on a time delay
    row = 1; //Limits the number of rows
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
            if (this.x < 0)
            {
                this.setActive(false);
                this.setVisible(false);
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
                this.setPosition(0, 100);
            }
            else if(random == 1){
                this.setPosition(0, 320);
            }
            else if(random == 2){
                this.setPosition(0, 540);
            }
            else if(random == 3){
                this.setPosition(0, 760);
            }

            this.setActive(true);
            this.setVisible(true);
        },
        update: function (time, delta)
        {
            this.x += this.speed * delta;
            if (this.x > 1920)
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
        fire: function (){
            random = Math.floor(Math.random() * Math.floor(4)); //Randomly selects bottles' spawn locations
            if(random == 0){
                this.setPosition(0, 100);
            }
            else if(random == 1){
                this.setPosition(0, 320);
            }
            else if(random == 2){
                this.setPosition(0, 540);
            }
            else if(random == 3){
                this.setPosition(0, 760);
            }

            this.setActive(true);
            this.setVisible(true);
        },
        update: function (time, delta)
        {
            this.x += this.speed * delta;
            if (this.x > 1920)
            {
                this.setActive(false);
                this.setVisible(false);
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
function update (time)
{

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

//Extra Functions
function spawnDrinker() {
    var drinker = drinkers.get();
    if (drinker) {
        drinker.fire()
    }
}
function spawnBottle() {
    var bottle = bottles.get();
    if (bottle) {
        bottle.fire()
    }
}
