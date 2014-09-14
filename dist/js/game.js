(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'pixel-pirates');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":2,"./states/gameover":3,"./states/menu":4,"./states/play":5,"./states/preload":6}],2:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],3:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],4:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.game.state.start('play');
    // var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    // this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'ship');
    // this.sprite.anchor.setTo(0.5, 0.5);

    // this.titleText = this.game.add.text(this.game.world.centerX, 300, 'Pixel Pirates', style);
    // this.titleText.anchor.setTo(0.5, 0.5);

    // this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    // this.instructionsText.anchor.setTo(0.5, 0.5);

    // this.sprite.angle = -20;
    // this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],5:[function(require,module,exports){
'use strict';
function Play() {}
Play.prototype = {
  create: function() {
    // Set stage background color
    this.map = this.game.add.tilemap('map1');
    this.map.addTilesetImage('dg_edging132', 'dg_edging132');
    this.map.addTilesetImage('dg_edging232', 'dg_edging232');
    this.map.addTilesetImage('dg_edging332', 'dg_edging332');

    //create layers
    this.backgroundLayer = this.map.createLayer('water');
    this.blockedLayer = this.map.createLayer('land');
    this.treeLayer = this.map.createLayer('trees');

    //collision on land
    this.map.setCollisionBetween(1, 100000, true, 'land');

    //resizes the game world to match the layer dimensions
    this.backgroundLayer.resizeWorld();

    // Define motion constants
    this.ROTATION_SPEED = 120; // degrees/second
    this.ACCELERATION = 150; // pixels/second/second
    this.MAX_SPEED = 150; // pixels/second
    this.DRAG = 160; // pixels/second

    // Add the ship to the stage
    this.ship = this.game.add.sprite(this.game.width/2, this.game.height/2, 'ship');
    this.ship.anchor.setTo(0.5, 0.5);
    this.ship.angle = -90; // Point the ship up

    // Init Cannonball properties
    this.cannonballs = 0;
    this.fireRate = 1000;
    this.nextFire = 0;

    // Enable physics on the ship
    this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);

    // Set maximum velocity
    this.ship.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y

    // Add drag to the ship that slows it down when it is not accelerating
    this.ship.body.drag.setTo(this.DRAG, this.DRAG); // x, y

    // Ship cannot leave world bounds
    this.ship.body.collideWorldBounds = true;

    // Capture certain keys to prevent their default actions in the browser.
    // This is only necessary because this is an HTML5 game. Games on other
    // platforms may not need code like this.
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN,
        Phaser.Keyboard.Z
    ]);

    // Cannonball physics
    this.cannonballs = this.game.add.group();
    this.cannonballs.enableBody = true;
    this.cannonballs.physicsBodyType = Phaser.Physics.ARCADE;
    this.cannonballs.createMultiple(30, 'cannonballs', 0, false);
    this.cannonballs.setAll('anchor.x', 0.5);
    this.cannonballs.setAll('anchor.y', 0.5);
    this.cannonballs.setAll('outOfBoundsKill', true);
    this.cannonballs.setAll('checkWorldBounds', true);

    this.ship.bringToTop();
  },
  update: function() {
    this.game.physics.arcade.collide(this.ship, this.blockedLayer);

    if (this.leftInputIsActive()) {
      // If the LEFT key is down, rotate left
      this.ship.body.angularVelocity = -this.ROTATION_SPEED;
    } else if (this.rightInputIsActive()) {
      // If the RIGHT key is down, rotate right
      this.ship.body.angularVelocity = this.ROTATION_SPEED;
    } else {
      // Stop rotating
      this.ship.body.angularVelocity = 0;
    }

    if (this.upInputIsActive()) {
      // If the UP key is down, thrust
      // Calculate acceleration vector based on this.angle and this.ACCELERATION
      this.ship.body.acceleration.x = Math.cos(this.ship.rotation) * this.ACCELERATION;
      this.ship.body.acceleration.y = Math.sin(this.ship.rotation) * this.ACCELERATION;

      // Show the frame from the spritesheet with the engine on
      //this.ship.frame = 1;
    } else {
        // Otherwise, stop thrusting
        this.ship.body.acceleration.setTo(0, 0);

        // Show the frame from the spritesheet with the engine off
        //this.ship.frame = 0;
    }

    if (this.ship.body.velocity.y == 0 && this.ship.body.velocity.x == 0){
      this.ship.frame = 0;
    }
    else{
      this.ship.frame = 1;
    }
    // Fire listener
    if (this.input.keyboard.isDown(Phaser.Keyboard.Z))
    {
        //  Boom!
        this.fire();
    }
  },
  // This function should return true when the player activates the "go left" control
  // In this case, either holding the right arrow or tapping or clicking on the left
  // side of the screen.
  leftInputIsActive: function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    isActive |= (this.game.input.activePointer.isDown &&
        this.game.input.activePointer.x < this.game.width/4);

    return isActive;
  },

  // This function should return true when the player activates the "go right" control
  // In this case, either holding the right arrow or tapping or clicking on the right
  // side of the screen.
  rightInputIsActive: function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
    isActive |= (this.game.input.activePointer.isDown &&
        this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

    return isActive;
  },

  // This function should return true when the player activates the "up" control
  // In this case, either holding the up arrow or tapping or clicking on the center
  // part of the screen.
  upInputIsActive: function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.UP);
    isActive |= (this.game.input.activePointer.isDown &&
        this.game.input.activePointer.x > this.game.width/4 &&
        this.game.input.activePointer.x < this.game.width/2 + this.game.width/4);

    return isActive;
  },

  // This function will fire the cannons!
  fire: function() {
    if (this.game.time.now > this.nextFire && this.cannonballs.countDead() > 0){
      this.nextFire = this.game.time.now + this.fireRate;
      var cannonball = this.cannonballs.getFirstExists(false);
      cannonball.reset(this.ship.x, this.ship.y);
      cannonball.rotation = this.ship.rotation - 90;
      this.game.physics.arcade.velocityFromRotation(this.ship.rotation - 1.45, 400, cannonball.body.velocity);
    }
  }
};

module.exports = Play;
},{}],6:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.spritesheet('ship', 'assets/ship1_pixmap.png', 64, 32);
    this.load.tilemap('map1', 'assets/tilemaps/map1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('dg_edging132', 'assets/tilesets/dg_edging132.gif');
    this.load.image('dg_edging232', 'assets/tilesets/dg_edging232.gif');
    this.load.image('dg_edging332', 'assets/tilesets/dg_edging332.gif');
    this.load.image('cannonballs', 'assets/cannonballs.png');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])