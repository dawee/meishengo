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
StoneRoll.prototype.max = 10;


/* Initialize prisoners events */

StoneRoll.prototype.initialize = function (opts) {
  _.bindAll(this, 'check', 'appendStones');

  this.followingPlayer = false;
  this.game = opts.game;
  this.stoneColor = opts.color;
  this.playerColor = (opts.color === 'black' ? 'white' : 'black');
  this.model = new Backbone.Model({count: 0});
  this.game.on('change', this.check);
  this.model.on('change:count', this.appendStones);
  this.model.set({count: opts.count});
};

/* Check prisoners value */

StoneRoll.prototype.check = function () {
  if (!this.game.has(this.playerColor)) return;

  var player = this.game.get(this.playerColor);
  
  if (!this.followingPlayer) {
    this.game.off('change', this.check);
    player.on('change', this.check);
    this.followingPlayer = true;
  }

  this.model.set('count', player.get('prisoners'));
};

/* Append new stones and check if roll is full */

StoneRoll.prototype.appendStones = function (model, newCount) {
  var delta = newCount - model.previous('count');
  var rest = 0;
  var index = 0;
  
  if (newCount >= this.max) {
    delta = this.max - model.previous('count');
    rest = newCount - (model.previous('count') + delta);
    this.$el.addClass('compact');
    this.game.get(this.playerColor).off('change', this.check);
    this.trigger('full', {count: rest});
  }

  for (index = 0; index < delta; index++) {
    this.$el.append(
      $('<mei-stone>')
        .addClass(this.stoneColor)
        .addClass('roll-slot-' + (index + model.previous('count')))
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
  this.createStoneRoll({count: 0}); 
};

/* Create a new roll and listen to full event of the new one */

StoneRack.prototype.createStoneRoll = function (opts) {
  var roll = new StoneRoll({
    color: this.color,
    game: this.game,
    count: opts.count
  });
  
  this.$el.append(roll.render().el);
  roll.once('full', this.createStoneRoll);
};

/* Resize in px with the given geom */

StoneRack.prototype.resize = function (geom) {
  this.$el.css(geom);
};
