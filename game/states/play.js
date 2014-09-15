'use strict';
function Play() {}
Play.prototype = {
  create: function() {
    // Music
    this.music = this.game.add.audio('pirate',1,true);
    this.music.volume = 0.4;
    // Load music
    //this.music.play('');

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
        Phaser.Keyboard.W,
        Phaser.Keyboard.A,
        Phaser.Keyboard.S,
        Phaser.Keyboard.D,
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT
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
    if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        //  Boom!
        this.fire('L');
    }
    if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        //  Boom!
        this.fire('R');
    }
  },
  // This function should return true when the player activates the "go left" control
  // In this case, either holding the right arrow or tapping or clicking on the left
  // side of the screen.
  leftInputIsActive: function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.A);
    isActive |= (this.game.input.activePointer.isDown &&
        this.game.input.activePointer.x < this.game.width/4);

    return isActive;
  },

  // This function should return true when the player activates the "go right" control
  // In this case, either holding the right arrow or tapping or clicking on the right
  // side of the screen.
  rightInputIsActive: function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.D);
    isActive |= (this.game.input.activePointer.isDown &&
        this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

    return isActive;
  },

  // This function should return true when the player activates the "up" control
  // In this case, either holding the up arrow or tapping or clicking on the center
  // part of the screen.
  upInputIsActive: function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.W);
    isActive |= (this.game.input.activePointer.isDown &&
        this.game.input.activePointer.x > this.game.width/4 &&
        this.game.input.activePointer.x < this.game.width/2 + this.game.width/4);

    return isActive;
  },

  // This function will fire the cannons!
  fire: function(left_right) {
    var angle = 0;
    if (left_right == 'L'){
      angle = -90;
    }
    else{
      angle = 90;
    }
    if (this.game.time.now > this.nextFire && this.cannonballs.countDead() > 0){
      this.nextFire = this.game.time.now + this.fireRate;
      var cannonball = this.cannonballs.getFirstExists(false);
      cannonball.reset(this.ship.x, this.ship.y);
      cannonball.rotation = this.ship.rotation + angle;
      this.game.physics.arcade.velocityFromRotation(this.ship.rotation + angle, 400, cannonball.body.velocity);
    }
  }
};

module.exports = Play;