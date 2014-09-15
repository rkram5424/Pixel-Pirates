
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

    this.load.audio('pirate', ['assets/audio/music/You_Are_a_Pirate.ogg']);
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
