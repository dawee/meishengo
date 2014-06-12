/*
 * Module dependencies
 */

var _ = require('underscore');
var $ = require('zepto').$;
var Backbone = require('backbone');


/*
 * StoneRoll
 */

var StoneRoll = Backbone.View.extend();

StoneRoll.prototype.tagName = 'mei-stone-roll';
StoneRoll.prototype.max = 20;


/* Initialize prisoners events */

StoneRoll.prototype.initialize = function (opts) {
  _.bindAll(this, 'check', 'appendStones');

  this.index = opts.index;
  this.followingPlayer = false;
  this.game = opts.game;
  this.stoneColor = opts.color;
  this.playerColor = (opts.color === 'black' ? 'white' : 'black');
  this.model = new Backbone.Model({count: 0});
  this.game.on('change', this.check);
  this.model.on('change:count', this.appendStones);
  this.model.set({count: 0});

  this.check();
};

/* Check prisoners value */

StoneRoll.prototype.check = function () {
  if (!this.game.has(this.playerColor)) return;

  var player = this.game.get(this.playerColor);
  var count = player.get('prisoners') - (this.index * this.max);
  
  if (!this.followingPlayer) {
    this.game.off('change', this.check);
    player.on('change', this.check);
    this.followingPlayer = true;
  }

  if (count <= this.max) this.model.set('count', count);
};

/* Append new stones and check if roll is full */

StoneRoll.prototype.appendStones = function (model, newCount) {
  var previous = model.previous('count');
  var index = 0;

  for (index = previous; index < newCount; index++) {
    this.$el.append(
      $('<mei-stone>')
        .addClass(this.stoneColor)
        .addClass('roll-slot-' + index)
        .append($('<span>').addClass('shadow'))
        .append($('<span>').addClass('light'))
    );
  }

};


/*
 * StoneRack : wrapper of StoneRoll
 */

var StoneRack = module.exports = Backbone.View.extend();

StoneRack.prototype.tagName = 'mei-stone-rack';


/* Initialize the first roll */

StoneRack.prototype.initialize = function (opts) {
  _.bindAll(this, 'createStoneRoll');

  this.game = opts.game;
  this.color = opts.color;
  this.createStoneRoll({index: 0}); 
};

/* Create a new roll and listen to full event of the new one */

StoneRack.prototype.createStoneRoll = function (opts) {
  var roll = new StoneRoll({
    color: this.color,
    game: this.game,
    index: opts.index
  });
  
  this.$el.append(roll.render().el);
};

/* Resize in px with the given geom */

StoneRack.prototype.resize = function (geom) {
  this.$el.css(geom);
};
